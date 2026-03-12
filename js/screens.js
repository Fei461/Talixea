// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function Landing({onLogin,onReg}){
  const [demoImm,setDemoImm]=useState(35);
  const [faqOpen,setFaqOpen]=useState(null);
  const DEMO_IDIOMA='en';
  const DEMO_FRASES=[
    {es:'Había una vez una princesa que vivía en un gran castillo.',en:'Once upon a time there was a princess who lived in a great castle.',fr:'Il était une fois une princesse qui vivait dans un grand château.',de:'Es war einmal eine Prinzessin, die in einem großen Schloss lebte.'},
    {es:'El castillo estaba en el bosque oscuro, lejos de todo.',en:'The castle stood in the dark forest, far from everything.',fr:'Le château se trouvait dans la forêt sombre, loin de tout.',de:'Das Schloss stand im dunklen Wald, weit von allem entfernt.'},
    {es:'Era muy hermosa y muy valiente, pero vivía sola.',en:'She was very beautiful and very brave, but she lived alone.',fr:'Elle était très belle et très courageuse, mais elle vivait seule.',de:'Sie war sehr schön und sehr tapfer, aber sie lebte allein.'},
    {es:'Su madre había muerto hacía muchos años.',en:'Her mother had died many years ago.',fr:'Sa mère était morte il y a de nombreuses années.',de:'Ihre Mutter war vor vielen Jahren gestorben.'},
    {es:'Un día, un príncipe llegó a la puerta del castillo.',en:'One day, a prince arrived at the castle gate.',fr:'Un jour, un prince arriva à la porte du château.',de:'Eines Tages kam ein Prinz an das Tor des Schlosses.'},
  ];

  const FAQS=[
    {q:'¿El método funciona de verdad?',a:'Sí. El método diglot weave está respaldado por investigación científica. Tu cerebro aprende vocabulario y gramática en contexto real, que es exactamente cómo los niños adquieren su lengua materna. Los estudios muestran mejor retención y más velocidad de aprendizaje frente a métodos tradicionales.'},
    {q:'¿Qué idiomas están disponibles?',a:'Inglés, Francés, Alemán, Italiano, Portugués y Catalán. Estamos trabajando en añadir más idiomas basándonos en las peticiones de nuestra comunidad.'},
    {q:'¿Cómo funciona la inmersión progresiva?',a:'Empiezas leyendo textos con solo un 20% de palabras en el idioma nuevo. Conforme avanzas capítulos, el porcentaje sube gradualmente hasta el 90% al final del libro. Así nunca te sientes perdido pero siempre estás aprendiendo.'},
    {q:'¿Es realmente gratis?',a:'Sí. El plan gratuito incluye todos los idiomas, inmersión hasta el 60% y acceso a una selección de libros. El plan Premium desbloquea la biblioteca completa, inmersión al 100% y estadísticas avanzadas.'},
    {q:'¿Puedo cambiar de idioma en medio de un libro?',a:'No, y es intencional. Como en Duolingo, el idioma que estás aprendiendo se mantiene fijo para que tu cerebro construya consistencia. Puedes añadir un segundo idioma en cualquier momento desde tu perfil.'},
  ];

  const IcoLibro=()=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'#fff',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',width:20,height:20},h('path',{d:'M4 19.5A2.5 2.5 0 016.5 17H20'}),h('path',{d:'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'}));

  return h('div',{className:'landing'},
    // NAV
    h('nav',{className:'lnav'},
      h('div',{className:'lnav-logo'},
        h('span',{className:'logo-text'},h('span',{className:'lt'},'T'),'ALIXEA')),
      h('div',{className:'lnav-btns'},
        h('button',{className:'lnav-in',onClick:onLogin},'Iniciar sesión'),
        h('button',{className:'lnav-reg',onClick:onReg},'Empezar gratis'))),

    // HERO
    h('section',{className:'hero-sec'},
      h('div',{className:'hero-blob'}),
      h('div',{className:'hero-badge'},'✦ Método respaldado por la ciencia'),
      h('h1',{className:'hero-h'},'Aprende idiomas ',h('em',null,'leyendo'),'.',h('br'),null,'Como siempre debió ser.'),
      h('p',{className:'hero-sub'},'Talixea teje tu lengua materna con el nuevo idioma en textos reales. Tu mente absorbe el idioma como lo que es: una historia que se despliega.'),
      h('div',{className:'hero-btns'},
        h('button',{className:'btn-p',onClick:onReg},'Comenzar tu historia — es gratis'),
        h('button',{className:'btn-g',onClick:onLogin},'Ya tengo cuenta')),
      h('div',{className:'hero-trust'},
        h('div',{className:'hero-trust-item'},'✓ Gratis para siempre'),
        h('div',{className:'hero-trust-item'},'✓ 6 idiomas'),
        h('div',{className:'hero-trust-item'},'✓ Sin anuncios en Premium'))),

    // DEMO INTERACTIVA
    h('section',{className:'demo-sec'},
      h('div',{className:'demo-card'},
        h('div',{className:'demo-header'},
          h('span',{className:'demo-libro'},'📖 Blancanieves · Grimm'),
          h('div',{className:'demo-lang'},h(Flag,{id:'en',size:16}),'Inglés')),
        h('div',{className:'demo-slider-wrap'},
          h('div',{className:'demo-slider-lbl'},
            h('span',null,'Nivel de inmersión'),
            h('span',{style:{color:'var(--indigo)',fontWeight:700}},`${demoImm}%`)),
          h('input',{type:'range',min:0,max:100,value:demoImm,className:'demo-slider',
            style:{background:`linear-gradient(90deg,var(--indigo) ${demoImm}%,var(--border) ${demoImm}%)`},
            onChange:e=>setDemoImm(+e.target.value)})),
        h('div',{className:'demo-txt'},
          renderFrases(DEMO_FRASES,demoImm,DEMO_IDIOMA)))),

    // FEATURES
    h('section',{className:'feat-sec'},
      h('div',{className:'feat-label'},'Funcionalidades'),
      h('h2',{className:'feat-h'},'Todo lo que necesitas para aprender de verdad'),
      h('div',{className:'feat-list'},
        [{ico:'📈',t:'Inmersión progresiva automática',d:'Empiezas con el 20% en el nuevo idioma. Cada capítulo sube el nivel hasta llegar al 90% al final. Nunca te pierdes, siempre avanzas.'},
         {ico:'🔥',t:'Racha diaria',d:'Establece tu meta diaria (minutos, palabras o páginas) y mantén tu racha. La constancia es el secreto del aprendizaje.'},
         {ico:'💡',t:'Traducciones al instante',d:'Pasa el ratón o toca cualquier palabra en el nuevo idioma para ver el original. Haz clic para marcarla como aprendida.'},
         {ico:'📚',t:'Biblioteca de clásicos',d:'Textos reales de dominio público: Grimm, Andersen, y más. Literatura auténtica, no frases inventadas.'},
         {ico:'🎯',t:'Palabras aprendidas',d:'Las palabras que ya conoces aparecen siempre en el idioma nuevo, sin tooltip. Tu vocabulario crece de forma visible.'},
        ].map((f,i)=>h('div',{key:i,className:'feat-item'},
          h('div',{className:'feat-ico'},f.ico),
          h('div',{className:'feat-body'},h('h3',null,f.t),h('p',null,f.d)))))),

    // CIENCIA
    h('section',{className:'sci-sec'},
      h('div',{className:'feat-label'},'Respaldado por la ciencia'),
      h('p',{className:'sci-quote'},'"Learners who read diglot weave texts showed significantly faster vocabulary acquisition and better long-term retention compared to traditional methods."'),
      h('p',{className:'sci-author'},'— Evans et al., 2020 · Second Language Vocabulary Acquisition')),

    // FAQ
    h('section',{className:'faq-sec'},
      h('div',{className:'feat-label'},'Preguntas frecuentes'),
      h('h2',{className:'feat-h'},'Todo lo que necesitas saber'),
      FAQS.map((f,i)=>h('div',{key:i,className:'faq-item',onClick:()=>setFaqOpen(faqOpen===i?null:i)},
        h('div',{className:'faq-q'},
          h('span',{className:'faq-qt'},f.q),
          h('span',{className:`faq-ico ${faqOpen===i?'open':''}`,style:{fontStyle:'normal'}},'+')),
        h('p',{className:`faq-a ${faqOpen===i?'open':''}`},f.a)))),

    // CTA FINAL
    h('section',{className:'cta-sec'},
      h('h2',{className:'cta-h'},'Empieza a leer hoy.',h('br'),'En serio.'),
      h('p',{className:'cta-sub'},'Únete gratis. Sin tarjeta de crédito. Sin trucos. Solo buenos libros y un idioma nuevo.'),
      h('button',{className:'btn-p',onClick:onReg},'Crear cuenta gratis'),
      h('div',{className:'cta-trust'},
        ['Gratis para siempre','6 idiomas disponibles','Sin tarjeta de crédito'].map((t,i)=>h('span',{key:i,className:'cta-trust-item'},t)))),

    h('footer',{className:'lfoot'},'© 2025 Talixea · Aprende idiomas leyendo')
  );
}

