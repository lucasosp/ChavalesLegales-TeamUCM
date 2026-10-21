// Destinos revisados el 21-10-2026. Solo las URL de este catálogo pueden mostrarse.
export const RECURSOS = Object.freeze({
  emergencias: {
    id: 'emergencias', nombre: 'Emergencias · 112', organismo: 'Servicios de emergencias',
    url: 'https://administracion.gob.es/tu-espacio-europeo/derechos-obligaciones/ciudadanos/asistencia-sanitaria/numeros-urgencia', telefono: '112', tipoAyuda: 'emergencia',
    descripcion: 'Atiende situaciones de peligro inmediato y coordina la ayuda necesaria.',
    espera: 'Una persona te preguntará qué ocurre y dónde estás para activar la ayuda adecuada.',
    limites: 'Úsalo si hay peligro inmediato. Llamar al 112 es gratis en España.',
    capacidades: { solicitarAyuda: true, orientacion: false, retirada: false, tramite: false },
  },
  anar: {
    id: 'anar', nombre: 'Fundación ANAR', organismo: 'Fundación ANAR',
    url: 'https://www.anar.org/que-hacemos/telefono-chat-anar/', telefono: '900 20 20 10', tipoAyuda: 'apoyo a menores',
    descripcion: 'Escucha y orienta a niños y adolescentes ante problemas que les preocupan.',
    espera: 'Un profesional puede escucharte y ayudarte a pensar qué hacer.',
    limites: 'Es una línea de apoyo; hablar con ANAR no es presentar una denuncia.',
    capacidades: { solicitarAyuda: true, orientacion: true, retirada: false, tramite: false },
  },
  incibe: {
    id: 'incibe', nombre: 'INCIBE · 017', organismo: 'Instituto Nacional de Ciberseguridad',
    url: 'https://www.incibe.es/linea-de-ayuda-en-ciberseguridad', telefono: '017', tipoAyuda: 'orientación en ciberseguridad',
    descripcion: 'Ayuda con estafas, cuentas robadas y otros problemas de seguridad digital.',
    espera: 'Un equipo especializado puede explicarte cómo proteger tu cuenta o afrontar el problema.',
    limites: 'Atiende de 8:00 a 23:00. Ofrece orientación; el 017 no presenta denuncias por ti.',
    capacidades: { solicitarAyuda: true, orientacion: true, retirada: false, tramite: false },
  },
  aepd: {
    id: 'aepd', nombre: 'AEPD · Canal Prioritario', organismo: 'Agencia Española de Protección de Datos',
    url: 'https://www.aepd.es/canalprioritario', tipoAyuda: 'solicitud de retirada',
    descripcion: 'Permite solicitar la retirada urgente de ciertos contenidos sexuales o violentos difundidos sin permiso.',
    espera: 'La AEPD revisará si tu caso cumple los requisitos del canal y valorará la solicitud.',
    limites: 'Solo para casos excepcionalmente graves: contenido sexual o de agresiones difundido en internet, con alto riesgo para la persona afectada, que sea española o esté en España. No cubre envíos solo por mensajería o correo. La AEPD decide si procede.',
    capacidades: { solicitarAyuda: true, orientacion: false, retirada: true, tramite: true },
  },
  policia: {
    id: 'policia', nombre: 'Policía Nacional', organismo: 'Policía Nacional',
    url: 'https://www.policia.es/', tipoAyuda: 'información y atención policial',
    descripcion: 'Informa sobre atención policial y cómo acudir a una comisaría si quieres contar lo ocurrido.',
    espera: 'Puedes consultar cómo recibir atención o presentar los hechos por el canal adecuado.',
    limites: 'La denuncia por internet de Policía Nacional no está disponible para menores ni para hechos violentos o sexuales. Consulta la atención presencial.',
    capacidades: { solicitarAyuda: true, orientacion: true, retirada: false, tramite: true },
  },
  guardiaCivil: {
    id: 'guardiaCivil', nombre: 'Guardia Civil', organismo: 'Guardia Civil',
    url: 'https://www.guardiacivil.es/', tipoAyuda: 'información y atención policial',
    descripcion: 'Informa sobre puestos y canales de atención para contar lo ocurrido.',
    espera: 'Puedes buscar un puesto cercano o consultar cómo recibir atención.',
    limites: 'La denuncia telemática de Guardia Civil no está disponible para menores ni para hechos violentos o sexuales. Consulta la atención presencial.',
    capacidades: { solicitarAyuda: true, orientacion: true, retirada: false, tramite: true },
  },
  sedeJudicial: {
    id: 'sedeJudicial', nombre: 'Sede Judicial Electrónica', organismo: 'Ministerio de Justicia',
    url: 'https://sedejudicial.justicia.es/', tipoAyuda: 'información y servicios judiciales',
    descripcion: 'Ofrece información y determinados servicios judiciales donde el Ministerio tiene competencia.',
    espera: 'Podrás consultar qué servicios existen y sus requisitos de acceso.',
    limites: 'No es un canal general de denuncia. Los servicios disponibles dependen del trámite y del territorio.',
    capacidades: { solicitarAyuda: false, orientacion: true, retirada: false, tramite: true },
  },
  carpetaJusticia: {
    id: 'carpetaJusticia', nombre: 'Carpeta Justicia', organismo: 'Ministerio de Justicia',
    url: 'https://carpeta.justicia.es/', tipoAyuda: 'consulta y seguimiento judicial',
    descripcion: 'Permite consultar determinados datos y servicios judiciales personales.',
    espera: 'Si ya tienes un asunto judicial, podrás ver los servicios y requisitos de acceso.',
    limites: 'No sirve para presentar una denuncia general; algunas consultas requieren identificación.',
    capacidades: { solicitarAyuda: false, orientacion: false, retirada: false, tramite: true },
  },
})

export const HOSTS_PERMITIDOS = Object.freeze([
  'administracion.gob.es', 'www.anar.org', 'www.incibe.es', 'www.aepd.es',
  'www.policia.es', 'www.guardiacivil.es', 'sedejudicial.justicia.es', 'carpeta.justicia.es',
])

export function urlOficialValida(url) {
  try {
    const destino = new URL(url)
    return destino.protocol === 'https:' && HOSTS_PERMITIDOS.includes(destino.hostname) &&
      !destino.username && !destino.password && !destino.port
  } catch {
    return false
  }
}
