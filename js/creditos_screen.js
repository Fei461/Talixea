// ── PANTALLA DE CRÉDITOS ──────────────────────────────────────────────
// Añadir como nueva opción en el menú lateral (nav) de app.js:
//   {id:'creditos', ico:'⚖️', label:'Créditos'}
// Y en AppShell añadir el case 'creditos' en el router.
// La función se llama desde if(screen==='creditos')

// ── DATOS (añadir en expr.js, junto a LIBROS) ─────────────────────────
const CREDITOS_CCBYSA = [
  {id:1,  tit:'Blancanieve y Rojarosa',         aut:'Hermanos Grimm',           attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/Blancanieve_y_Rojarosa'},
  {id:3,  tit:'Caperucita Roja',                aut:'Charles Perrault',         attr:'Traducción de Teodoro Baró (s. XIX)',      url:'https://es.wikisource.org/wiki/Caperucita_Roja'},
  {id:8,  tit:'Rapunzel',                       aut:'Hermanos Grimm',           attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/Rapunzel'},
  {id:14, tit:'Hansel y Gretel',                aut:'Hermanos Grimm',           attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/Hansel_y_Gretel'},
  {id:17, tit:'El príncipe feliz',              aut:'Oscar Wilde',              attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_principe_feliz'},
  {id:18, tit:'El gigante egoísta',             aut:'Oscar Wilde',              attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_gigante_egoista'},
  {id:19, tit:'El gato con botas',              aut:'Charles Perrault',         attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_gato_con_botas'},
  {id:20, tit:'Cenicienta',                     aut:'Charles Perrault',         attr:'Traducción de Coll y Vehí (s. XIX)',       url:'https://es.wikisource.org/wiki/La_Cenicienta'},
  {id:21, tit:'La Bella Durmiente',             aut:'Charles Perrault',         attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/La_Bella_Durmiente'},
  {id:22, tit:'Barba Azul',                     aut:'Charles Perrault',         attr:'Traducción de Coll y Vehí (s. XIX)',       url:'https://es.wikisource.org/wiki/Barba_Azul'},
  {id:23, tit:'Pulgarcito',                     aut:'Charles Perrault',         attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/Pulgarcito'},
  {id:24, tit:'El intrépido soldado de plomo',  aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_intr%C3%A9pido_soldado_de_plomo'},
  {id:25, tit:'Cinco en una vaina',             aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/Cinco_en_una_vaina'},
  {id:26, tit:'El abeto',                       aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_abeto'},
  {id:27, tit:'El cofre volador',               aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_cofre_volador'},
  {id:28, tit:'El ángel',                       aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_%C3%A1ngel'},
  {id:29, tit:'El cuello de camisa',            aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_cuello_de_camisa'},
  {id:30, tit:'El Ave Fénix',                   aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_Ave_F%C3%A9nix'},
  {id:31, tit:'El escarabajo',                  aut:'Hans Christian Andersen',  attr:'Wikisource (contribuidores)',              url:'https://es.wikisource.org/wiki/El_escarabajo'},
];

const CREDITOS_PROPIOS = [
  {id:2,  tit:'La Sirenita',             aut:'H. C. Andersen'},
  {id:4,  tit:'El Patito Feo',           aut:'H. C. Andersen'},
  {id:5,  tit:'Fábulas de Esopo',        aut:'Esopo'},
  {id:6,  tit:'Perseo y Medusa',         aut:'Mitología griega'},
  {id:7,  tit:'La reina de las nieves',  aut:'H. C. Andersen'},
  {id:9,  tit:'Teseo y el Minotauro',    aut:'Mitología griega'},
  {id:10, tit:'Tom Sawyer',              aut:'Mark Twain'},
  {id:15, tit:'Los músicos de Bremen',   aut:'Hermanos Grimm'},
  {id:16, tit:'Orfeo y Eurídice',        aut:'Mitología griega'},
];

// ── RENDER DE LA PANTALLA ─────────────────────────────────────────────
// (Este bloque va dentro del componente App, igual que los demás screens)

// if(screen==='creditos') return (
//   h(AppShell,{act:'creditos'},
//     h('main',{className:'pmain'},
//       ... contenido abajo ...
//     )
//   )
// );

// El contenido completo en formato React createElement:
/*
h('main',{className:'pmain'},
  h('h1',{className:'ptit'},'Créditos y licencias'),
  h('p',{style:{fontSize:13,color:'var(--soft)',lineHeight:1.6,marginBottom:24}},
    'Talixea utiliza textos de dominio público adaptados para el aprendizaje de idiomas. '
    +'A continuación se detalla la procedencia y licencia de cada obra.'),

  // ── BLOQUE 1: Obras con texto español de Wikisource (CC BY-SA 4.0)
  h('section',{className:'cred-sec'},
    h('div',{className:'cred-sec-hdr'},
      h('span',{className:'cred-badge cred-badge-ccbysa'},'CC BY-SA 4.0'),
      h('h2',{className:'cred-sec-t'},'Textos adaptados de Wikisource')
    ),
    h('p',{className:'cred-sec-desc'},
      'Los textos en español de estas obras proceden de ',
      h('a',{href:'https://es.wikisource.org',target:'_blank',className:'cred-lnk'},'Wikisource'),
      ', publicados bajo licencia ',
      h('a',{href:'https://creativecommons.org/licenses/by-sa/4.0/deed.es',target:'_blank',className:'cred-lnk'},'Creative Commons BY-SA 4.0'),
      '. Las adaptaciones y traducciones a otros idiomas realizadas por Talixea se distribuyen bajo la misma licencia.'
    ),
    h('div',{className:'cred-list'},
      CREDITOS_CCBYSA.map(c=>
        h('div',{key:c.id,className:'cred-item'},
          h('div',{className:'cred-item-main'},
            h('span',{className:'cred-tit'},c.tit),
            h('span',{className:'cred-aut'},c.aut)
          ),
          h('div',{className:'cred-item-sub'},
            c.attr,' · ',
            h('a',{href:c.url,target:'_blank',className:'cred-lnk'},'Ver fuente ↗')
          )
        )
      )
    )
  ),

  // ── BLOQUE 2: Obras propias / CC0
  h('section',{className:'cred-sec'},
    h('div',{className:'cred-sec-hdr'},
      h('span',{className:'cred-badge cred-badge-cc0'},'CC0 / Dominio público'),
      h('h2',{className:'cred-sec-t'},'Textos de elaboración propia')
    ),
    h('p',{className:'cred-sec-desc'},
      'Estos textos han sido escritos o adaptados íntegramente por el equipo de Talixea '
      +'a partir de obras en el dominio público. Se publican sin restricciones de copyright (CC0).'
    ),
    h('div',{className:'cred-list'},
      CREDITOS_PROPIOS.map(c=>
        h('div',{key:c.id,className:'cred-item'},
          h('div',{className:'cred-item-main'},
            h('span',{className:'cred-tit'},c.tit),
            h('span',{className:'cred-aut'},c.aut)
          ),
          h('div',{className:'cred-item-sub'},'Texto adaptado por Talixea — dominio público')
        )
      )
    )
  ),

  // ── BLOQUE 3: Nota general de copyright
  h('section',{className:'cred-sec cred-sec-note'},
    h('h2',{className:'cred-sec-t'},'Sobre los derechos de autor'),
    h('p',{className:'cred-sec-desc'},
      'Todos los autores originales (Perrault, Grimm, Andersen, Wilde, Twain...) '
      +'fallecieron hace más de 70 años, por lo que sus obras son de dominio público '
      +'en la Unión Europea y la mayoría de países.'
    ),
    h('p',{className:'cred-sec-desc'},
      'Las traducciones a inglés, francés, alemán, italiano, portugués y catalán '
      +'han sido generadas por Talixea con asistencia de inteligencia artificial '
      +'y se publican bajo licencia ',
      h('a',{href:'https://creativecommons.org/licenses/by-sa/4.0/deed.es',target:'_blank',className:'cred-lnk'},'CC BY-SA 4.0'),
      '.'
    ),
    h('p',{className:'cred-sec-desc'},
      h('strong',null,'Talixea'),
      ' no reclama derechos sobre los textos originales ni sobre las traducciones históricas. '
      +'Si detectas algún error en los créditos, escríbenos a ',
      h('a',{href:'mailto:hola@talixea.com',className:'cred-lnk'},'hola@talixea.com'),
      '.'
    )
  )
)
*/
