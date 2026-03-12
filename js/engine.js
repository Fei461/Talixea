// ── MEZCLA ────────────────────────────────────────────────────────────────────
// Niveles de prioridad — determinan el orden de introducción entre capítulos
// prio:3 = cap1 (artículos, pronombres), prio:2 = cap2 (preposiciones, conectores),
// prio:1 = cap3+ (sustantivos, verbos concretos), sin prio = vocabulario avanzado

function calcPct(capIdx,totalCaps,isPrem){
  const min=20,maxFree=60,maxPrem=90;
  const max=isPrem?maxPrem:maxFree;
  if(totalCaps<=1)return min;
  return Math.round(min+(max-min)*(capIdx/(totalCaps-1)));
}

// Tokeniza texto buscando entradas del EXPR (más largas primero) + palabras + separadores
function tokenizarConExpr(txt, idioma){
  const tokens=[];let i=0;
  while(i<txt.length){
    let matched=false;
    for(const e of EXPR){
      if(!e[idioma]) continue;
      const chunk=txt.substring(i);
      if(chunk.toLowerCase().startsWith(e.es)){
        const after=txt[i+e.es.length];
        if(!after||!/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/i.test(after)){
          tokens.push({tipo:'e',orig:txt.substring(i,i+e.es.length),trad:e[idioma],key:e.es,prio:e.prio||0});
          i+=e.es.length; matched=true; break;
        }
      }
    }
    if(matched) continue;
    const wm=txt.substring(i).match(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]+/);
    if(wm){tokens.push({tipo:'w',txt:wm[0]});i+=wm[0].length;}
    else{tokens.push({tipo:'l',txt:txt[i]});i++;}
  }
  return tokens;
}

// Mezcla la frase: sustituye % de las palabras totales por su traducción del EXPR
// DETERMINISTA: la elección depende solo de fraseES+pct, nunca de render
function mezclarFrase(fraseES, idioma, pct){
  const tokens=tokenizarConExpr(fraseES, idioma);
  if(pct<=0) return tokens.map(t=>({tipo:'plain',txt:t.txt||t.orig}));

  // Total de palabras (incluye las no traducibles)
  const totalPals=tokens.filter(t=>t.tipo==='w'||t.tipo==='e').length;
  const nObj=Math.round(totalPals*(pct/100));

  // Solo podemos traducir las que están en el diccionario
  const traduciblesIdx=tokens.map((t,i)=>t.tipo==='e'?i:-1).filter(i=>i>=0);
  if(!traduciblesIdx.length) return tokens.map(t=>({tipo:'plain',txt:t.txt||t.orig}));

  // Seed determinista basado en el contenido de la frase (estable entre renders)
  let seed=0; for(let c=0;c<fraseES.length;c++) seed=(seed*31+fraseES.charCodeAt(c))>>>0;
  function seededRand(s){ s=(s^61)^(s>>>16); s+=s<<3; s^=s>>>4; s*=0x27d4eb2d; s^=s>>>15; return (s>>>0)/0xffffffff; }

  // Ordenar los traducibles por posición en el texto (determinista, estable)
  // Elegir uniformemente: tomar cada (n/nObj)-ésimo candidato
  const nElegir=Math.min(nObj, traduciblesIdx.length);
  const elegidas=new Set();
  if(nElegir>=traduciblesIdx.length){
    traduciblesIdx.forEach(i=>elegidas.add(i));
  } else {
    // Distribución uniforme por posición — puramente determinista
    const step=traduciblesIdx.length/nElegir;
    for(let k=0;k<nElegir;k++){
      const idx=Math.min(traduciblesIdx.length-1, Math.floor(k*step+step/2));
      elegidas.add(traduciblesIdx[idx]);
    }
  }

  return tokens.map((t,idx)=>{
    if(t.tipo==='l') return {tipo:'plain',txt:t.txt};
    if(t.tipo==='w') return {tipo:'plain',txt:t.txt};
    if(elegidas.has(idx)) return {tipo:'idioma',es:t.orig,trad:t.trad};
    return {tipo:'plain',txt:t.orig};
  });
}

// % real = palabras traducidas / TOTAL palabras del capítulo (no solo las del diccionario)
function calcImmReal(frases, pct, idioma){
  if(!frases||!frases.length) return 0;
  let totalPals=0, tradPals=0;
  for(const f of frases){
    const toks=tokenizarConExpr(f.es, idioma);
    const todas=toks.filter(t=>t.tipo==='w'||t.tipo==='e').length;
    const traducibles=toks.filter(t=>t.tipo==='e').length;
    totalPals+=todas;
    // Cuántas se traducen realmente: min(objetivo sobre total, las disponibles)
    tradPals+=Math.min(traducibles, Math.round(todas*(pct/100)));
  }
  return totalPals ? Math.round((tradPals/totalPals)*100) : 0;
}



// Componente palabra en idioma objetivo con tooltip ES
function PalabraIdioma({es,trad}){
  const [hov,setHov]=useState(false);
  return h('span',{
    className:'pal-n',
    onMouseEnter:()=>setHov(true),
    onMouseLeave:()=>setHov(false),
    onTouchStart:e=>{e.preventDefault();setHov(v=>!v);}
  },
    trad,
    hov&&h('span',{className:'tt'},
      h('span',{className:'to'},es),
      h('span',{className:'ta'},'→'),
      h('span',{className:'tn'},trad)
    )
  );
}

// Renderiza el capítulo mezclando palabras del diccionario EXPR en cada frase
function renderFrases(frases,pct,idioma){
  if(!frases)return null;
  return frases.map((f,i)=>{
    const tokens=mezclarFrase(f.es, idioma, pct);
    // Detectar si el primer token visible es de tipo idioma → capitalizar
    let primeraPalVista=false;
    return h('p',{key:i,className:'par'},
      tokens.map((t,ti)=>{
        if(t.tipo==='plain'){
          if(!primeraPalVista&&t.txt&&t.txt.trim())primeraPalVista=true;
          return h('span',{key:ti},t.txt);
        }
        if(t.tipo==='idioma'){
          const esPrimera=!primeraPalVista;
          primeraPalVista=true;
          const trad=esPrimera?t.trad.charAt(0).toUpperCase()+t.trad.slice(1):t.trad;
          return h(PalabraIdioma,{key:ti,es:t.es,trad});
        }
        return null;
      })
    );
  });
}
