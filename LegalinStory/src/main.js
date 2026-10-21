import { App } from "./app/App.js";
import {
  loadStory,
  loadStoryIndex,
  resolveCharacterAsset,
} from "./content/contentLoader.js";
import { LocalStorageSaveStore } from "./services/saveStores.js";
import "./styles/main.css";

const root = document.querySelector("#app");

let index = null;
let app = null;
let session = 0;

async function init() {
  showLoading("No lo reenvíes");

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
      await startStory(index.stories[0]);
    }
  } catch (error) {
    showError(error, { retry: true });
  }
}

function showLibrary() {
  session += 1;
  app?.destroy();
  app = null;

  // When embedded, the host owns navigation. Standalone use returns to the platform.
  if (window.parent !== window) window.parent.postMessage({ type: "legalinstory:exit" }, location.origin);
  else {
    const local = ["localhost", "127.0.0.1"].includes(location.hostname);
    location.assign(import.meta.env.VITE_PLATFORM_URL || (local ? `${location.protocol}//${location.hostname}:3000/` : "/"));
  }
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
      <p class="library-kicker">Chavales Legales</p>
      <h1 class="load-title" data-load-title></h1>
      <span class="load-pulse" aria-hidden="true"></span>
    </main>
  `;
  document.title = `Abriendo ${title} — Chavales Legales`;
  root.querySelector("[data-load-title]").textContent = title;
}

function showError(error, { retry }) {
  console.error(error);
  document.title = "Error al cargar — Chavales Legales";

  root.innerHTML = `
    <main class="load-screen">
      <p class="library-kicker">No se ha podido cargar</p>
      <h1 class="load-title">No hemos podido abrir la historia.</h1>
      <p class="load-message" data-error></p>
      <button class="load-button" type="button" data-retry></button>
    </main>
  `;

  root.querySelector("[data-error]").textContent =
    error instanceof Error ? error.message : String(error);

  const button = root.querySelector("[data-retry]");
  button.textContent = "Volver a intentar";
  button.addEventListener("click", () => init());
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
