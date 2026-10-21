import { EventBus } from "./EventBus.js";
import { evaluateCondition } from "./conditions.js";

/**
 * @typedef {Object} CharacterState
 * @property {string} id
 * @property {string} expression
 * @property {string} [at]
 */

/**
 * @typedef {Object} Stage
 * @property {string|null} background
 * @property {CharacterState|null} character
 */

/**
 * @typedef {Object} SaveData
 * @property {string} nodeId
 * @property {Record<string, unknown>} flags
 * @property {Stage} stage
 * @property {string[]} [seen]
 */

/**
 * Graph-based visual novel engine.
 *
 * Responsibilities:
 *  - walk the story graph;
 *  - own flags and the current stage;
 *  - persist progress through an injected SaveStore;
 *  - emit render-agnostic events.
 *
 * It deliberately knows nothing about DOM, CSS, or input devices.
 *
 * Node types are registered through a map, so new kinds of beats can be
 * introduced without editing the engine's control flow (open/closed).
 */
export class VisualNovelEngine {
  /**
   * @param {Object} options
   * @param {Record<string, any>} options.story
   * @param {string} [options.startId]
   * @param {EventBus} [options.bus]
   * @param {{ load(): SaveData|null, save(data: SaveData): void, clear(): void }|null} [options.saveStore]
   * @param {Record<string, { present: (node: any) => void, next?: (node: any) => string|null, auto?: boolean }>} [options.nodeTypes]
   */
  constructor({
    story,
    startId = "start",
    bus = new EventBus(),
    saveStore = null,
    nodeTypes = {},
  }) {
    if (!story || typeof story !== "object") {
      throw new TypeError("VisualNovelEngine requires a story object");
    }

    this.story = story;
    this.startId = startId;
    this.bus = bus;
    this.saveStore = saveStore;

    this.nodeId = startId;
    this.flags = {};
    this.seen = new Set();
    this.stage = { background: null, character: null };
    this.isRunning = false;
    this.isFinished = false;

    /** @type {Map<string, { present: (node: any) => void, next?: (node: any) => string|null, auto?: boolean }>} */
    this.nodeHandlers = new Map();

    this.registerNodeType("dialogue", {
      present: (node) => this.#presentDialogue(node),
      next: (node) => node.next,
    });
    this.registerNodeType("choice", {
      present: (node) => this.#presentChoice(node),
    });
    this.registerNodeType("branch", {
      present: () => {},
      next: (node) => (this.#matches(node.when) ? node.then : node.else),
      auto: true,
    });
    this.registerNodeType("ending", {
      present: (node) => this.#presentEnding(node),
    });

    // Custom node types must be available before validation inspects the story.
    for (const [type, handler] of Object.entries(nodeTypes)) {
      this.registerNodeType(type, handler);
    }

    this.#validateStory();
  }

  get currentNode() {
    return this.story[this.nodeId];
  }

  /**
   * Register a presentation strategy for a node type.
   *
   * `next` lets a custom beat participate in the normal flow without changing
   * the engine. Return a node id to advance, or null to wait for another
   * interaction (as choices do). `auto: true` routes immediately without
   * waiting for input, which is how branch nodes work.
   *
   * @param {string} type
   * @param {{ present: (node: any) => void, next?: (node: any) => string|null, auto?: boolean }} handler
   */
  registerNodeType(type, handler) {
    if (this.nodeHandlers.has(type)) {
      throw new Error(`Node type "${type}" is already registered`);
    }
    if (!handler || typeof handler.present !== "function") {
      throw new TypeError(`Node type "${type}" needs a present function`);
    }
    this.nodeHandlers.set(type, handler);
  }

  /** @param {{ resume?: boolean }} [options] */
  start({ resume = true } = {}) {
    const saved = resume ? this.saveStore?.load() : null;
    const canResume =
      saved &&
      typeof saved === "object" &&
      typeof saved.nodeId === "string" &&
      Boolean(this.story[saved.nodeId]);

    if (canResume) {
      const savedFlags =
        saved.flags && typeof saved.flags === "object" && !Array.isArray(saved.flags)
          ? saved.flags
          : {};
      const savedStage = saved.stage ?? {};

      this.nodeId = saved.nodeId;
      this.flags = { ...savedFlags };
      this.seen = new Set(Array.isArray(saved.seen) ? saved.seen : []);
      this.stage = {
        background:
          typeof savedStage.background === "string" ? savedStage.background : null,
        character:
          savedStage.character && typeof savedStage.character === "object"
            ? savedStage.character
            : null,
      };
    } else {
      this.#resetState();
    }

    this.isRunning = true;
    this.isFinished = false;
    this.#presentCurrentNode();
    return this;
  }

  restart() {
    this.saveStore?.clear();
    this.#resetState();
    this.isRunning = true;
    this.isFinished = false;
    this.#presentCurrentNode();
    return this;
  }

  /**
   * Advance the current beat when its handler exposes a next node.
   * Choice, ending, and other waiting beats return false.
   * @returns {boolean} true when the story moved forward
   */
  advance() {
    if (!this.isRunning || this.isFinished) return false;

    const handler = this.nodeHandlers.get(this.currentNode.type);
    const nextId = handler?.next?.(this.currentNode) ?? null;
    if (!nextId) return false;

    this.#goTo(nextId);
    return true;
  }

  /**
   * Pick an option on the current choice node.
   * @param {string} optionId
   * @returns {boolean}
   */
  choose(optionId) {
    if (!this.isRunning || this.isFinished) return false;

    const node = this.currentNode;
    if (node.type !== "choice") return false;

    const option = node.options.find((candidate) => candidate.id === optionId);
    if (!option || !this.#matches(option.when)) return false;

    this.flags = { ...this.flags, ...(option.flags ?? {}) };
    this.#goTo(option.next);
    return true;
  }

  completeActivity(selectedIds) {
    if (!this.isRunning || this.isFinished || this.currentNode.type !== "minigame") return false;
    if (!Array.isArray(selectedIds)) return false;
    const node = this.currentNode;
    const selected = new Set(selectedIds);
    if (!selected.size || [...selected].some((id) => !node.cards.some((card) => card.id === id))) return false;
    if (node.mode !== "support" && !node.cards.every((card) => Boolean(card.correct) === selected.has(card.id))) return false;
    for (const card of node.cards) {
      if (card.flag) this.flags[card.flag] = selected.has(card.id);
    }
    this.#goTo(node.next);
    return true;
  }

  /** @param {string} nextId */
  #goTo(nextId) {
    if (!this.story[nextId]) {
      throw new Error(`Story node "${nextId}" does not exist`);
    }
    this.nodeId = nextId;
    this.#presentCurrentNode();
  }

  #presentCurrentNode() {
    // Branch nodes route immediately. Loop instead of recursing so a chain of
    // branches cannot overflow the stack.
    for (let guard = 0; guard < 100; guard += 1) {
      const node = this.currentNode;

      // Stage state is inherited: a node only needs to declare what changes.
      if (node.background) this.stage.background = node.background;
      if (node.character !== undefined) {
        this.stage.character =
          node.character === null
            ? null
            : { ...(this.stage.character ?? {}), ...node.character };
      }
      if (node.flags && typeof node.flags === "object") {
        this.flags = { ...this.flags, ...node.flags };
      }
      this.seen.add(this.nodeId);

      const handler = this.nodeHandlers.get(node.type);
      if (!handler) {
        throw new Error(`No handler registered for node type "${node.type}"`);
      }

      if (handler.auto) {
        const nextId = handler.next?.(node) ?? null;
        if (!nextId) {
          throw new Error(`Node "${this.nodeId}" could not resolve its next node`);
        }
        if (!this.story[nextId]) {
          throw new Error(`Story node "${nextId}" does not exist`);
        }
        this.nodeId = nextId;
        continue;
      }

      if (node.type !== "ending") this.#persist();
      handler.present(node);
      return;
    }

    throw new Error("Auto-advance loop exceeded 100 nodes");
  }