// ── REGISTRO ──────────────────────────────────────────────────────────────────
function Registro({onReg,onLogin}){
  const [paso,setPaso]=useState(1);
  const [name,setName]=useState('');const [email,setEmail]=useState('');const [pw,setPw]=useState('');
  const [idiomas,setIdiomas]=useState([]);const [err,setErr]=useState('');

  function toggleIdioma(id){
    setIdiomas(prev=>prev.includes(id)?prev.filter(i=>i!==id):[...prev,id]);
    setErr('');
  }
  function paso1(){
    if(!name.trim())return setErr('Escribe tu nombre.');
    if(!email.includes('@'))return setErr('Email no válido.');
    if(pw.length<6)return setErr('Mínimo 6 caracteres.');
    setErr('');setPaso(2);
  }
  function paso2(){
    if(!idiomas.length)return setErr('Elige al menos un idioma.');
    const r=onReg(name,email,pw,idiomas);
    if(r.error)setErr(r.error);
  }

  return h('div',{className:'auth'},
    h('div',{className:'auth-logo',onClick:onLogin,style:{cursor:'pointer'}},
      h('span',{className:'logo-text'},h('span',{className:'lt'},'T'),'ALIXEA')),
    h('div',{className:'auth-card'},
      paso===1?[
        h('button',{key:'back',onClick:onLogin,style:{background:'none',border:'none',cursor:'pointer',color:'var(--soft)',fontSize:13,fontFamily:'Inter,sans-serif',marginBottom:16,padding:0,display:'flex',alignItems:'center',gap:4}},'← Volver'),
        h('h1',{key:'t',className:'auth-title'},'Crea tu cuenta'),
        h('p',{key:'s',className:'auth-sub'},'Empieza a aprender idiomas leyendo. Es gratis.'),
        err&&h('div',{key:'e',className:'auth-err'},err),
        h('div',{key:'n',className:'fg'},h('label',null,'Nombre'),h('input',{type:'text',value:name,onChange:e=>setName(e.target.value),placeholder:'Tu nombre'})),
        h('div',{key:'em',className:'fg'},h('label',null,'Email'),h('input',{type:'email',value:email,onChange:e=>setEmail(e.target.value),placeholder:'tu@email.com'})),
        h('div',{key:'pw',className:'fg'},h('label',null,'Contraseña'),h('input',{type:'password',value:pw,onChange:e=>setPw(e.target.value),placeholder:'Mínimo 6 caracteres',onKeyDown:e=>e.key==='Enter'&&paso1()})),
        h('button',{key:'btn',className:'btn-p',onClick:paso1},'Continuar →'),
        h('div',{key:'f',className:'auth-foot'},'¿Ya tienes cuenta? ',h('button',{className:'lnk',onClick:onLogin},'Inicia sesión'))
      ]:[
        h('h1',{key:'t',className:'auth-title'},'¿Qué idiomas quieres aprender?'),
        h('p',{key:'s',className:'auth-sub'},'Puedes elegir uno o varios. Cada idioma guarda su propio progreso.'),
        err&&h('div',{key:'e',className:'auth-err'},err),
        h('div',{key:'g',className:'lang-grid'},
          IDIOMAS.map(id=>h('div',{key:id.id,className:`lang-opt ${idiomas.includes(id.id)?'on':''}`,onClick:()=>toggleIdioma(id.id)},
            h('div',{className:'lang-flag'},h(Flag,{id:id.id})),
            h('div',{style:{flex:1}},h('span',{className:'lang-name'},id.n)),
            idiomas.includes(id.id)&&h('span',{style:{color:'var(--indigo)',fontWeight:700,fontSize:16}},'✓')))),
        h('button',{key:'btn',className:'btn-p',onClick:paso2,disabled:!idiomas.length,style:{opacity:idiomas.length?1:.5}},
          idiomas.length?`Empezar ${idiomas.length>1?`con ${idiomas.length} idiomas`:'a aprender'}`:'Selecciona al menos uno'),
        h('button',{key:'bk',className:'btn-g',style:{marginTop:10},onClick:()=>setPaso(1)},'← Volver')
      ]
    )
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({onLogin,onLanding,onReg}){
  const [email,setEmail]=useState('');const [pw,setPw]=useState('');const [err,setErr]=useState('');
  const IcoLibro=()=>h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'#fff',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',width:24,height:24},h('path',{d:'M4 19.5A2.5 2.5 0 016.5 17H20'}),h('path',{d:'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'}));
  function go(){const r=onLogin(email,pw);if(r.error)setErr(r.error);}
  return h('div',{className:'auth'},
    h('div',{className:'auth-logo',onClick:onLanding},
      h('span',{className:'logo-text'},h('span',{className:'lt'},'T'),'ALIXEA')),
    h('div',{className:'auth-card'},
      h('button',{onClick:onLanding,style:{background:'none',border:'none',cursor:'pointer',color:'var(--soft)',fontSize:13,fontFamily:'Inter,sans-serif',marginBottom:16,padding:0,display:'flex',alignItems:'center',gap:4}},'← Volver'),
      h('h1',{className:'auth-title'},'Bienvenido de nuevo'),
      h('p',{className:'auth-sub'},'Continúa tu aventura de aprendizaje'),
      err&&h('div',{className:'auth-err'},err),
      h('div',{className:'fg'},h('label',null,'Email'),h('input',{type:'email',value:email,onChange:e=>setEmail(e.target.value),placeholder:'tu@email.com'})),
      h('div',{className:'fg'},h('label',null,'Contraseña'),h('input',{type:'password',value:pw,onChange:e=>setPw(e.target.value),placeholder:'••••••••',onKeyDown:e=>e.key==='Enter'&&go()})),
      h('button',{className:'btn-p',onClick:go},'Entrar'),
      h('div',{className:'auth-foot'},'¿No tienes cuenta? ',h('button',{className:'lnk',onClick:onReg},'Regístrate gratis'))
    )
  );
}
