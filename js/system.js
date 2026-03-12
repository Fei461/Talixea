// ── SISTEMA XP Y RANGOS ───────────────────────────────────────────────────────
const RANGOS=[
  {n:1,tit:'Curioso',ico:'🌱',xp:0},
  {n:2,tit:'Lector Novel',ico:'📖',xp:1000},
  {n:3,tit:'Explorador',ico:'🗺️',xp:3000},
  {n:4,tit:'Viajero de Palabras',ico:'✈️',xp:8000},
  {n:5,tit:'Narrador',ico:'📜',xp:18000},
  {n:6,tit:'Cronista',ico:'🖋️',xp:35000},
  {n:7,tit:'Políglota',ico:'🌍',xp:60000},
  {n:8,tit:'Maestro de Historias',ico:'🏛️',xp:100000},
  {n:9,tit:'Guardián de Lenguas',ico:'🔮',xp:160000},
  {n:10,tit:'Leyenda',ico:'👑',xp:250000},
];

function getRango(xp){
  let r=RANGOS[0];
  for(const rg of RANGOS){if(xp>=rg.xp)r=rg;}
  return r;
}
function getProxRango(xp){
  for(const rg of RANGOS){if(rg.xp>xp)return rg;}
  return null;
}

// ── DEFINICIÓN DE BADGES ─────────────────────────────────────────────────────
const BADGES=[
  // Volumen
  {id:'first_chapter',cat:'Volumen',ico:'📖',name:'Primera historia',hint:'Completa tu primer capítulo',check:s=>s.capsCompletados>=1},
  {id:'voraz',cat:'Volumen',ico:'📚',name:'Lector voraz',hint:'Completa 10 capítulos',check:s=>s.capsCompletados>=10},
  {id:'centenario',cat:'Volumen',ico:'🏆',name:'Centenario',hint:'Completa 100 capítulos',check:s=>s.capsCompletados>=100},
  {id:'first_book',cat:'Volumen',ico:'🌟',name:'Primera obra',hint:'Completa un libro entero',check:s=>s.librosCompletados>=1},
  {id:'bibliofilo',cat:'Volumen',ico:'📦',name:'Bibliófilo',hint:'Completa 5 libros',check:s=>s.librosCompletados>=5},
  {id:'gran_bib',cat:'Volumen',ico:'🗃️',name:'Gran biblioteca',hint:'Completa 20 libros',check:s=>s.librosCompletados>=20},
  // Constancia
  {id:'llama',cat:'Constancia',ico:'🔥',name:'Primera llama',hint:'3 días seguidos',check:s=>s.rachaMax>=3},
  {id:'semana',cat:'Constancia',ico:'🔥',name:'Semana de fuego',hint:'7 días seguidos',check:s=>s.rachaMax>=7},
  {id:'imparable',cat:'Constancia',ico:'⚡',name:'Imparable',hint:'30 días seguidos',check:s=>s.rachaMax>=30},
  {id:'leyenda_viva',cat:'Constancia',ico:'👑',name:'Leyenda viva',hint:'100 días seguidos',check:s=>s.rachaMax>=100},
  {id:'mes_completo',cat:'Constancia',ico:'📅',name:'Mes completo',hint:'Activo todos los días de un mes',check:s=>s.mesCompleto},
  {id:'mil_min',cat:'Constancia',ico:'⏳',name:'Mil minutos',hint:'1.000 min de lectura total',check:s=>s.minutosTotal>=1000},
  {id:'diez_mil',cat:'Constancia',ico:'🕰️',name:'Diez mil minutos',hint:'10.000 min de lectura total',check:s=>s.minutosTotal>=10000},
  // Colecciones
  {id:'col_grimm',cat:'Colecciones',ico:'🧚',name:'Coleccionista Grimm',hint:'Completa todos los cuentos Grimm',check:s=>s.colGrimm},
  {id:'col_andersen',cat:'Colecciones',ico:'🧜',name:'Coleccionista Andersen',hint:'Completa todos los Andersen',check:s=>s.colAndersen},
  {id:'col_mito',cat:'Colecciones',ico:'⚡',name:'Coleccionista Mitología',hint:'Completa toda la mitología griega',check:s=>s.colMito},
  {id:'col_fab',cat:'Colecciones',ico:'🦊',name:'Coleccionista Fábulas',hint:'Completa todas las fábulas',check:s=>s.colFabulas},
  {id:'col_clas',cat:'Colecciones',ico:'📜',name:'Coleccionista Clásicos',hint:'Completa todos los clásicos',check:s=>s.colClasicos},
  {id:'bib_completa',cat:'Colecciones',ico:'🌍',name:'Biblioteca completa',hint:'Completa todas las colecciones',check:s=>s.colGrimm&&s.colAndersen&&s.colMito&&s.colFabulas&&s.colClasicos},
  // Curiosidades
  {id:'nocturno',cat:'Curiosidades',ico:'🌙',name:'Lectura nocturna',hint:'Lee después de las 23h',check:s=>s.leidoNocturno},
  {id:'madrugador',cat:'Curiosidades',ico:'🌅',name:'Madrugador',hint:'Lee antes de las 7h',check:s=>s.leidoMadrugada},
  {id:'finde',cat:'Curiosidades',ico:'🗓️',name:'Fin de semana literario',hint:'Lee sábado y domingo en la misma semana',check:s=>s.findeLiterario},
  {id:'explorador_lenguas',cat:'Curiosidades',ico:'🌐',name:'Explorador de lenguas',hint:'Lee en 3 idiomas distintos en una semana',check:s=>s.idiomasSemana>=3},
  {id:'poliglota_dia',cat:'Curiosidades',ico:'🎭',name:'Políglota de un día',hint:'Cambia de idioma 3 veces en una sesión',check:s=>s.cambiosIdiomaSesion>=3},
  {id:'solsticio',cat:'Curiosidades',ico:'☀️',name:'Solsticio lector',hint:'Lee el 21 de junio',check:s=>s.solsticio},
];

