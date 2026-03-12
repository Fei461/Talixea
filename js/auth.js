// ── AUTH HOOK ─────────────────────────────────────────────────────────────────
function useAuth(){
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('tx_u')||'null');}catch{return null;}});
  function reg(name,email,pw,idiomas){
    const us=JSON.parse(localStorage.getItem('tx_us')||'{}');
    if(us[email])return{error:'Este email ya está registrado.'};
    // idiomas = array, idioma activo = primero
    const idiomasArr=Array.isArray(idiomas)?idiomas:[idiomas];
    const u={name,email,racha:0,idiomas:idiomasArr,idioma:idiomasArr[0],progreso:{}};
    us[email]={...u,pw};
    localStorage.setItem('tx_us',JSON.stringify(us));
    localStorage.setItem('tx_u',JSON.stringify(u));
    setUser(u);return{ok:true};
  }
  function login(email,pw){
    const us=JSON.parse(localStorage.getItem('tx_us')||'{}');
    const u=us[email];
    if(!u||u.pw!==pw)return{error:'Email o contraseña incorrectos.'};
    // Migrar usuarios antiguos que solo tienen idioma string
    const idiomasArr=u.idiomas||[u.idioma||'en'];
    const nu={name:u.name,email,racha:u.racha||0,idiomas:idiomasArr,idioma:u.idioma||idiomasArr[0],progreso:u.progreso||{}};
    localStorage.setItem('tx_u',JSON.stringify(nu));setUser(nu);return{ok:true};
  }
  function logout(){localStorage.removeItem('tx_u');setUser(null);}
  function upd(c){
    const nu={...user,...c};
    localStorage.setItem('tx_u',JSON.stringify(nu));
    // Sync to users store too
    const us=JSON.parse(localStorage.getItem('tx_us')||'{}');
    if(us[nu.email])us[nu.email]={...us[nu.email],...c};
    localStorage.setItem('tx_us',JSON.stringify(us));
    setUser(nu);
  }
  function addIdioma(id){
    if((user.idiomas||[]).includes(id))return;
    const idiomasArr=[...(user.idiomas||[user.idioma]),id];
    upd({idiomas:idiomasArr});
  }
  function removeIdioma(id){
    let idiomasArr=(user.idiomas||[user.idioma]).filter(i=>i!==id);
    if(!idiomasArr.length)return; // siempre al menos uno
    const nuIdioma=user.idioma===id?idiomasArr[0]:user.idioma;
    upd({idiomas:idiomasArr,idioma:nuIdioma});
  }
  function switchIdioma(id){upd({idioma:id});}
  return{user,reg,login,logout,upd,addIdioma,removeIdioma,switchIdioma};

}
