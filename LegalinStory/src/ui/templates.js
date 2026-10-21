/**
 * Static markup for the novel shell, including the optional overlays used by
 * the JSON content: messaging scenes, chapter cards, an educational minigame,
 * and the rights panel.
 */
export function appTemplate() {
  return `
    <main class="novel" aria-label="Novela visual No lo reenvíes">
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
            <button class="library" type="button" data-library>Salir</button>
          </div>
        </header>

        <section class="welcome" data-welcome hidden aria-hidden="true" aria-labelledby="welcome-title">
          <div class="welcome-card" role="dialog" aria-modal="true">
            <p class="welcome-kicker">Chavales Legales · Novela visual</p>
            <h1 class="welcome-title" id="welcome-title">Antes de empezar...</h1>
            <div class="welcome-copy">
              <p>En esta historia, tus decisiones importan.</p>
              <p>Vivirás distintas situaciones relacionadas con la seguridad digital, tus derechos y las consecuencias de lo que decides hacer.</p>
              <p>A lo largo de la aventura tendrás que elegir cómo actuar. Algunas decisiones serán fáciles; otras te harán pensar.</p>
              <p>No se trata solo de llegar al final, sino de aprender a reconocer los riesgos, protegerte y saber cuándo pedir ayuda.</p>
            </div>
            <ul class="welcome-instructions">
              <li>Lee los diálogos y avanza por la historia.</li>
              <li>Elige cómo actuar cuando aparezcan decisiones.</li>
              <li>Descubre las consecuencias de tus elecciones.</li>
              <li>Aprende a protegerte y a ayudar a los demás.</li>
            </ul>
            <button class="welcome-button" type="button" data-welcome-start>Comenzar historia</button>
          </div>
        </section>

        <div class="choices" data-choices hidden></div>

        <p class="sr-only" data-announcement role="status"></p>
        <section class="dialogue" data-panel>
          <div class="nameplate" data-speaker-name hidden></div>
          <p class="dialogue-text" data-text aria-hidden="true"></p>
          <button class="advance" type="button" data-advance hidden>Continuar ▾</button>
        </section>

        <section class="chat" data-chat hidden aria-label="Conversación de mensajería">
          <header class="chat-head">
            <span class="chat-dot" aria-hidden="true"></span>
            <span data-chat-title></span>
          </header>
          <div class="chat-log" data-chat-log role="log" aria-label="Mensajes"></div>
          <button class="chat-hint" type="button" data-chat-skip>Mostrar toda la conversación</button>
          <button class="chat-hint" type="button" data-chat-hint hidden>Continuar ▾</button>
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
            <p class="minigame-kicker">Tú decides · selección múltiple</p>
            <h2 class="minigame-title" data-minigame-title></h2>
            <p class="minigame-prompt" data-minigame-prompt></p>
            <div class="minigame-cards" data-minigame-cards></div>
            <div class="minigame-feedback" data-minigame-feedback role="status" hidden></div>
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
            <button class="ending-library" type="button" data-ending-library>
              Volver a Chavales Legales
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
