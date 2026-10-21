/**
 * Static markup for the novel shell, including the optional overlays used by
 * the JSON content: messaging scenes, chapter cards, an educational minigame,
 * and the rights panel.
 */
export function appTemplate() {
  return `
    <main class="novel" aria-label="Visual novel">
      <div class="scene" data-scene>
        <div class="scene-bg" data-bg-layer="0" aria-hidden="true"></div>
        <div class="scene-bg" data-bg-layer="1" aria-hidden="true"></div>
        <div class="scene-vignette" aria-hidden="true"></div>

        <div class="character" data-character aria-hidden="true">
          <img class="sprite" data-sprite alt="" draggable="false" />
        </div>

        <header class="topbar">
          <span class="brand" data-brand></span>
          <div class="topbar-actions">
            <button class="library" type="button" data-library>Library</button>
            <button class="restart" type="button" data-restart>Restart</button>
          </div>
        </header>

        <div class="choices" data-choices hidden></div>

        <section class="dialogue" data-panel aria-live="polite">
          <div class="nameplate" data-speaker-name hidden></div>
          <p class="dialogue-text" data-text></p>
          <span class="advance" data-advance hidden aria-hidden="true">▼</span>
        </section>

        <section class="chat" data-chat hidden aria-label="Conversación de mensajería">
          <header class="chat-head">
            <span class="chat-dot" aria-hidden="true"></span>
            <span data-chat-title></span>
          </header>
          <div class="chat-log" data-chat-log></div>
          <p class="chat-hint" data-chat-hint hidden>Toca para continuar</p>
        </section>

        <section class="interstitial" data-interstitial hidden aria-hidden="true">
          <div class="interstitial-card">
            <p class="interstitial-kicker" data-interstitial-kicker></p>
            <h2 class="interstitial-title" data-interstitial-title></h2>
            <p class="interstitial-text" data-interstitial-text></p>
            <button class="interstitial-button" type="button" data-interstitial-next>
              Continuar
            </button>
          </div>
        </section>

        <section class="minigame" data-minigame hidden aria-hidden="true">
          <div class="minigame-card">
            <p class="minigame-kicker">Actividad</p>
            <h2 class="minigame-title" data-minigame-title></h2>
            <p class="minigame-prompt" data-minigame-prompt></p>
            <div class="minigame-cards" data-minigame-cards></div>
            <div class="minigame-feedback" data-minigame-feedback hidden></div>
            <div class="minigame-actions">
              <button class="minigame-button" type="button" data-minigame-check>
                Comprobar
              </button>
              <button class="minigame-button is-primary" type="button" data-minigame-continue hidden>
                Continuar
              </button>
            </div>
          </div>
        </section>

        <section class="ending" data-ending aria-hidden="true">
          <p class="ending-kicker" data-ending-kicker></p>
          <h1 class="ending-title" data-ending-title></h1>
          <p class="ending-text" data-ending-text></p>
          <div class="ending-actions">
            <button class="ending-rights" type="button" data-ending-rights hidden>
              Conoce tus derechos
            </button>
            <button class="ending-button" type="button" data-ending-restart>
              Read again
            </button>
            <button class="ending-library" type="button" data-ending-library>
              Volver a la biblioteca
            </button>
          </div>
        </section>

        <section class="rights-panel" data-rights hidden aria-hidden="true">
          <div class="rights-card" role="dialog" aria-modal="true" aria-labelledby="rights-title">
            <p class="rights-kicker">Chavales Legales</p>
            <h2 class="rights-title" id="rights-title" data-rights-title></h2>
            <div class="rights-body" data-rights-body></div>
            <button class="rights-close" type="button" data-rights-close>Volver</button>
          </div>
        </section>
      </div>
    </main>
  `;
}
