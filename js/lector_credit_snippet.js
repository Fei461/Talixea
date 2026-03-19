// ── AVISO DE CRÉDITOS EN EL LECTOR ──────────────────────────────────────
// Añadir este bloque DENTRO del lector, justo antes del cap-nav,
// dentro del h('main',{className:'lec-main'}, ...)
//
// Busca en app.js la línea:  h('div',{className:'cap-nav'},
// Y añade ANTES de ella:

h('div',{className:'lec-credit'},
  libro?.src?.license === 'CC BY-SA 4.0'
    ? h('span',null,
        `Texto: ${libro.src.attribution || 'Wikisource'} — `,
        h('a',{href:libro.src.licenseUrl||'https://creativecommons.org/licenses/by-sa/4.0/',target:'_blank'},'CC BY-SA 4.0'),
        libro.src.url ? h('span',null,' · ',h('a',{href:libro.src.url,target:'_blank'},'Ver original ↗')) : null
      )
    : h('span',null,'Texto adaptado de dominio público por Talixea · ',
        h('a',{href:'https://creativecommons.org/publicdomain/zero/1.0/deed.es',target:'_blank'},'CC0'))
),
