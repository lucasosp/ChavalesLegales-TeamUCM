/**
 * End-to-end test for the JSON content pipeline and the library screen.
 *
 * Starts Vite (which also runs the content validator), loads the registry and
 * both stories through the same fetch-based loader the browser uses, runs one
 * story, then clicks a card in the story selector.
 */
import { createServer } from "vite";
import { JSDOM } from "jsdom";

const server = await createServer({
  logLevel: "silent",
  server: { host: "127.0.0.1", port: 0 },
});

await server.listen();
const url = server.resolvedUrls.local[0];

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
  url,
  pretendToBeVisual: true,
});

const { window } = dom;
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.Element = window.Element;
globalThis.localStorage = window.localStorage;
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.matchMedia = globalThis.matchMedia;

const { App } = await import("../src/app/App.js");
const { loadStory, loadStoryIndex } = await import("../src/content/contentLoader.js");
const { MemorySaveStore } = await import("../src/services/saveStores.js");
const { StorySelector } = await import("../src/ui/StorySelector.js");

const fail = (message) => {
  throw new Error(message);
};

try {
  const index = await loadStoryIndex();
  if (index.stories.length !== 3) {
    fail(`expected 3 stories in the registry, found ${index.stories.length}`);
  }

  const featured = await loadStory(index.stories[2]);
  if (featured.title !== "No lo reenvíes") {
    fail(`unexpected third story: ${featured.title}`);
  }
  if (!featured.rights) fail("rights content was not loaded for No lo reenvíes");

  const content = await loadStory(index.stories[0]);
  const saveStore = new MemorySaveStore();
  const root = document.querySelector("#app");

  if (!saveStore.load() && content.startId !== "start") {
    fail(`unexpected start node: ${content.startId}`);
  }

  const app = new App({
    root,
    story: content.story,
    startId: content.startId,
    title: content.title,
    saveStore,
    resolveCharacter: content.resolveCharacter,
    resolveBackground: content.resolveBackground,
  });
  app.start();

  const text = root.querySelector("[data-text]");
  const sprite = root.querySelector("[data-sprite]");
  const character = root.querySelector("[data-character]");
  const background = root.querySelector(".scene-bg.is-active");

  app.view.skipTyping();
  if (!text.textContent.includes("last bell")) fail(`start text not rendered: ${text.textContent}`);
  if (!sprite.src.endsWith("/assets/characters/hana/neutral.svg")) {
    fail(`character asset not resolved: ${sprite.src}`);
  }
  if (character.className !== "character is-visible expression-neutral") {
    fail(`character state is wrong: ${character.className}`);
  }
  if (character.dataset.position !== "center") {
    fail(`scene position was not applied: ${character.dataset.position}`);
  }
  if (!background.style.backgroundImage.includes("classroom-dusk.svg")) {
    fail(`background asset not resolved: ${background.style.backgroundImage}`);
  }

  // Advance to the first choice, then pick "accept". The branch node should
  // auto-route to accept-1 without the user seeing a blank beat.
  for (let i = 0; i < 4; i += 1) {
    if (app.view.isTyping()) app.view.skipTyping();
    app.advance();
  }
  if (app.view.isTyping()) app.view.skipTyping();

  const choices = root.querySelector("[data-choices]");
  if (choices.hidden) fail("choice options were not rendered");
  choices.querySelector(".choice").click();

  if (app.engine.nodeId !== "accept-1") {
    fail(`branch did not route to accept-1 (got ${app.engine.nodeId})`);
  }
  if (app.engine.flags.acceptedInvitation !== true) {
    fail("choice flags were not applied");
  }
  if (saveStore.load()?.nodeId !== "accept-1") {
    fail("progress was not persisted");
  }

  const libraryRoot = document.createElement("div");
  document.body.append(libraryRoot);
  let selected = null;

  new StorySelector(libraryRoot, {
    stories: index.stories,
    onSelect: (story) => {
      selected = story;
    },
  });

  const cards = libraryRoot.querySelectorAll(".story-card");
  if (cards.length !== 3) fail(`expected 3 story cards, found ${cards.length}`);
  if (!cards[0].querySelector(".story-cover").src.includes("classroom-dusk.svg")) {
    fail("story cover was not resolved");
  }
  cards[2].click();
  if (selected?.id !== "no-lo-reenvies") {
    fail(`library selected the wrong story: ${selected?.id}`);
  }

  console.log("Library smoke test passed");
  console.log("stories:", index.stories.map((story) => story.id).join(", "));
  console.log("branch routed to:", app.engine.nodeId);
} finally {
  await server.close();
}
