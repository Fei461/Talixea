// ── APP PRINCIPAL ─────────────────────────────────────────────────────────────
function App(){
  const {user,reg,login,logout,upd,addIdioma,removeIdioma,switchIdioma}=useAuth();
  const [screen,setScreen]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('tx_u')||'null')?'inicio':'landing';}
    catch{return 'landing';}
  }); // landing|login|registro|inicio|biblioteca|ajustes|stats|practica|quiz|lector
  const [libro,setLibro]=useState(null);
  const [cap,setCap]=useState(0);
  const [cargando,setCargando]=useState(false);
  const [prog,setProg]=useState(0);
  const [meta,setMeta]=useState({tipo:'minutos',unidad:'min',valor:10});
  const [menuOpen,setMenuOpen]=useState(false);
  const [modalIdioma,setModalIdioma]=useState(false);
  const [nuevoIdioma,setNuevoIdioma]=useState('');
  // Accesibilidad lector
  const [fontSize,setFontSize]=useState('md'); // md|lg|xl
  const [dyslexic,setDyslexic]=useState(false);
  // Stats y logros
  const [stats,setStats]=useState(loadStats);
  const [achToast,setAchToast]=useState(null);
  // Quiz
  const [quizMode,setQuizMode]=useState(null); // 'diaria'|'libre'
  const [quizQs,setQuizQs]=useState([]);
  const [quizIdx,setQuizIdx]=useState(0);
  const [quizLives,setQuizLives]=useState(5);
  const [quizSel,setQuizSel]=useState(null);
  const [quizWrite,setQuizWrite]=useState('');
  const [quizDone,setQuizDone]=useState(false);
  const [quizAciertos,setQuizAciertos]=useState(0);
  const [quizXPGanado,setQuizXPGanado]=useState(0);
  // Biblioteca
  const [bibQ,setBibQ]=useState('');
  const [bibFiltro,setBibFiltro]=useState({precio:null,coleccion:null,autor:null});
  const [bibDropdown,setBibDropdown]=useState(null); // 'precio'|'coleccion'|'autor'|null
  // Quiz extra
  const [quizShowHint,setQuizShowHint]=useState(false);

  const lRef=useRef(null);
  const isPrem=false;
  const progDia=3;

  const immPct=libro?calcPct(cap,libro.totalCaps,isPrem):20;
  const immReal=libro?calcImmReal(libro.caps[cap]?.frases||[],immPct,user?.idioma):0;

  // Guardar stats cuando cambian
  useEffect(()=>{saveStats(stats);},[stats]);

  // Comprobar badges nuevos
  function checkBadges(newStats){
    const nuevos=BADGES.filter(b=>!newStats.badgesDesbloqueados.includes(b.id)&&b.check(newStats));
    if(nuevos.length>0){
      const updated={...newStats,badgesDesbloqueados:[...newStats.badgesDesbloqueados,...nuevos.map(b=>b.id)]};
      setStats(updated);
      // Mostrar toast del primero
      setAchToast(nuevos[0]);
      setTimeout(()=>setAchToast(null),4000);
      return updated;
    }
    return newStats;
  }

  function addXP(xp,reason){
    setStats(prev=>{
      const ns={...prev,xp:(prev.xp||0)+xp};
      return checkBadges(ns);
    });
  }

  // Al hacer login ir a inicio
  useEffect(()=>{if(user&&(screen==='landing'||screen==='login'||screen==='registro'))setScreen('inicio');},[user]);

  // Scroll → progreso
  useEffect(()=>{
    if(screen!=='lector'||!lRef.current)return;
    const el=lRef.current;
    const fn=()=>{const sh=el.scrollHeight-el.clientHeight;setProg(sh>0?(el.scrollTop/sh)*100:0);};
    el.addEventListener('scroll',fn);
    return()=>el.removeEventListener('scroll',fn);
  },[screen]);

  async function abrirLibro(lb){
    if(!lb.gratis&&!isPrem){alert('📚 Contenido Premium\nDesbloquea la biblioteca completa con Talixea Premium.');return;}
    if(lb.caps&&lb.caps.length>0){setLibro(lb);setCap(0);setScreen('lector');setProg(0);return;}
    setCargando(true);
    try{
      const resp=await fetch(`books/${lb.file}`);
      const data=await resp.json();
      const idx=LIBROS.findIndex(l=>l.id===lb.id);
      if(idx>=0)LIBROS[idx].caps=data.caps;
      setLibro({...lb,...data});setCap(0);setScreen('lector');setProg(0);
    }catch(e){alert('No se pudo cargar el libro. Comprueba tu conexión.');}
    finally{setCargando(false);}
  }

  // Registrar palabras vistas — solo las del EXPR que aparecen en las frases
  function registrarPalabrasVistas(frases,idioma){
    if(!frases||!idioma)return;
    const nuevasPals={...stats.palabras};
    frases.forEach(f=>{
      if(!f.es)return;
      // Tokenizar y extraer solo las palabras del EXPR que tienen traducción
      const tokens=tokenizarConExpr(f.es,idioma);
      tokens.forEach(t=>{
        if(t.tipo==='e'&&t.trad){
          const key=`${idioma}:${t.key}`;
          if(!nuevasPals[key])nuevasPals[key]={es:t.key,trad:t.trad,aciertos:0,escrituraOk:0};
        }
      });
    });
    setStats(prev=>({...prev,palabras:nuevasPals}));
  }

  // Capítulo completado
  function capCompletado(){
    const h=new Date().getHours();
    setStats(prev=>{
      const ns={
        ...prev,
        capsCompletados:(prev.capsCompletados||0)+1,
        xp:(prev.xp||0)+100,
        leidoNocturno:prev.leidoNocturno||(h>=23),
        leidoMadrugada:prev.leidoMadrugada||(h<7),
      };
      return checkBadges(ns);
    });
  }

  // Iniciar quiz
  function iniciarQuiz(modo){
    const pals=Object.values(stats.palabras);
    if(pals.length<4){alert('Necesitas leer al menos un capítulo primero para tener vocabulario que practicar.');return;}
    const idiomaNom=IDIOMAS.find(i=>i.id===user.idioma)?.n||'el idioma';
    const n=modo==='diaria'?20:10;
    const qs=generarPreguntas(pals,idiomaNom,n);
    setQuizQs(qs);setQuizIdx(0);setQuizLives(5);setQuizSel(null);
    setQuizWrite('');setQuizDone(false);setQuizAciertos(0);setQuizXPGanado(0);
    setQuizMode(modo);setScreen('quiz');
  }

  // Procesar respuesta quiz
  function responderQuiz(ok,esEscritura=false){
    const q=quizQs[quizIdx];
    const prevEstrella=calcEstrella(stats.palabras[`${user.idioma}:${q.palabra.es.slice(0,40)}`]);
    setStats(prev=>{
      const key=`${user.idioma}:${q.palabra.es.slice(0,40)}`;
      const pal={...(prev.palabras[key]||{es:q.palabra.es,trad:q.palabra.trad,aciertos:0,escrituraOk:0})};
      if(ok){pal.aciertos=(pal.aciertos||0)+1;if(esEscritura)pal.escrituraOk=(pal.escrituraOk||0)+1;}
      const nuevaEstrella=calcEstrella(pal);
      let xpExtra=0;
      if(ok&&quizMode==='diaria'){xpExtra+=15;}
      if(nuevaEstrella>prevEstrella){xpExtra+=XP_ESTRELLA[nuevaEstrella];}
      const ns={...prev,palabras:{...prev.palabras,[key]:pal},xp:(prev.xp||0)+xpExtra};
      return checkBadges(ns);
    });
    if(ok){setQuizAciertos(v=>v+1);}
    else if(quizMode==='diaria'){
      setQuizLives(v=>{const nv=v-1;if(nv<=0){setTimeout(()=>finalizarQuiz(quizAciertos,0,true),800);}return nv;});
    }
  }

  function avanzarQuiz(){
    setQuizSel(null);setQuizWrite('');
    if(quizLives<=0||quizIdx>=quizQs.length-1){finalizarQuiz(quizAciertos,quizLives,quizLives<=0);return;}
    setQuizIdx(v=>v+1);
  }

  function finalizarQuiz(aciertos,vidasRestantes,perdido=false){
    let xp=0;
    if(quizMode==='diaria'&&!perdido&&!stats.practicaDiariaHoy){
      const xpMap=[0,50,75,100,125,150];
      xp=xpMap[Math.min(5,vidasRestantes)];
      setStats(prev=>({...prev,practicaDiariaHoy:true,xp:(prev.xp||0)+xp,ultimaDiaria:new Date().toDateString()}));
    }else if(quizMode==='libre'&&!stats.repasoLibreHoyXP&&aciertos>=5){
      xp=15;
      setStats(prev=>({...prev,repasoLibreHoyXP:true,xp:(prev.xp||0)+xp}));
    }
    setQuizXPGanado(xp);
    setQuizDone(true);
  }

  function IcoLibro({color='#fff',size=18}){return h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:color,strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',width:size,height:size},h('path',{d:'M4 19.5A2.5 2.5 0 016.5 17H20'}),h('path',{d:'M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z'}));}

  function Nav({act}){
    return h('header',{className:'hdr'},
      h('div',{className:'logo',onClick:()=>setScreen('inicio')},
        h('span',{className:'logo-text'},h('span',{className:'lt'},'T'),'ALIXEA')),
      h('nav',{className:'nav'},
        h('button',{className:`np ${act==='inicio'?'on':''}`,onClick:()=>setScreen('inicio')},'Inicio'),
        h('button',{className:`np ${act==='biblioteca'?'on':''}`,onClick:()=>setScreen('biblioteca')},'Biblioteca'),
        h('button',{className:`np ${act==='practica'?'on':''}`,onClick:()=>setScreen('practica')},'Práctica'),
        h('button',{className:`np ${act==='stats'?'on':''}`,onClick:()=>setScreen('stats')},'Logros')),
      h('div',{style:{position:'relative'}},
        h('button',{className:'av',onClick:()=>setMenuOpen(v=>!v)},user?.name?.[0]?.toUpperCase()||'?'),
        menuOpen&&h('div',{className:'pm-wrap'},
          h('div',{className:'pm-hdr'},h('div',{className:'pm-name'},user?.name),h('div',{className:'pm-email'},user?.email)),
          h('button',{className:'pm-item',onClick:()=>{setScreen('ajustes');setMenuOpen(false);}},'Ajustes'),
          h('button',{className:'pm-item danger',onClick:()=>{logout();setScreen('landing');setMenuOpen(false);}},'Cerrar sesión'))));
  }

  // ── PANTALLAS SIN USUARIO ─────────────────────────────────────────────────
  if(!user){
    if(screen==='login')return h(Login,{onLogin:login,onLanding:()=>setScreen('landing'),onReg:()=>setScreen('registro')});
    if(screen==='registro')return h(Registro,{onReg:reg,onLogin:()=>setScreen('login')});
    return h(Landing,{onLogin:()=>setScreen('login'),onReg:()=>setScreen('registro')});
  }

  const idiomaDatos=IDIOMAS.find(i=>i.id===user.idioma)||IDIOMAS[0];
  const xp=user.xp||0;
  const rango=getRango(xp);
  const proxRango=getProxRango(xp);
  const xpEnRango=xp-rango.xp;
  const xpParaProx=proxRango?(proxRango.xp-rango.xp):1;
  const pctXpBar=proxRango?Math.round((xpEnRango/xpParaProx)*100):100;

  // ── SIDEBAR DESKTOP ───────────────────────────────────────────────────────
  const NAV_ITEMS=[
    {id:'inicio',ico:'🏠',label:'Inicio'},
    {id:'biblioteca',ico:'📚',label:'Biblioteca'},
    {id:'practica',ico:'🎯',label:'Práctica'},
    {id:'stats',ico:'🏆',label:'Logros'},
    {id:'ajustes',ico:'⚙️',label:'Ajustes'},
  ];
  function SidebarDesktop({act}){
    return h('aside',{className:'sidebar-desktop'},
      h('div',{className:'sidebar-logo'},
        h('span',{className:'logo-text',style:{cursor:'pointer'},onClick:()=>setScreen('inicio')},
          h('span',{className:'lt'},'T'),'ALIXEA')),
      h('nav',{className:'sidebar-nav'},
        NAV_ITEMS.map(item=>h('button',{
          key:item.id,
          className:`sidebar-item ${act===item.id?'on':''}`,
          onClick:()=>{setScreen(item.id);setMenuOpen(false);}
        },
          h('span',{className:'sidebar-item-ico'},item.ico),
          item.label))),
      h('div',{className:'sidebar-footer'},
        h('div',{className:'sidebar-xp'},
          h('div',{className:'sidebar-xp-rank'},`${rango.ico} ${rango.tit}`),
          h('div',{className:'sidebar-xp-bar'},
            h('div',{className:'sidebar-xp-fill',style:{width:`${pctXpBar}%`}}))),
        h('div',{className:'sidebar-user',onClick:()=>setMenuOpen(v=>!v)},
          h('div',{className:'sidebar-avatar'},user?.name?.[0]?.toUpperCase()||'?'),
          h('div',{style:{flex:1,minWidth:0}},
            h('div',{className:'sidebar-user-name'},user?.name),
            h('div',{className:'sidebar-user-email',style:{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},user?.email)),
          menuOpen&&h('div',{className:'pm-wrap',style:{bottom:70,top:'auto',left:12,right:12}},
            h('button',{className:'pm-item danger',onClick:()=>{logout();setScreen('landing');setMenuOpen(false);}},'Cerrar sesión')))));
  }

  // Wrapper que incluye sidebar desktop + header mobile para cada pantalla app
  function AppShell({act,children}){
    return h('div',{style:{display:'contents'}},
      h(SidebarDesktop,{act}),
      h('div',{className:'app',onClick:()=>setMenuOpen(false)},
        h(Nav,{act}),
        children));
  }

  // ── INICIO ────────────────────────────────────────────────────────────────
  if(screen==='inicio') return h(AppShell,{act:'inicio'},
    h('main',{className:'imain'},
    h('main',{className:'imain'},
      h('div',{className:'racha'},
        h('div',{className:'racha-ic'},
          h('svg',{viewBox:'0 0 24 36',width:28,height:42,fill:'none'},
            h('path',{d:'M2 2h20v32l-10-7L2 34V2z',fill:(user.racha||0)>0?'#6366F1':'#E2E8F0',stroke:(user.racha||0)>0?'#4F46E5':'#CBD5E1',strokeWidth:1.5,strokeLinejoin:'round'}),
            (user.racha||0)>0&&h('path',{d:'M8 12l2 2 4-4',stroke:'#fff',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'})
          )),
        h('div',{className:'racha-inf'},
          h('div',{className:'racha-top'},h('span',{className:'racha-n'},user.racha||0),h('span',{className:'racha-lb'},(user.racha||0)===1?'capítulo de racha':'capítulos de racha')),
          h('div',{className:'rb-bg'},h('div',{className:'rb-fill',style:{width:(user.racha||0)>0?`${Math.min(100,(progDia/meta.valor)*100)}%`:'0%'}})),
          h('span',{className:'racha-mt'},(user.racha||0)>0?`Tu marcapáginas avanza: ${progDia} de ${meta.valor} ${meta.unidad} hoy`:'Lee tu primer capítulo para comenzar tu racha'))),
      h('section',{className:'hero-app'},
        h('h1',{className:'hero-app-t'},`Bienvenido, ${user.name.split(' ')[0]}.`),
        h('p',{className:'hero-app-s'},'Tu próximo capítulo te espera. Cada página que lees teje un nuevo hilo en tu vocabulario — sin esfuerzo, sin repetición.')),
      h('section',{className:'sec'},
        h('div',{className:'sec-hdr'},h('span',{className:'sec-t'},'Tus idiomas')),
        // Idiomas activos
        h('div',{style:{display:'flex',flexDirection:'column',gap:10}},
          (user.idiomas||[user.idioma]).map(id=>{
            const datos=IDIOMAS.find(i=>i.id===id)||IDIOMAS[0];
            const activo=user.idioma===id;
            return h('div',{key:id,className:'idioma-activo',style:{border:activo?'1.5px solid var(--indigo)':'1.5px solid var(--border)',background:activo?'var(--ip)':'#fff',cursor:'pointer'},
              onClick:()=>switchIdioma(id)},
              h('div',{className:'ia-flag'},h(Flag,{id})),
              h('div',{className:'ia-info'},
                h('span',{className:'ia-label'},activo?'Leyendo ahora':'Cambiar a este'),
                h('span',{className:'ia-name'},datos.n)),
              activo&&h('span',{style:{fontSize:11,background:'var(--indigo)',color:'#fff',borderRadius:6,padding:'3px 8px',fontWeight:700,flexShrink:0}},'ACTIVO'),
              !activo&&(user.idiomas||[]).length>1&&h('button',{className:'ia-change',style:{color:'#DC2626',fontSize:11},
                onClick:e=>{e.stopPropagation();removeIdioma(id);}
              },'Quitar'));
          }),
          // Botón añadir idioma (si no tiene todos)
          (user.idiomas||[user.idioma]).length < IDIOMAS.length &&
          h('button',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderRadius:'var(--rs)',border:'1.5px dashed var(--border)',background:'none',cursor:'pointer',color:'var(--soft)',fontSize:13,fontWeight:500,fontFamily:'Inter,sans-serif',width:'100%',justifyContent:'center'},
            onClick:()=>setModalIdioma(true)},'+ Añadir otro idioma')
        )),
      h('section',{className:'sec'},
        h('div',{className:'sec-hdr'},h('span',{className:'sec-t'},'Progresión de inmersión')),
        h('div',{className:'imm-info'},
          h('div',{className:'imm-info-t'},`📈 Automática ${isPrem?'hasta el 90%':'hasta el 60% · Plan gratuito'}`),
          isPrem
            ?h('div',{className:'imm-info-s'},'Empiezas en el 20% y llegas al 90% en el último capítulo. Cada página teje más hilos en el nuevo idioma.')
            :h('div',{className:'imm-info-s'},'Con el plan gratuito llegas hasta el 60% de inmersión. ',h('span',{style:{color:'var(--indigo)',fontWeight:600}},'Premium'),' desbloquea el 90% y la biblioteca completa.'))),
      h('section',{className:'sec',style:{paddingBottom:0}},
        h('div',{className:'sec-hdr'},
          h('span',{className:'sec-t'},'Empieza a leer'),
          h('button',{className:'ver-t',onClick:()=>setScreen('biblioteca')},'Ver todos →'))),
      h('div',{className:'lb-scroll'},
        LIBROS.filter(l=>l.gratis).map(lb=>h('div',{key:lb.id,className:'lb-card',onClick:()=>abrirLibro(lb)},
          h('div',{className:`lb-cov ${lb.cov}`},h('span',null,lb.emo)),
          h('div',{className:'lb-inf'},
            h('span',{className:'lb-cat'},lb.cat),
            h('span',{className:'lb-tit'},lb.tit),
            h('span',{className:'lb-aut'},lb.aut),
            h('div',{className:'lb-prog'},h('div',{className:'lb-prog-fill',style:{width:'0%'}})))))),
      // MODAL AÑADIR IDIOMA
      modalIdioma&&h('div',{className:'modal-bg',onClick:()=>setModalIdioma(false)},
        h('div',{className:'modal',onClick:e=>e.stopPropagation()},
          h('div',{className:'modal-t'},'Añadir idioma'),
          h('div',{className:'modal-s'},'Elige los idiomas que quieres aprender. Cada uno guarda su propio progreso de manera independiente.'),
          h('div',{className:'lang-grid'},
            IDIOMAS.filter(id=>!(user.idiomas||[user.idioma]).includes(id.id)).map(id=>
              h('div',{key:id.id,className:`lang-opt ${nuevoIdioma===id.id?'on':''}`,onClick:()=>setNuevoIdioma(id.id)},
                h('div',{className:'lang-flag'},h(Flag,{id:id.id})),
                h('span',{className:'lang-name'},id.n)))),
          h('button',{className:'btn-p',style:{marginTop:8},
            disabled:!nuevoIdioma,
            onClick:()=>{if(nuevoIdioma){addIdioma(nuevoIdioma);setModalIdioma(false);setNuevoIdioma('');}}}
          ,nuevoIdioma?`Añadir ${IDIOMAS.find(i=>i.id===nuevoIdioma)?.n}`:'Selecciona un idioma')
        ))
    )
  ));

  // ── BIBLIOTECA ────────────────────────────────────────────────────────────
  if(screen==='biblioteca'){
    const cats=[...new Set(LIBROS.map(l=>l.cat))];
    const autores=[...new Set(LIBROS.map(l=>l.aut))];

    const librosFiltrados=LIBROS.filter(lb=>{
      const q=bibQ.toLowerCase().trim();
      const matchQ=!q||(lb.tit.toLowerCase().includes(q)||lb.aut.toLowerCase().includes(q)||lb.cat.toLowerCase().includes(q));
      const matchPrecio=!bibFiltro.precio||(bibFiltro.precio==='gratis'?lb.gratis:!lb.gratis);
      const matchCat=!bibFiltro.coleccion||lb.cat===bibFiltro.coleccion;
      const matchAut=!bibFiltro.autor||lb.aut===bibFiltro.autor;
      return matchQ&&matchPrecio&&matchCat&&matchAut;
    });

    const hayFiltro=bibFiltro.precio||bibFiltro.coleccion||bibFiltro.autor;

    function toggleDropdown(k){setBibDropdown(v=>v===k?null:k);}
    function setFiltro(grupo,val){
      setBibFiltro(prev=>({...prev,[grupo]:prev[grupo]===val?null:val}));
      setBibDropdown(null);
    }

    return h(AppShell,{act:'biblioteca'},
      h('main',{className:'pmain',onClick:()=>setBibDropdown(null)},
        h('h1',{className:'ptit'},'Biblioteca'),

        // Buscador
        h('div',{className:'bib-search-wrap'},
          h('span',{className:'bib-search-ico'},'🔍'),
          h('input',{className:'bib-search',type:'text',
            placeholder:'Buscar por título, autor o colección...',
            value:bibQ,onChange:e=>setBibQ(e.target.value)})),

        // Filtros agrupados
        h('div',{className:'bib-filter-groups',onClick:e=>e.stopPropagation()},

          // Precio
          h('div',{className:'bib-group'},
            h('button',{
              className:`bib-group-btn ${bibFiltro.precio?'active':''}`,
              onClick:()=>toggleDropdown('precio')
            },bibFiltro.precio?(bibFiltro.precio==='gratis'?'Gratis':'Premium'):'Precio',h('span',{className:'arrow'},'▾')),
            bibDropdown==='precio'&&h('div',{className:'bib-dropdown'},
              [{val:'gratis',label:'🆓 Gratis'},{val:'premium',label:'🔒 Premium'}].map(o=>
                h('div',{key:o.val,className:`bib-dropdown-item ${bibFiltro.precio===o.val?'on':''}`,
                  onClick:()=>setFiltro('precio',o.val)},
                  o.label,bibFiltro.precio===o.val&&h('span',{className:'check'},'✓'))))),

          // Colección
          h('div',{className:'bib-group'},
            h('button',{
              className:`bib-group-btn ${bibFiltro.coleccion?'active':''}`,
              onClick:()=>toggleDropdown('coleccion')
            },bibFiltro.coleccion||'Colección',h('span',{className:'arrow'},'▾')),
            bibDropdown==='coleccion'&&h('div',{className:'bib-dropdown'},
              cats.map(c=>h('div',{key:c,className:`bib-dropdown-item ${bibFiltro.coleccion===c?'on':''}`,
                onClick:()=>setFiltro('coleccion',c)},
                c,bibFiltro.coleccion===c&&h('span',{className:'check'},'✓'))))),

          // Autor
          h('div',{className:'bib-group'},
            h('button',{
              className:`bib-group-btn ${bibFiltro.autor?'active':''}`,
              onClick:()=>toggleDropdown('autor')
            },bibFiltro.autor||'Autor',h('span',{className:'arrow'},'▾')),
            bibDropdown==='autor'&&h('div',{className:'bib-dropdown'},
              autores.map(a=>h('div',{key:a,className:`bib-dropdown-item ${bibFiltro.autor===a?'on':''}`,
                onClick:()=>setFiltro('autor',a)},
                a,bibFiltro.autor===a&&h('span',{className:'check'},'✓'))))),

          // Limpiar filtros
          hayFiltro&&h('button',{className:'bib-group-btn',style:{color:'var(--red,#EF4444)',borderColor:'var(--red,#EF4444)'},
            onClick:()=>{setBibFiltro({precio:null,coleccion:null,autor:null});setBibDropdown(null);}},
            '✕ Limpiar')),

        // Meta
        h('div',{className:'bib-results-meta'},
          librosFiltrados.length===LIBROS.length
            ?`${LIBROS.length} libros en la biblioteca`
            :`${librosFiltrados.length} de ${LIBROS.length} libros`),

        // Lista
        librosFiltrados.length>0
          ?h('div',{className:'lb-list'},
              librosFiltrados.map(lb=>{
                const bloqueado=!lb.gratis&&!isPrem;
                const completado=(stats.librosCompletados||[]).includes(lb.id);
                return h('div',{key:lb.id,className:`lb-row ${bloqueado?'blk':''}`,onClick:()=>abrirLibro(lb)},
                  h('div',{className:`lb-rc ${lb.cov}`},h('span',null,lb.emo),bloqueado&&h('div',{className:'lo'},'🔒')),
                  h('div',{className:'lb-ri'},
                    h('span',{className:'lb-cat'},lb.cat),
                    h('span',{className:'lb-tit',style:{display:'block'}},lb.tit),
                    h('span',{className:'lb-aut'},lb.aut),
                    h('div',{style:{display:'flex',alignItems:'center',gap:8,marginTop:2}},
                      h('span',{style:{fontSize:11,color:'var(--mute)'}},`${lb.totalCaps} capítulos`),
                      completado&&h('span',{style:{fontSize:11,fontWeight:700,color:'#16A34A',background:'#DCFCE7',padding:'2px 8px',borderRadius:10}},'✓ Completado'))),
                  bloqueado&&h('span',{className:'badge-pr'},'PREMIUM'));
              }))
          :h('div',{className:'bib-empty'},
              h('div',{className:'bib-empty-ico'},'📭'),
              h('div',{className:'bib-empty-t'},'Sin resultados'),
              h('div',{className:'bib-empty-s'},'Prueba a cambiar los filtros o el texto de búsqueda.'),
              h('button',{className:'lnk',style:{marginTop:12},
                onClick:()=>{setBibQ('');setBibFiltro({precio:null,coleccion:null,autor:null});}},'Limpiar filtros'))
      )
    );
  }

  // ── AJUSTES ───────────────────────────────────────────────────────────────
  if(screen==='ajustes') return h(AppShell,{act:'ajustes'},
    h('main',{className:'pmain'},
      h('h1',{className:'ptit'},'Ajustes'),
      h('div',{style:{background:'#fff',borderRadius:'var(--r)',padding:20,marginBottom:16,boxShadow:'var(--sh)',border:'1px solid var(--border)'}},
        h('div',{style:{fontSize:15,fontWeight:700,marginBottom:4}},'Meta diaria'),
        h('div',{style:{fontSize:13,color:'var(--soft)',marginBottom:16,lineHeight:1.5}},'¿Qué quieres conseguir cada día para mantener tu racha?'),
        h('div',{style:{display:'flex',flexDirection:'column',gap:10}},
          [{tipo:'minutos',unidad:'min',label:'⏱ Minutos de lectura',vals:[5,10,15,20,30]},
           {tipo:'palabras',unidad:'pal',label:'💬 Palabras nuevas',vals:[5,10,20,30,50]},
           {tipo:'paginas',unidad:'pág',label:'📄 Páginas leídas',vals:[1,2,3,5,10]},
          ].map(o=>h('div',{key:o.tipo,style:{border:`1.5px solid ${meta.tipo===o.tipo?'var(--indigo)':'var(--border)'}`,borderRadius:'var(--rs)',padding:'13px 15px',cursor:'pointer',background:meta.tipo===o.tipo?'var(--ip)':'var(--bg)'},
            onClick:()=>setMeta({tipo:o.tipo,unidad:o.unidad,valor:o.vals[1]})},
            h('span',{style:{fontSize:14,fontWeight:500}},o.label),
            meta.tipo===o.tipo&&h('div',{style:{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}},
              o.vals.map(v=>h('button',{key:v,style:{flex:1,minWidth:40,padding:'7px 4px',borderRadius:8,border:`1.5px solid ${meta.valor===v?'var(--indigo)':'var(--border)'}`,background:meta.valor===v?'var(--indigo)':'#fff',color:meta.valor===v?'#fff':'var(--text)',cursor:'pointer',fontSize:14,fontWeight:600,fontFamily:'Inter,sans-serif'},
                onClick:e=>{e.stopPropagation();setMeta(m=>({...m,valor:v}));}},v))))))),
      h('div',{style:{background:'linear-gradient(135deg,#1E293B,#0F172A)',borderRadius:'var(--r)',padding:24}},
        h('div',{style:{fontSize:17,fontWeight:700,color:'#E0E7FF',marginBottom:16}},'✨ Talixea Premium'),
        h('ul',{style:{listStyle:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:20}},
          ['📚 Biblioteca completa — Grimm, Andersen y más','🎯 Inmersión hasta el 100%','📊 Estadísticas detalladas de aprendizaje','📵 Modo sin conexión','🚫 Sin anuncios'].map((t,i)=>h('li',{key:i,style:{fontSize:14,color:'rgba(255,255,255,.8)'}},t))),
        h('button',{style:{width:'100%',padding:14,borderRadius:'var(--rs)',background:'var(--indigo)',border:'none',cursor:'pointer',color:'#fff',fontSize:15,fontWeight:700,fontFamily:'Inter,sans-serif',boxShadow:'0 4px 16px rgba(99,102,241,.5)'}},'Probar gratis 7 días — 4,99€/mes')),
      h('div',{style:{background:'#fff',borderRadius:'var(--r)',padding:20,marginTop:16,boxShadow:'var(--sh)',border:'1px solid var(--border)'}},
        h('div',{style:{fontSize:15,fontWeight:700,marginBottom:4}},'Restablecer vocabulario'),
        h('div',{style:{fontSize:13,color:'var(--soft)',marginBottom:14,lineHeight:1.5}},'Borra el vocabulario guardado y empieza de cero. Útil si las preguntas de práctica muestran frases enteras en lugar de palabras sueltas.'),
        h('button',{
          style:{padding:'10px 16px',borderRadius:'var(--rs)',background:'none',border:'1.5px solid #EF4444',color:'#EF4444',cursor:'pointer',fontSize:14,fontWeight:600,fontFamily:'Inter,sans-serif'},
          onClick:()=>{if(confirm('¿Seguro? Se borrará todo tu vocabulario y progreso de práctica.')){setStats(prev=>({...prev,palabras:{},xp:Math.max(0,(prev.xp||0)-500)}));alert('Vocabulario restablecido.');}}}
        ,'🗑 Borrar vocabulario'))
    )
  );

  // ── ESTADÍSTICAS Y LOGROS ─────────────────────────────────────────────────
  if(screen==='stats'){
    const rango=getRango(stats.xp||0);
    const prox=getProxRango(stats.xp||0);
    const xpEnRango=(stats.xp||0)-rango.xp;
    const xpParaProx=prox?(prox.xp-rango.xp):1;
    const pctBarra=prox?Math.min(100,Math.round((xpEnRango/xpParaProx)*100)):100;
    const cats=[...new Set(BADGES.map(b=>b.cat))];
    const palsDominadas=Object.values(stats.palabras||{}).filter(p=>calcEstrella(p)>=5).length;
    return h(AppShell,{act:'stats'},
      h('main',{className:'pmain'},
        h('div',{className:'stats-hero'},
          h('div',{className:'stats-level'},
            h('div',{className:'stats-rank-ico'},rango.ico),
            h('div',{className:'stats-rank-info'},
              h('div',{className:'stats-rank-n'},`Nivel ${rango.n}`),
              h('div',{className:'stats-rank-t'},rango.tit))),
          h('div',{className:'stats-xp-bar'},h('div',{className:'stats-xp-fill',style:{width:pctBarra+'%'}})),
          h('div',{className:'stats-xp-txt'},prox
            ?`${(stats.xp||0).toLocaleString()} XP · Faltan ${(prox.xp-(stats.xp||0)).toLocaleString()} para ${prox.tit}`
            :`${(stats.xp||0).toLocaleString()} XP · ¡Nivel máximo!`)),
        h('div',{className:'stats-grid'},
          h('div',{className:'stat-card'},h('div',{className:'stat-card-n'},user?.racha||0),h('div',{className:'stat-card-l'},'🔥 Días de racha')),
          h('div',{className:'stat-card'},h('div',{className:'stat-card-n'},stats.minutosTotal||0),h('div',{className:'stat-card-l'},'⏱ Min. leídos')),
          h('div',{className:'stat-card'},h('div',{className:'stat-card-n'},stats.capsCompletados||0),h('div',{className:'stat-card-l'},'📖 Caps. completados')),
          h('div',{className:'stat-card'},h('div',{className:'stat-card-n'},palsDominadas),h('div',{className:'stat-card-l'},'⭐ Palabras dominadas'))),
        ...cats.map(cat=>h('div',{key:cat,className:'badges-sec'},
          h('div',{className:'badges-cat'},cat),
          h('div',{className:'badges-grid'},
            BADGES.filter(b=>b.cat===cat).map(b=>{
              const unlocked=(stats.badgesDesbloqueados||[]).includes(b.id);
              return h('div',{key:b.id,className:`badge-card ${unlocked?'unlocked':'locked'}`},
                h('span',{className:'badge-ico'},b.ico),
                h('div',{className:'badge-name'},b.name),
                h('div',{className:'badge-hint'},b.hint),
                unlocked&&h('div',{style:{fontSize:11,fontWeight:700,color:'#16A34A',marginTop:4}},'✓ Desbloqueado'));
            }))))
      )
    );
  }

  // ── PRÁCTICA ─────────────────────────────────────────────────────────────
  if(screen==='practica'){
    const nPals=Object.keys(stats.palabras||{}).length;
    const diariaDone=stats.practicaDiariaHoy&&stats.ultimaDiaria===new Date().toDateString();
    return h(AppShell,{act:'practica'},
      h('main',{className:'pmain'},
        h('h1',{className:'ptit'},'Práctica'),
        h('div',{className:'prac-hero'},
          h('div',{style:{fontSize:14,fontWeight:700,marginBottom:6}},'Tu vocabulario'),
          h('div',{style:{fontSize:13,color:'var(--soft)',lineHeight:1.5}},
            nPals>0
              ?`Tienes ${nPals} palabras disponibles para practicar en ${IDIOMAS.find(i=>i.id===user.idioma)?.n}.`
              :'Lee al menos un capítulo para desbloquear el modo práctica.')),
        h('div',{className:'prac-modes'},
          h('div',{className:'prac-mode',onClick:()=>!diariaDone&&iniciarQuiz('diaria'),style:{opacity:diariaDone?.6:1}},
            h('div',{className:'prac-mode-ico'},'⚡'),
            h('div',{className:'prac-mode-info'},
              h('div',{className:'prac-mode-t'},'Práctica diaria'),
              h('div',{className:'prac-mode-s'},diariaDone?'Ya completada hoy. Vuelve mañana.':'20 preguntas · 5 vidas · XP por vidas restantes')),
            h('div',{className:'prac-mode-badge'},diariaDone?'✓ HECHA':'DIARIA')),
          h('div',{className:'prac-mode',onClick:()=>iniciarQuiz('libre')},
            h('div',{className:'prac-mode-ico'},'📚'),
            h('div',{className:'prac-mode-info'},
              h('div',{className:'prac-mode-t'},'Repaso libre'),
              h('div',{className:'prac-mode-s'},'Sin vidas · Sin límite · Practica cuando quieras')),
            h('div',{className:'prac-mode-badge'},'LIBRE')))
      )
    );
  }

  // ── QUIZ ─────────────────────────────────────────────────────────────────
  if(screen==='quiz'){
    if(quizDone||(quizMode==='diaria'&&quizLives<=0)){
      const perdido=quizMode==='diaria'&&quizLives<=0&&!quizDone;
      return h('div',{style:{display:'contents'}},
        h(SidebarDesktop,{act:'practica'}),
        h('div',{className:'quiz-wrap'},
          h('div',{className:'quiz-result'},
            h('div',{className:'quiz-result-ico'},perdido?'💔':'🎉'),
            h('div',{className:'quiz-result-t'},perdido?'Se acabaron las vidas':'¡Sesión completada!'),
            h('div',{className:'quiz-result-s'},`${quizAciertos} respuestas correctas de ${Math.min(quizIdx+1,quizQs.length)} preguntas.`),
            quizXPGanado>0&&h('div',{className:'quiz-xp-earn'},
              h('div',{className:'quiz-xp-n'},`+${quizXPGanado}`),
              h('div',{className:'quiz-xp-l'},'XP ganados')),
            h('button',{className:'btn-p',style:{marginTop:8,maxWidth:300},onClick:()=>setScreen('practica')},'Volver a Práctica'))));
    }
    const q=quizQs[quizIdx];
    if(!q)return null;

    const esCorrecta=(q.tipo!=='write'&&q.opts?.[quizSel]?.ok)||(q.tipo==='write'&&quizSel==='ok');
    const esFallo=quizSel!==null&&!esCorrecta;

    function verificarEscritura(){
      const ok=quizWrite.trim().toLowerCase()===q.respuesta.toLowerCase();
      setQuizSel(ok?'ok':'ko');
      setQuizShowHint(false);
      const key=`${user.idioma}:${q.palabra.es}`;
      const prevEstrella=calcEstrella(stats.palabras[key]);
      setStats(prev=>{
        const pal={...(prev.palabras[key]||{es:q.palabra.es,trad:q.palabra.trad,aciertos:0,escrituraOk:0})};
        if(ok){pal.aciertos=(pal.aciertos||0)+1;pal.escrituraOk=(pal.escrituraOk||0)+1;}
        const nuevaEstrella=calcEstrella(pal);
        let xpExtra=ok&&quizMode==='diaria'?15:0;
        if(nuevaEstrella>prevEstrella)xpExtra+=XP_ESTRELLA[nuevaEstrella];
        return checkBadges({...prev,palabras:{...prev.palabras,[key]:pal},xp:(prev.xp||0)+xpExtra});
      });
      if(!ok&&quizMode==='diaria')setQuizLives(v=>v-1);
      if(ok)setQuizAciertos(v=>v+1);
    }

    function avanzar(){
      if(quizIdx>=quizQs.length-1){
        let xpFinal=0;
        if(quizMode==='diaria'&&!stats.practicaDiariaHoy){
          const xpMap=[0,50,75,100,125,150];
          xpFinal=xpMap[Math.min(5,quizLives)];
          setStats(prev=>({...prev,practicaDiariaHoy:true,ultimaDiaria:new Date().toDateString(),xp:(prev.xp||0)+xpFinal}));
        }else if(quizMode==='libre'&&!stats.repasoLibreHoyXP&&quizAciertos>=5){
          xpFinal=15;
          setStats(prev=>({...prev,repasoLibreHoyXP:true,xp:(prev.xp||0)+xpFinal}));
        }
        setQuizXPGanado(xpFinal);setQuizDone(true);
      }else{setQuizIdx(v=>v+1);setQuizSel(null);setQuizWrite('');setQuizShowHint(false);}
    }

    // Pista: primera letra + longitud
    const pista=q.respuesta?`Empieza por "${q.respuesta[0].toUpperCase()}" · ${q.respuesta.length} letras`:null;

    return h('div',{style:{display:'contents'}},
      h(SidebarDesktop,{act:'practica'}),
      h('div',{className:'quiz-wrap'},
        h('div',{className:'quiz-hdr'},
          h('button',{className:'btn-v',onClick:()=>setScreen('practica')},'✕'),
          h('div',{className:'quiz-prog'},h('div',{className:'quiz-prog-fill',style:{width:`${((quizIdx+1)/quizQs.length)*100}%`}})),
          quizMode==='diaria'&&h('div',{className:'quiz-lives'},[1,2,3,4,5].map(n=>h('span',{key:n,className:`quiz-life ${n>quizLives?'lost':''}`},'❤️'))),
          h('span',{style:{fontSize:12,color:'var(--soft)',whiteSpace:'nowrap'}},`${quizIdx+1}/${quizQs.length}`)),
        h('div',{className:'quiz-body'},
          h('div',{className:'quiz-q-type'},q.preguntaLabel),
          h('div',{className:'quiz-q-word'},q.pregunta),

          // Opciones múltiple
          q.tipo!=='write'&&h('div',{className:'quiz-opts'},
            q.opts.map((opt,i)=>{
              let cls='quiz-opt';
              if(quizSel!==null&&esCorrecta){if(opt.ok)cls+=' correct';else if(quizSel===i)cls+=' wrong';else cls+=' reveal';}
              else if(quizSel!==null&&!esCorrecta){if(quizSel===i)cls+=' wrong';}
              return h('button',{key:i,className:cls,disabled:quizSel!==null,
                onClick:()=>{
                  if(quizSel!==null)return;
                  const ok=opt.ok;
                  setQuizSel(i);setQuizShowHint(false);
                  const key=`${user.idioma}:${q.palabra.es}`;
                  const prevEstrella=calcEstrella(stats.palabras[key]);
                  setStats(prev=>{
                    const pal={...(prev.palabras[key]||{es:q.palabra.es,trad:q.palabra.trad,aciertos:0,escrituraOk:0})};
                    if(ok)pal.aciertos=(pal.aciertos||0)+1;
                    const nuevaEstrella=calcEstrella(pal);
                    let xpExtra=ok&&quizMode==='diaria'?15:0;
                    if(nuevaEstrella>prevEstrella)xpExtra+=XP_ESTRELLA[nuevaEstrella];
                    return checkBadges({...prev,palabras:{...prev.palabras,[key]:pal},xp:(prev.xp||0)+xpExtra});
                  });
                  if(!ok&&quizMode==='diaria')setQuizLives(v=>v-1);
                  if(ok)setQuizAciertos(v=>v+1);
                }},opt.t);
            })),

          // Escritura
          q.tipo==='write'&&h('div',{style:{display:'flex',flexDirection:'column',gap:12}},
            h('input',{className:`quiz-write ${quizSel==='ok'?'correct':quizSel==='ko'?'wrong':''}`,
              type:'text',placeholder:'Escribe tu respuesta...',value:quizWrite,
              disabled:quizSel!==null,
              onChange:e=>setQuizWrite(e.target.value),
              onKeyDown:e=>{if(e.key==='Enter'&&quizSel===null&&quizWrite.trim())verificarEscritura();}}),
            quizSel===null&&h('button',{className:'btn-p',onClick:verificarEscritura,disabled:!quizWrite.trim()},'Comprobar')),

          // Feedback correcto
          quizSel!==null&&esCorrecta&&h('div',{className:'quiz-feedback ok'},'✓ ¡Correcto!'),

          // Feedback fallo — 3 opciones
          esFallo&&!quizShowHint&&h('div',{className:'quiz-fail-opts'},
            h('div',{className:'quiz-feedback ko',style:{marginBottom:4}},'✗ Incorrecto'),
            h('button',{className:'quiz-fail-btn retry',onClick:()=>{setQuizSel(null);setQuizWrite('');}},
              '🔄 Volver a intentarlo'),
            h('button',{className:'quiz-fail-btn hint',onClick:()=>setQuizShowHint(true)},
              '💡 Ver una pista'),
            h('button',{className:'quiz-fail-btn',onClick:avanzar},
              '👁 Ver solución y continuar')),

          // Pista
          esFallo&&quizShowHint&&h('div',{style:{display:'flex',flexDirection:'column',gap:8}},
            h('div',{className:'quiz-feedback ko'},'✗ Incorrecto'),
            h('div',{className:'quiz-hint-box'},`💡 Pista: ${pista}`),
            h('button',{className:'quiz-fail-btn retry',style:{marginTop:4},onClick:()=>{setQuizSel(null);setQuizWrite('');setQuizShowHint(false);}},
              '🔄 Volver a intentarlo'),
            h('button',{className:'quiz-fail-btn',onClick:avanzar},
              '👁 Ver solución y continuar'))),

        // Botón siguiente (solo si correcto)
        h('div',{className:'quiz-next'},
          quizSel!==null&&esCorrecta&&h('button',{className:'quiz-btn',onClick:avanzar},
            quizIdx>=quizQs.length-1?'Ver resultado →':'Siguiente →'))));
  }

  // ── LIBRO COMPLETADO ─────────────────────────────────────────────────────
  if(screen==='libro-completado'){
    const palsDom=Object.values(stats.palabras||{}).filter(p=>calcEstrella(p)>=2).length;
    const totPals=Object.values(stats.palabras||{}).length;
    return h('div',{className:'libro-completado'},
      h(SidebarDesktop,{act:'biblioteca'}),
      h('div',{className:'lc-content'},
        h('div',{className:'lc-confetti'},'🎉'),
        h('h1',{className:'lc-titulo'},'¡Libro completado!'),
        h('p',{className:'lc-sub'},`Has terminado "${libro?.tit}". Cada capítulo ha tejido nuevas palabras en tu vocabulario.`),
        h('div',{className:'lc-stats'},
          h('div',{className:'lc-stat'},h('div',{className:'lc-stat-n'},libro?.totalCaps||0),h('div',{className:'lc-stat-l'},'Capítulos leídos')),
          h('div',{className:'lc-stat'},h('div',{className:'lc-stat-n'},totPals),h('div',{className:'lc-stat-l'},'Palabras aprendidas')),
          h('div',{className:'lc-stat'},h('div',{className:'lc-stat-n'},`+${(libro?.totalCaps||0)*100}`),h('div',{className:'lc-stat-l'},'XP ganados'))),
        h('div',{className:'lc-btns'},
          h('button',{className:'btn-p',onClick:()=>setScreen('practica')},'⚡ Practicar vocabulario'),
          h('button',{className:'btn-g',onClick:()=>setScreen('biblioteca')},'← Volver a biblioteca'))));
  }

  // ── CARGANDO ─────────────────────────────────────────────────────────────
  if(cargando)return h('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',gap:16,color:'var(--soft)',fontFamily:'Inter,sans-serif'}},
    h('div',{style:{width:40,height:40,border:'3px solid var(--border)',borderTopColor:'var(--indigo)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}),
    h('span',null,'Cargando libro...')
  );

  // ── LECTOR ────────────────────────────────────────────────────────────────
  if(!libro){setScreen('biblioteca');return null;}
  const capObj=libro?.caps[cap];
  const maxPct=isPrem?90:60;
  const immPctBar=Math.round((immPct/maxPct)*100);
  const lectorClasses=`lec-wrap font-${fontSize}${dyslexic?' dyslexia':''}`;
  return h('div',{style:{display:'contents'}},
    h(SidebarDesktop,{act:'biblioteca'}),
    h('div',{className:lectorClasses,ref:lRef},
    h('header',{className:'lec-hdr'},
      h('button',{className:'btn-v',onClick:()=>setScreen('biblioteca')},'← Volver'),
      h('span',{className:'lec-th'},libro?.tit),
      h('div',{className:'lec-badge'},h(Flag,{id:user.idioma,size:18}),h('span',null,`${immPct}%`))),
    h('div',{className:'prog-wrap'},h('div',{className:'prog-fill',style:{width:`${prog}%`}})),
    h('div',{className:'acc-bar'},
      h('span',{style:{fontSize:11,color:'var(--soft)',fontWeight:600,marginRight:4}},'Texto:'),
      h('button',{className:`acc-btn ${fontSize==='md'?'on':''}`,onClick:()=>setFontSize('md')},'A'),
      h('button',{className:`acc-btn ${fontSize==='lg'?'on':''}`,onClick:()=>setFontSize('lg')},'A+'),
      h('button',{className:`acc-btn ${fontSize==='xl'?'on':''}`,onClick:()=>setFontSize('xl')},'A++'),
      h('div',{className:'acc-sep'}),
      h('button',{className:`acc-btn ${dyslexic?'on':''}`,onClick:()=>setDyslexic(v=>!v)},'Dyslexia')),
    h('div',{className:'imm-strip'},
      h('span',{className:'imm-strip-l'},`Cap. ${cap+1}/${libro?.totalCaps}`),
      h('div',{className:'imm-strip-bar'},h('div',{className:'imm-strip-fill',style:{width:`${immPctBar}%`}})),
      h('span',{className:'imm-strip-v'},`${immPct}% objetivo`)),
    h('main',{className:'lec-main'},
      h('h2',{className:'cap-t'},capObj?.tit),
      h('p',{className:'cap-lb'},`${libro?.aut} · ${libro?.cat} · Capítulo ${cap+1} de ${libro?.totalCaps}`),
      h('div',{className:'sep'}),
      h('div',{className:'txt'},renderFrases(capObj?.frases,immPct,user.idioma)),
      h('div',{className:'cap-nav'},
        cap>0&&h('button',{className:'btn-g',onClick:()=>{setCap(v=>v-1);lRef.current?.scrollTo(0,0);}},'← Capítulo anterior'),
        cap<(libro?.totalCaps??1)-1
          ?h('button',{className:'btn-p',onClick:()=>{
              capCompletado();
              registrarPalabrasVistas(capObj?.frases,user.idioma);
              setCap(v=>v+1);lRef.current?.scrollTo(0,0);
            }},'Siguiente capítulo →')
          :h('button',{className:'btn-p',style:{background:'linear-gradient(135deg,#6366F1,#8B5CF6)',boxShadow:'0 4px 20px rgba(99,102,241,.4)'},onClick:()=>{
              capCompletado();
              registrarPalabrasVistas(capObj?.frases,user.idioma);
              setStats(prev=>({...prev,librosCompletados:[...new Set([...(prev.librosCompletados||[]),libro.id])]}));
              setScreen('libro-completado');
            }},'🎉 ¡Libro completado!')),
      h('div',{className:'leyenda'},
        h('strong',{style:{color:'var(--indigo)',borderBottom:'1.5px dashed var(--il)'}},'Palabras en índigo'),
        ' = en ',IDIOMAS.find(i=>i.id===user.idioma)?.n||'el idioma objetivo','. Pasa el ratón (o toca) para ver el original en español.')),
    achToast&&h('div',{className:'ach-toast'},
      h('div',{className:'ach-toast-ico'},achToast.ico),
      h('div',null,
        h('div',{className:'ach-toast-t'},'¡Logro desbloqueado!'),
        h('div',{className:'ach-toast-s'},achToast.name)))
  ));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
