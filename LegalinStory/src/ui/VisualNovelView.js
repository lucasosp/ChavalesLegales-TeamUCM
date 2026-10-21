import { appTemplate } from "./templates.js";
import { Typewriter } from "./Typewriter.js";

/**
 * DOM presentation layer.
 *
 * The view receives already-resolved story events and turns them into pixels.
 * It never reads the story graph or mutates engine state; user gestures are
 * forwarded through the callbacks supplied by the composition root.
 */
export class VisualNovelView {
  #background = null;
  #characterKey = null;
  #activeBackgroundLayer = 0;
  #awaitingChoice = false;
  #endingVisible = false;
  #choiceReadyTimer = null;
  #onKeyDown;
  #chatRevealing = false;
  #chatTimer = null;
  #chatMessages = [];
  #chatIndex = 0;
  #chatSelf = null;
  #interactionLocked = false;
  #interstitialComplete = null;
  #minigameComplete = null;
  #minigameCards = [];
  #minigameSelected = new Set();
  #minigameMode = "information";
  #minigameChecked = false;
  #rightsVisible = false;
  #rights = null;

  /**
   * @param {HTMLElement} root
   * @param {{
   *   onAdvance: () => void,
   *   onChoose: (optionId: string) => void,
   *   onExit?: () => void,
   *   title?: string,
   *   resolveCharacter?: (character: { id: string, expression: string }) => string,
   *   resolveBackground?: (sceneId: string) => string | null,
   *   rights?: Record<string, any> | null,
   * }} callbacks
   */
  constructor(
    root,
    {
      onAdvance,
      onChoose,
      onExit = null,
      title = "Visual Novel",
      resolveCharacter = defaultCharacterSource,
      resolveBackground = null,
      rights = null,
    },
  ) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError("VisualNovelView requires a root HTMLElement");
    }

    this.onAdvance = onAdvance;
    this.onChoose = onChoose;
    this.onExit = onExit;
    this.resolveCharacter = resolveCharacter;
    this.resolveBackground = resolveBackground;
    this.rights = rights;
    this.root = root;
    this.#onKeyDown = (event) => this.#handleKeyDown(event);

    root.innerHTML = appTemplate();

    this.refs = {
      scene: root.querySelector("[data-scene]"),
      topbar: root.querySelector(".topbar"),
      welcome: root.querySelector("[data-welcome]"),
      welcomeStart: root.querySelector("[data-welcome-start]"),
      backgrounds: [...root.querySelectorAll("[data-bg-layer]")],
      character: root.querySelector("[data-character]"),
      sprite: root.querySelector("[data-sprite]"),
      brand: root.querySelector("[data-brand]"),
      panel: root.querySelector("[data-panel]"),
      speaker: root.querySelector("[data-speaker-name]"),
      text: root.querySelector("[data-text]"),
      announcement: root.querySelector("[data-announcement]"),
      advance: root.querySelector("[data-advance]"),
      choices: root.querySelector("[data-choices]"),
      chat: root.querySelector("[data-chat]"),
      chatTitle: root.querySelector("[data-chat-title]"),
      chatLog: root.querySelector("[data-chat-log]"),
      chatHint: root.querySelector("[data-chat-hint]"),
      chatSkip: root.querySelector("[data-chat-skip]"),
      interstitial: root.querySelector("[data-interstitial]"),
      interstitialKicker: root.querySelector("[data-interstitial-kicker]"),
      interstitialTitle: root.querySelector("[data-interstitial-title]"),
      interstitialText: root.querySelector("[data-interstitial-text]"),
      interstitialNext: root.querySelector("[data-interstitial-next]"),
      minigame: root.querySelector("[data-minigame]"),
      minigameTitle: root.querySelector("[data-minigame-title]"),
      minigamePrompt: root.querySelector("[data-minigame-prompt]"),
      minigameCards: root.querySelector("[data-minigame-cards]"),
      minigameFeedback: root.querySelector("[data-minigame-feedback]"),
      minigameCheck: root.querySelector("[data-minigame-check]"),
      minigameContinue: root.querySelector("[data-minigame-continue]"),
      library: root.querySelector("[data-library]"),
      ending: root.querySelector("[data-ending]"),
      endingKicker: root.querySelector("[data-ending-kicker]"),
      endingTitle: root.querySelector("[data-ending-title]"),
      endingText: root.querySelector("[data-ending-text]"),
      endingRights: root.querySelector("[data-ending-rights]"),
      endingLibrary: root.querySelector("[data-ending-library]"),
      rights: root.querySelector("[data-rights]"),
      rightsTitle: root.querySelector("[data-rights-title]"),
      rightsBody: root.querySelector("[data-rights-body]"),
      rightsClose: root.querySelector("[data-rights-close]"),
    };

    this.refs.brand.textContent = title;
    if (!onExit) {
      this.refs.library.hidden = true;
      this.refs.endingLibrary.hidden = true;
    }

    this.typewriter = new Typewriter(this.refs.text);
    this.#bindEvents();
  }

  destroy() {
    document.removeEventListener("keydown", this.#onKeyDown);
    clearTimeout(this.#choiceReadyTimer);
    clearInterval(this.#chatTimer);
    this.#choiceReadyTimer = null;
    this.#chatTimer = null;
    this.typewriter.stop();
  }

  showWelcome(onStart) {
    this.refs.welcome.hidden = false;
    this.refs.welcome.setAttribute("aria-hidden", "false");
    this.refs.welcomeStart.addEventListener("click", () => {
      this.refs.welcome.hidden = true;
      this.refs.welcome.setAttribute("aria-hidden", "true");
      this.refs.topbar.inert = false;
      for (const element of this.root.querySelectorAll("[inert]")) element.inert = false;
      onStart();
    }, { once: true });
    this.refs.topbar.inert = true;
    for (const selector of ["[data-panel]", "[data-choices]", "[data-chat]", "[data-interstitial]", "[data-minigame]", "[data-ending]", "[data-rights]"]) {
      const element = this.root.querySelector(selector);
      if (element) element.inert = true;
    }
    this.refs.welcomeStart.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------ story events */

  showDialogue({ speaker, text, tone, stage }) {
    this.#resetTransientOverlays();
    this.#leaveEnding();
    this.#awaitingChoice = false;
    this.#clearChoices();
    this.#applyStage(stage);
    this.#setSpeaker(speaker);
    this.refs.announcement.textContent = `${speaker ? `${speaker}: ` : ""}${text}`;

    this.refs.panel.classList.toggle("is-narration", tone === "narration");
    this.refs.panel.classList.toggle("is-thought", tone === "thought");
    this.refs.panel.classList.toggle("is-poem", tone === "poem");
    this.refs.advance.hidden = true;

    this.typewriter.play(text, () => {
      if (this.#awaitingChoice) return;
      this.refs.advance.hidden = false;
    });
  }

  showChoices({ speaker, prompt, tone, options, stage }) {
    this.#resetTransientOverlays();
    this.#leaveEnding();
    this.#awaitingChoice = false;
    this.#applyStage(stage);
    this.#setSpeaker(speaker);
    this.refs.announcement.textContent = `${speaker ? `${speaker}: ` : ""}${prompt}`;
    this.#clearChoices();

    this.refs.panel.classList.toggle("is-narration", tone === "narration");
    this.refs.panel.classList.toggle("is-thought", tone === "thought");
    this.refs.panel.classList.toggle("is-poem", tone === "poem");
    this.refs.advance.hidden = true;

    this.typewriter.play(prompt, () => {
      this.#awaitingChoice = true;
      this.#renderChoices(options);
    });
  }

  showEnding({ kicker, title, text, stage }) {
    this.#resetTransientOverlays();
    this.typewriter.stop();
    this.#awaitingChoice = false;
    this.#endingVisible = true;
    this.#clearChoices();
    this.#applyStage(stage);
    this.refs.advance.hidden = true;

    this.refs.endingKicker.textContent = kicker ?? "";
    this.refs.endingKicker.hidden = !kicker;
    this.refs.endingTitle.textContent = title ?? "";
    this.refs.endingText.textContent = text ?? "";
    this.refs.endingRights.hidden = !this.rights;

    this.refs.ending.classList.add("is-visible");
    this.refs.ending.setAttribute("aria-hidden", "false");
    (this.rights ? this.refs.endingRights : this.refs.endingLibrary).focus({ preventScroll: true });
  }

  /* --------------------------------------------------------------- typewriter */

  isTyping() {
    return this.typewriter.isTyping() || this.#chatRevealing;
  }

  skipTyping() {
    if (this.#chatRevealing) {
      this.#skipChat();
      return;
    }
    this.typewriter.skip();
  }

  /* ------------------------------------------------------------ chat scenes */

  showChat({ chatTitle, self, messages, stage }) {
    this.#resetTransientOverlays();
    this.#applyStage(stage);
    this.refs.panel.hidden = true;
    this.refs.chat.hidden = false;
    this.refs.chatTitle.textContent = chatTitle ?? "Mensajes";
    this.refs.chatLog.replaceChildren();
    this.refs.chatHint.hidden = true;
    this.refs.chatSkip.hidden = false;

    this.#chatSelf = self ?? null;
    this.#chatMessages = Array.isArray(messages) ? messages : [];
    this.#chatIndex = 0;
    this.#chatRevealing = this.#chatMessages.length > 0;

    if (!this.#chatRevealing) {
      this.#finishChat();
      return;
    }

    if (this.typewriter.prefersReducedMotion) this.#skipChat();
    else this.#revealChatMessage();
  }

  #revealChatMessage() {
    if (!this.#chatRevealing) return;
    if (this.#chatIndex >= this.#chatMessages.length) {
      this.#finishChat();
      return;
    }

    const message = this.#chatMessages[this.#chatIndex];
    this.#chatIndex += 1;
    this.refs.chatLog.append(this.#createChatBubble(message, this.#chatSelf));
    this.refs.chatLog.scrollTop = this.refs.chatLog.scrollHeight;

    if (this.#chatIndex >= this.#chatMessages.length) this.#finishChat();
    else {
      const delay = Math.min(4200, Math.max(1400, (message.text?.length ?? 0) * 45));
      this.#chatTimer = setTimeout(() => this.#revealChatMessage(), delay);
    }
  }

  #skipChat() {
    clearInterval(this.#chatTimer);
    this.#chatTimer = null;

    while (this.#chatIndex < this.#chatMessages.length) {
      const message = this.#chatMessages[this.#chatIndex];
      this.#chatIndex += 1;
      this.refs.chatLog.append(this.#createChatBubble(message, this.#chatSelf));
    }

    this.refs.chatLog.scrollTop = this.refs.chatLog.scrollHeight;
    this.#finishChat();
  }

  #finishChat() {
    clearInterval(this.#chatTimer);
    this.#chatTimer = null;
    this.#chatRevealing = false;
    this.refs.chatHint.hidden = false;
    this.refs.chatSkip.hidden = true;
  }

  #clearChat() {
    clearInterval(this.#chatTimer);
    this.#chatTimer = null;
    this.#chatRevealing = false;
    this.#chatMessages = [];
    this.#chatIndex = 0;
    this.#chatSelf = null;
    this.refs.chat.hidden = true;
    this.refs.chatLog.replaceChildren();
    this.refs.chatHint.hidden = true;
  }

  #createChatBubble(message, self) {
    const row = document.createElement("div");
    const system = message.system === true || message.from === "Sistema";
    const side =
      message.side ?? (system ? "system" : message.from === self ? "out" : "in");
    row.className = `chat-row is-${side}`;

    if (system) {
      const systemMessage = document.createElement("div");
      systemMessage.className = "chat-system";
      systemMessage.textContent = message.text ?? "";
      row.append(systemMessage);
      return row;
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    if (message.deleted) bubble.classList.add("is-deleted");
    if (message.hidden) bubble.classList.add("is-hidden-content");

    if (message.from && side !== "out") {
      const author = document.createElement("span");
      author.className = "chat-author";
      author.textContent = message.from;
      bubble.append(author);
    }

    if (message.hidden) {
      const preview = document.createElement("div");
      preview.className = "censored-preview";
      preview.setAttribute("role", "img");
      preview.setAttribute("aria-label", "Imagen censurada; el contenido no se muestra");
      const mosaic = document.createElement("img");
      mosaic.className = "censored-preview-art";
      mosaic.src = new URL("assets/censored-preview.svg", document.baseURI).href;
      mosaic.alt = "";
      mosaic.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.className = "censored-preview-label";
      label.textContent = "Imagen censurada";
      label.setAttribute("aria-hidden", "true");
      preview.append(mosaic, label);
      bubble.append(preview);
    } else {
      const text = document.createElement("p");
      text.className = "chat-text";
      text.textContent = message.text ?? "";
      bubble.append(text);
    }

    if (message.time) {
      const time = document.createElement("span");
      time.className = "chat-time";
      time.textContent = message.time;
      bubble.append(time);
    }

    row.append(bubble);
    return row;
  }

  /* ------------------------------------------------------ chapter cards */

  showInterstitial(payload, onComplete) {
    this.#resetTransientOverlays();
    this.#applyStage(payload.stage);
    this.refs.panel.hidden = true;
    this.#interactionLocked = true;
    this.#interstitialComplete = onComplete;

    this.refs.interstitial.hidden = false;
    this.refs.interstitial.setAttribute("aria-hidden", "false");
    this.refs.interstitialKicker.textContent = payload.kicker ?? "";
    this.refs.interstitialKicker.hidden = !payload.kicker;
    this.refs.interstitialTitle.textContent = payload.title ?? "";
    this.refs.interstitialText.textContent = payload.text ?? "";
    this.refs.interstitialNext.focus({ preventScroll: true });
  }

  #completeInterstitial() {
    const complete = this.#interstitialComplete;
    this.#interstitialComplete = null;
    this.refs.interstitial.hidden = true;
    this.refs.interstitial.setAttribute("aria-hidden", "true");
    this.#interactionLocked = false;
    this.refs.panel.hidden = false;
    complete?.();
  }

  /* ------------------------------------------------------------ minigame */

  showMinigame(payload, onComplete) {
    this.#resetTransientOverlays();
    this.#applyStage(payload.stage);
    this.refs.panel.hidden = true;
    this.#interactionLocked = true;
    this.#minigameComplete = onComplete;
    this.#minigameCards = Array.isArray(payload.cards) ? payload.cards : [];
    this.#minigameSelected = new Set();
    this.#minigameMode = payload.mode ?? "information";
    this.#minigameChecked = false;
    for (const card of this.#minigameCards) {
      if (card.flag && payload.flags?.[card.flag]) this.#minigameSelected.add(card.id);
    }

    this.refs.minigame.hidden = false;
    this.refs.minigame.setAttribute("aria-hidden", "false");
    this.refs.minigameTitle.textContent = payload.title ?? "Actividad";
    this.refs.minigamePrompt.textContent = payload.prompt ?? "";
    this.refs.minigameFeedback.hidden = true;
    this.refs.minigameFeedback.replaceChildren();
    this.refs.minigameContinue.hidden = true;
    this.refs.minigameCheck.hidden = false;
    this.refs.minigameCheck.textContent = this.#minigameMode === "support" ? "Confirmar apoyos" : "Comprobar selección";
    this.refs.minigameCheck.disabled = this.#minigameSelected.size === 0;
    this.#renderMinigameCards();
    this.refs.minigameCards.querySelector("button")?.focus({ preventScroll: true });
  }

  #renderMinigameCards() {
    this.refs.minigameCards.replaceChildren();

    for (const card of this.#minigameCards) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "minigame-option";
      button.dataset.cardId = card.id;
      button.setAttribute("aria-pressed", String(this.#minigameSelected.has(card.id)));
      button.classList.toggle("is-selected", this.#minigameSelected.has(card.id));

      const marker = document.createElement("span");
      marker.className = "minigame-marker";
      marker.setAttribute("aria-hidden", "true");
      marker.textContent = this.#minigameSelected.has(card.id) ? "✓" : "○";

      const label = document.createElement("span");
      label.className = "minigame-label";
      label.textContent = card.text ?? "";

      button.append(marker, label);
      button.addEventListener("click", () => {
        if (this.#minigameSelected.has(card.id)) {
          this.#minigameSelected.delete(card.id);
          button.classList.remove("is-selected");
          button.setAttribute("aria-pressed", "false");
          marker.textContent = "○";
        } else {
          this.#minigameSelected.add(card.id);
          button.classList.add("is-selected");
          button.setAttribute("aria-pressed", "true");
          marker.textContent = "✓";
        }
        this.#minigameChecked = false;
        this.refs.minigameFeedback.hidden = true;
        this.refs.minigameContinue.hidden = true;
        this.refs.minigameCheck.disabled = this.#minigameSelected.size === 0;
      });

      this.refs.minigameCards.append(button);
    }
  }

  #checkMinigame() {
    if (!this.#minigameSelected.size) return;
    const support = this.#minigameMode === "support";
    const allCorrect = this.#minigameCards.every(
      (card) => Boolean(card.correct) === this.#minigameSelected.has(card.id),
    );

    const feedback = this.refs.minigameFeedback;
    feedback.replaceChildren();

    const summary = document.createElement("p");
    summary.className = support || allCorrect ? "is-good" : "is-bad";
    summary.textContent = support
      ? "Estos apoyos pueden ayudarte a hablar con más tranquilidad. No hay una respuesta única y puedes pedir otros más adelante."
      : allCorrect
      ? "Bien. Esa información puede ayudar sin crear nuevas copias del contenido."
      : "Revisa las tarjetas. No necesitas descargar ni reenviar el contenido para pedir ayuda.";
    feedback.append(summary);

    for (const card of this.#minigameCards) {
      const selected = this.#minigameSelected.has(card.id);
      if (support && !selected) continue;
      const line = document.createElement("p");
      const matched = support || Boolean(card.correct) === selected;
      line.className = matched ? "is-good" : "is-bad";
      line.textContent = `${support ? "✓" : selected ? "Seleccionada:" : "Sin seleccionar:"} ${card.text} — ${card.feedback ?? ""}`;
      feedback.append(line);
    }

    feedback.hidden = false;
    this.#minigameChecked = support || allCorrect;
    this.refs.minigameContinue.hidden = !this.#minigameChecked;
    feedback.scrollIntoView?.({ block: "nearest", behavior: "instant" });
  }

  #completeMinigame() {
    if (!this.#minigameChecked) return;
    const complete = this.#minigameComplete;
    this.#minigameComplete = null;
    this.refs.minigame.hidden = true;
    this.refs.minigame.setAttribute("aria-hidden", "true");
    this.refs.panel.hidden = false;
    this.#interactionLocked = false;
    complete?.([...this.#minigameSelected]);
  }

  /* --------------------------------------------------------------- rights */

  #openRights() {
    if (!this.rights || this.#rightsVisible) return;

    this.#rightsVisible = true;
    this.refs.rights.hidden = false;
    this.refs.rights.setAttribute("aria-hidden", "false");
    this.refs.rightsTitle.textContent = this.rights.title ?? "Conoce tus derechos";

    const body = this.refs.rightsBody;
    body.replaceChildren();

    if (this.rights.intro) body.append(this.#rightsSection(null, this.rights.intro));

    for (const section of this.rights.sections ?? []) {
      body.append(this.#rightsSection(section.title, section.text));
    }

    if (Array.isArray(this.rights.resources) && this.rights.resources.length > 0) {
      const section = document.createElement("section");
      section.className = "rights-section";

      const heading = document.createElement("h3");
      heading.textContent = this.rights.resourcesTitle ?? "Recursos de apoyo";
      section.append(heading);

      const list = document.createElement("ul");
      for (const resource of this.rights.resources) {
        const item = document.createElement("li");
        const name = document.createElement("strong");
        name.textContent = resource.name ?? "";
        item.append(name, document.createTextNode(` — ${resource.text ?? ""}`));
        if (resource.url?.startsWith("https://")) {
          const link = document.createElement("a");
          link.href = resource.url;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = ` Abrir ${resource.name} (nueva pestaña)`;
          item.append(link);
        }
        list.append(item);
      }

      section.append(list);
      body.append(section);
    }

    if (this.rights.closing) {
      const closing = document.createElement("p");
      closing.className = "rights-closing";
      closing.textContent = this.rights.closing;
      body.append(closing);
    }

    this.refs.rightsClose.focus({ preventScroll: true });
  }

  #rightsSection(title, text) {
    const section = document.createElement("section");
    section.className = "rights-section";

    if (title) {
      const heading = document.createElement("h3");
      heading.textContent = title;
      section.append(heading);
    }

    if (text) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      section.append(paragraph);
    }

    return section;
  }

  #closeRights() {
    if (!this.#rightsVisible) return;

    this.#rightsVisible = false;
    this.refs.rights.hidden = true;
    this.refs.rights.setAttribute("aria-hidden", "true");
    this.refs.rightsBody.replaceChildren();

    if (this.#endingVisible) this.refs.endingRights.focus({ preventScroll: true });
  }

  #resetTransientOverlays() {
    this.refs.announcement.textContent = "";
    this.typewriter.stop();
    this.#clearChoices();
    this.#awaitingChoice = false;
    this.#leaveEnding();
    this.refs.advance.hidden = true;
    this.#clearChat();
    this.refs.interstitial.hidden = true;
    this.refs.interstitial.setAttribute("aria-hidden", "true");
    this.refs.minigame.hidden = true;
    this.refs.minigame.setAttribute("aria-hidden", "true");
    this.refs.minigameFeedback.hidden = true;
    this.refs.minigameContinue.hidden = true;
    this.refs.minigameCards.replaceChildren();
    this.#interactionLocked = false;
    this.#interstitialComplete = null;
    this.#minigameComplete = null;
    this.#closeRights();
    this.refs.panel.hidden = false;
  }

  /* ------------------------------------------------------------------ helpers */

  #bindEvents() {
    this.refs.advance.addEventListener("click", () => this.onAdvance());
    this.refs.chatHint.addEventListener("click", () => this.onAdvance());
    this.refs.chatSkip.addEventListener("click", () => this.#skipChat());
    this.refs.scene.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      if (this.#interactionLocked || this.#rightsVisible) return;
      if (this.#awaitingChoice || this.#endingVisible) return;
      this.onAdvance();
    });

    document.addEventListener("keydown", this.#onKeyDown);

    this.refs.library.addEventListener("click", (event) => {
      event.stopPropagation();
      this.refs.library.blur();
      this.onExit?.();
    });

    this.refs.endingLibrary.addEventListener("click", (event) => {
      event.stopPropagation();
      this.refs.endingLibrary.blur();
      this.onExit?.();
    });

    this.refs.interstitialNext.addEventListener("click", () => this.#completeInterstitial());
    this.refs.minigameCheck.addEventListener("click", () => this.#checkMinigame());
    this.refs.minigameContinue.addEventListener("click", () => this.#completeMinigame());
    this.refs.endingRights.addEventListener("click", () => this.#openRights());
    this.refs.rightsClose.addEventListener("click", () => this.#closeRights());
  }

  #handleKeyDown(event) {
    if (event.repeat) return;
    if (!this.refs.welcome.hidden && event.key === "Tab") {
      event.preventDefault();
      this.refs.welcomeStart.focus({ preventScroll: true });
      return;
    }
    if (this.#rightsVisible && event.key === "Tab") {
      const controls = [...this.refs.rights.querySelectorAll("a, button")];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || !this.refs.rights.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !this.refs.rights.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
      return;
    }
    if (event.key === "Escape" && this.#rightsVisible) {
      event.preventDefault();
      this.#closeRights();
      return;
    }

    if (event.key !== " " && event.key !== "Enter") return;
    if (event.target instanceof Element && event.target.closest("button")) return;
    if (this.#interactionLocked || this.#rightsVisible) return;

    event.preventDefault();

    if (this.#awaitingChoice || this.#endingVisible) return;
    this.onAdvance();
  }

  #setSpeaker(name) {
    if (!name) {
      this.refs.speaker.hidden = true;
      this.refs.speaker.textContent = "";
      delete this.refs.speaker.dataset.speaker;
      return;
    }

    this.refs.speaker.hidden = false;
    this.refs.speaker.textContent = name;
    this.refs.speaker.dataset.speaker = name.toLowerCase();
  }

  #applyStage(stage) {
    if (!stage) return;

    this.#setBackground(stage.background);

    if (!stage.character) {
      this.#characterKey = null;
      this.refs.character.classList.remove("is-visible");
      delete this.refs.character.dataset.position;
      return;
    }

    const key = `${stage.character.id}:${stage.character.expression}:${stage.character.at ?? ""}`;
    if (key === this.#characterKey) return;

    this.#characterKey = key;
    this.refs.character.className =
      `character is-visible expression-${stage.character.expression}`;
    this.refs.character.dataset.character = stage.character.id;
    if (typeof stage.character.at === "string") {
      this.refs.character.dataset.position = stage.character.at;
    }

    const source = this.#resolveCharacterSource(stage.character);
    if (source) {
      if (this.refs.sprite.getAttribute("src") !== source) {
        this.refs.sprite.src = source;
      }
      this.refs.sprite.alt = "";
    } else {
      this.refs.character.classList.remove("is-visible");
    }
  }

  #resolveCharacterSource(character) {
    try {
      return this.resolveCharacter(character);
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  #setBackground(name) {
    if (!name || name === this.#background) return;

    this.#background = name;

    const nextIndex = 1 - this.#activeBackgroundLayer;
    const nextLayer = this.refs.backgrounds[nextIndex];
    const previousLayer = this.refs.backgrounds[this.#activeBackgroundLayer];
    const image = this.resolveBackground?.(name) ?? null;

    nextLayer.className = image ? "scene-bg is-image" : `scene-bg bg-${name}`;
    nextLayer.style.backgroundImage = image ? `url("${image}")` : "";
    // Force a style flush so the opacity transition always runs.
    void nextLayer.offsetWidth;
    nextLayer.classList.add("is-active");
    previousLayer.classList.remove("is-active");

    this.#activeBackgroundLayer = nextIndex;
  }

  #renderChoices(options) {
    const fragment = document.createDocumentFragment();

    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.style.setProperty("--i", String(index));

      const number = document.createElement("span");
      number.className = "choice-index";
      number.textContent = String(index + 1).padStart(2, "0");

      const label = document.createElement("span");
      label.className = "choice-label";
      label.textContent = option.label;

      button.append(number, label);
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        this.#awaitingChoice = false;
        this.#clearChoices();
        this.onChoose(option.id);
      });

      fragment.append(button);
    });

    this.refs.choices.replaceChildren(fragment);
    this.refs.choices.hidden = false;

    // A short guard prevents a double-click used to skip the prompt from
    // immediately selecting whichever option appeared under the cursor.
    this.refs.choices.classList.remove("is-ready");
    clearTimeout(this.#choiceReadyTimer);
    this.#choiceReadyTimer = setTimeout(() => {
      this.refs.choices.classList.add("is-ready");
    }, 200);
  }

  #clearChoices() {
    clearTimeout(this.#choiceReadyTimer);
    this.#choiceReadyTimer = null;
    this.refs.choices.classList.remove("is-ready");
    this.refs.choices.hidden = true;
    this.refs.choices.replaceChildren();
  }

  #leaveEnding() {
    if (!this.#endingVisible) return;

    this.#endingVisible = false;
    this.#closeRights();
    this.refs.endingRights.blur();
    this.refs.endingLibrary.blur();
    this.refs.ending.classList.remove("is-visible");
    this.refs.ending.setAttribute("aria-hidden", "true");
  }
}

function defaultCharacterSource({ id, expression }) {
  return `/assets/characters/${id}/${expression}.svg`;
}