  #presentDialogue(node) {
    this.bus.emit("dialogue", {
      id: node.id,
      speaker: node.speaker ?? null,
      text: node.text,
      tone: node.tone ?? (node.speaker ? "spoken" : "narration"),
      stage: this.#stageSnapshot(),
      flags: { ...this.flags },
    });
  }

  #presentChoice(node) {
    const options = node.options.filter((option) => this.#matches(option.when));
    if (options.length === 0) {
      throw new Error(`Choice node "${this.nodeId}" has no available options`);
    }

    this.bus.emit("choice", {
      id: node.id,
      speaker: node.speaker ?? null,
      prompt: node.prompt,
      tone: node.tone ?? "narration",
      options: options.map(({ id, label }) => ({ id, label })),
      stage: this.#stageSnapshot(),
      flags: { ...this.flags },
    });
  }

  #presentEnding(node) {
    this.isFinished = true;
    this.saveStore?.clear();

    this.bus.emit("ending", {
      kicker: node.kicker ?? null,
      title: node.title,
      text: node.text,
      stage: this.#stageSnapshot(),
      flags: { ...this.flags },
    });
  }

  #persist() {
    this.saveStore?.save({
      nodeId: this.nodeId,
      flags: this.flags,
      stage: this.stage,
      seen: [...this.seen],
    });
  }

  #stageSnapshot() {
    return {
      background: this.stage.background,
      character: this.stage.character ? { ...this.stage.character } : null,
    };
  }

  #resetState() {
    this.nodeId = this.startId;
    this.flags = {};
    this.seen = new Set();
    this.stage = { background: null, character: null };
  }

  #matches(condition) {
    return evaluateCondition(condition, { flags: this.flags, seen: this.seen });
  }

  #validateStory() {
    if (!this.story[this.startId]) {
      throw new Error(`Start node "${this.startId}" does not exist`);
    }

    for (const [key, node] of Object.entries(this.story)) {
      const where = `story["${key}"]`;

      if (!node || typeof node !== "object") {
        throw new Error(`${where} must be an object`);
      }

      if (!node.type || !this.nodeHandlers.has(node.type)) {
        throw new Error(`${where} has an unsupported type: ${node.type}`);
      }

      if (node.type === "dialogue") {
        if (typeof node.text !== "string" || node.text.trim().length === 0) {
          throw new Error(`${where}.text must be a non-empty string`);
        }
        if (!node.next || !this.story[node.next]) {
          throw new Error(`${where}.next points to a missing node`);
        }
      }

      if (node.type === "choice") {
        if (typeof node.prompt !== "string" || node.prompt.trim().length === 0) {
          throw new Error(`${where}.prompt must be a non-empty string`);
        }
        if (!Array.isArray(node.options) || node.options.length === 0) {
          throw new Error(`${where}.options must be a non-empty array`);
        }

        const optionIds = new Set();
        for (const option of node.options) {
          if (!option.id) throw new Error(`${where} has an option without id`);
          if (optionIds.has(option.id)) {
            throw new Error(`${where} has a duplicate option id: ${option.id}`);
          }
          optionIds.add(option.id);

          if (typeof option.label !== "string" || option.label.trim().length === 0) {
            throw new Error(`${where} option "${option.id}" needs a label`);
          }
          if (!this.story[option.next]) {
            throw new Error(`${where} option "${option.id}" points to a missing node`);
          }
        }
      }

      if (node.type === "branch") {
        if (!node.when) throw new Error(`${where}.when is required`);
        if (!node.then || !this.story[node.then]) {
          throw new Error(`${where}.then points to a missing node`);
        }
        if (!node.else || !this.story[node.else]) {
          throw new Error(`${where}.else points to a missing node`);
        }
      }

      if (node.type === "ending") {
        if (!node.title) throw new Error(`${where}.title is required`);
      }
    }
  }
}
