import { EventBus } from "../core/EventBus.js";
import { VisualNovelEngine } from "../core/VisualNovelEngine.js";
import { VisualNovelView } from "../ui/VisualNovelView.js";

/**
 * Composition root.
 *
 * Owns the object graph and translates input gestures into engine commands:
 * engine (domain) -> events -> view (presentation).
 *
 * Swapping the view, the save store, the story data, or the character asset
 * resolver only touches this file and the entry point.
 */
export class App {
  /**
   * @param {{
   *   root: HTMLElement,
   *   story: Record<string, any>,
   *   startId?: string,
   *   title?: string,
   *   saveStore?: { load(): any, save(data: any): void, clear(): void } | null,
   *   nodeTypes?: Record<string, { present: (node: any) => void, next?: (node: any) => string|null, auto?: boolean }>,
   *   onExit?: () => void,
   *   resolveCharacter?: (character: { id: string, expression: string }) => string,
   *   resolveBackground?: (sceneId: string) => string | null,
   *   rights?: Record<string, any> | null,
   * }} options
   */
  constructor({
    root,
    story,
    startId = "start",
    title = "Visual Novel",
    saveStore = null,
    nodeTypes = {},
    onExit = null,
    resolveCharacter,
    resolveBackground,
    rights = null,
  }) {
    this.bus = new EventBus();

    const storyNodeTypes = {
      chat: {
        present: (node) => this.bus.emit("chat", node),
        next: (node) => node.next,
      },
      interstitial: {
        present: (node) => this.bus.emit("interstitial", node),
        next: (node) => node.next,
      },
      minigame: {
        present: (node) => this.bus.emit("minigame", node),
        next: (node) => node.next,
      },
      ...nodeTypes,
    };

    this.engine = new VisualNovelEngine({
      story,
      startId,
      bus: this.bus,
      saveStore,
      nodeTypes: storyNodeTypes,
    });

    this.view = new VisualNovelView(root, {
      onAdvance: () => this.advance(),
      onChoose: (optionId) => this.engine.choose(optionId),
      onRestart: () => this.restart(),
      onExit,
      title,
      resolveCharacter,
      resolveBackground,
      rights,
    });

    this.#wireEvents();
  }

  start() {
    this.engine.start();
  }

  advance() {
    if (this.view.isTyping()) {
      this.view.skipTyping();
      return;
    }
    this.engine.advance();
  }

  restart() {
    this.engine.restart();
  }

  destroy() {
    this.view.destroy();
  }

  #wireEvents() {
    this.bus.on("dialogue", (payload) => this.view.showDialogue(payload));
    this.bus.on("choice", (payload) => this.view.showChoices(payload));
    this.bus.on("ending", (payload) => this.view.showEnding(payload));
    this.bus.on("chat", (payload) => this.view.showChat(payload));
    this.bus.on("interstitial", (payload) =>
      this.view.showInterstitial(payload, () => this.engine.advance()),
    );
    this.bus.on("minigame", (payload) =>
      this.view.showMinigame(payload, () => this.engine.advance()),
    );
  }
}
