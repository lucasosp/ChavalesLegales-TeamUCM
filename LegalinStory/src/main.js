import { App } from "./app/App.js";
import {
  loadStory,
  loadStoryIndex,
  resolveCharacterAsset,
} from "./content/contentLoader.js";
import { LocalStorageSaveStore } from "./services/saveStores.js";
import { StorySelector } from "./ui/StorySelector.js";
import "./styles/main.css";

const root = document.querySelector("#app");

let index = null;
let app = null;
let session = 0;

async function init() {
  showLoading("the library");

  try {
    index = await loadStoryIndex();

    const requestedId = new URLSearchParams(location.search).get("story");
    const requested = requestedId
      ? index.stories.find((story) => story.id === requestedId)
      : null;

    if (requested) {
      history.replaceState({}, "", location.pathname);
      await startStory(requested);
    } else {
      showLibrary();
    }
  } catch (error) {
    showError(error, { retry: true });
  }
}

function showLibrary() {
  session += 1;
  app?.destroy();
  app = null;

  document.title = "LegalinStory — Story Library";
  history.replaceState({}, "", location.pathname);

  if (!index) {
    init();
    return;
  }

  new StorySelector(root, {
    stories: index.stories,
    onSelect: startStory,
  });
}

async function startStory(entry) {
  const token = ++session;

  app?.destroy();
  app = null;

  const url = new URL(location.href);
  url.searchParams.set("story", entry.id);
  history.replaceState({}, "", url);

  showLoading(entry.title);

  try {
    const content = await loadStory(entry);
    if (token !== session) return;

    document.title = `${content.title} — LegalinStory`;
    preloadCharacterArt(content.assets);

    app = new App({
      root,
      story: content.story,
      startId: content.startId,
      title: content.title,
      saveStore: new LocalStorageSaveStore(`${entry.id}.save`),
      resolveCharacter: content.resolveCharacter,
      resolveBackground: content.resolveBackground,
      rights: content.rights,
      onExit: showLibrary,
    });
    app.start();
  } catch (error) {
    if (token !== session) return;
    showError(error, { retry: false });
  }
}

function showLoading(title) {
  root.innerHTML = `
    <main class="load-screen" aria-busy="true">
      <p class="library-kicker">Opening</p>
      <h1 class="load-title" data-load-title></h1>
      <span class="load-pulse" aria-hidden="true"></span>
    </main>
  `;
  document.title = `Opening ${title} — LegalinStory`;
  root.querySelector("[data-load-title]").textContent = title;
}

function showError(error, { retry }) {
  console.error(error);
  document.title = "Content error — LegalinStory";

  root.innerHTML = `
    <main class="load-screen">
      <p class="library-kicker">Content error</p>
      <h1 class="load-title">The story could not be opened.</h1>
      <p class="load-message" data-error></p>
      <button class="load-button" type="button" data-retry></button>
    </main>
  `;

  root.querySelector("[data-error]").textContent =
    error instanceof Error ? error.message : String(error);

  const button = root.querySelector("[data-retry]");
  button.textContent = retry ? "Retry" : "Back to library";
  button.addEventListener("click", () => (retry ? init() : showLibrary()));
}

function preloadCharacterArt(assets) {
  if (typeof Image !== "function") return;

  for (const [id, character] of Object.entries(assets.characters ?? {})) {
    for (const expression of Object.keys(character.expressions ?? {})) {
      const image = new Image();
      image.src = resolveCharacterAsset(assets, { id, expression });
    }
  }
}

init();