// ── SISTEMA DE PALABRAS ───────────────────────────────────────────────────────
// Cada palabra: {es, trad, aciertos, escrituraOk, estrella}
// estrella: 1=vista, 2=1acierto, 3=3aciertos, 4=10aciertos, 5=15aciertos+3escritura
function calcEstrella(w){
  if(!w)return 0;
  if(w.aciertos>=15&&w.escrituraOk>=3)return 5;
  if(w.aciertos>=10)return 4;
  if(w.aciertos>=3)return 3;
  if(w.aciertos>=1)return 2;
  return 1; // vista
}

// XP por estrella ganada
const XP_ESTRELLA=[0,10,20,30,40,50];

// ── PREGUNTAS DEL QUIZ ────────────────────────────────────────────────────────
function generarPreguntas(palabras,idioma,n=20){
  if(palabras.length<2)return [];
  const qs=[];
  const pool=[...palabras].sort(()=>Math.random()-.5);
  for(let i=0;i<Math.min(n,pool.length);i++){
    const p=pool[i];
    const tipo=Math.random()<.3?'write':Math.random()<.5?'es2trad':'trad2es';
    // Distractores: 3 palabras aleatorias distintas
    const otros=palabras.filter(x=>x.es!==p.es).sort(()=>Math.random()-.5).slice(0,3);
    if(tipo==='trad2es'){
      const opts=[{t:p.es,ok:true},...otros.map(x=>({t:x.es,ok:false}))].sort(()=>Math.random()-.5);
      qs.push({tipo,pregunta:p.trad,preguntaLabel:`¿Qué significa en español?`,opts,respuesta:p.es,palabra:p});
    }else if(tipo==='es2trad'){
      const opts=[{t:p.trad,ok:true},...otros.map(x=>({t:x.trad,ok:false}))].sort(()=>Math.random()-.5);
      qs.push({tipo,pregunta:p.es,preguntaLabel:`¿Cómo se dice en ${idioma}?`,opts,respuesta:p.trad,palabra:p});
    }else{
      qs.push({tipo:'write',pregunta:p.es,preguntaLabel:`Escribe en ${idioma}:`,respuesta:p.trad,palabra:p});
    }
  }
  return qs;
}

// ── STATS INICIALES ───────────────────────────────────────────────────────────
function statsInit(){
  return{xp:0,capsCompletados:0,librosCompletados:0,minutosTotal:0,
    rachaMax:0,mesCompleto:false,colGrimm:false,colAndersen:false,
    colMito:false,colFabulas:false,colClasicos:false,
    leidoNocturno:false,leidoMadrugada:false,findeLiterario:false,
    idiomasSemana:0,cambiosIdiomaSesion:0,solsticio:false,
    badgesDesbloqueados:[],palabras:{},
    practicaDiariaHoy:false,repasoLibreHoyXP:false,
    ultimaDiaria:null};
}

function loadStats(){
  try{return JSON.parse(localStorage.getItem('tx_stats')||'null')||statsInit();}
  catch{return statsInit();}
}
function saveStats(s){
  try{localStorage.setItem('tx_stats',JSON.stringify(s));}catch{}
}
