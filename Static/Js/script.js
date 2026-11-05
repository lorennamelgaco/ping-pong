// Navegação por âncoras (layout desktop).
const filters=document.querySelectorAll('.filter');const cards=document.querySelectorAll('.collect-card');filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(item=>item.classList.remove('active'));button.classList.add('active');const selected=button.dataset.filter;cards.forEach(card=>{card.hidden=selected!=='todos'&&card.dataset.category!==selected;});}));
// Menu mobile (botão ☰): abre e fecha a navegação.
const menuToggle=document.querySelector('.menu-toggle'),mainNav=document.querySelector('.main-nav');if(menuToggle&&mainNav){menuToggle.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open))});mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}))}
const toast=document.querySelector('.toast');let toastTimer;document.querySelectorAll('.collect-card').forEach(card=>{card.setAttribute('tabindex','0');card.setAttribute('role','button');const show=()=>{toast.textContent='Em breve: '+card.querySelector('h3').textContent+' — coleção demonstrativa.';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)};card.addEventListener('click',show);card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();show()}});});
// Álbum: progresso de figurinhas salvo no navegador.
const stickerButtons=[...document.querySelectorAll('.sticker-slot button')];const savedStickers=JSON.parse(localStorage.getItem('pp-stickers')||'[]');stickerButtons.forEach((button,index)=>{if(savedStickers.includes(index)){button.classList.add('collected');button.setAttribute('aria-pressed','true')}button.addEventListener('click',()=>{button.classList.toggle('collected');button.setAttribute('aria-pressed',String(button.classList.contains('collected')));updateStickerCount()})});let previousStickerCount=stickerButtons.filter(b=>b.classList.contains('collected')).length;
function showAlbumCelebration(){const modal=document.querySelector('#album-celebration');if(!modal)return;modal.hidden=false;document.body.classList.add('celebration-open');document.querySelector('#close-celebration')?.focus()}
function closeAlbumCelebration(){const modal=document.querySelector('#album-celebration');if(modal)modal.hidden=true;document.body.classList.remove('celebration-open')}
document.querySelector('#close-celebration')?.addEventListener('click',closeAlbumCelebration);
document.querySelector('#album-celebration')?.addEventListener('click',event=>{if(event.target.id==='album-celebration')closeAlbumCelebration()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeAlbumCelebration()});
function updateStickerCount(){const count=stickerButtons.filter(b=>b.classList.contains('collected')).length;document.querySelector('#sticker-count').textContent=count;document.querySelector('#sticker-percent').textContent=Math.round(count/stickerButtons.length*100)+'%';document.querySelector('#sticker-progress').style.width=count/stickerButtons.length*100+'%';localStorage.setItem('pp-stickers',JSON.stringify(stickerButtons.map((b,i)=>b.classList.contains('collected')?i:null).filter(v=>v!==null)));if(count===stickerButtons.length&&previousStickerCount<stickerButtons.length&&localStorage.getItem('pp-album-celebrated')!=='true'){localStorage.setItem('pp-album-celebrated','true');showAlbumCelebration()}previousStickerCount=count}
updateStickerCount();
// Brindes: checklist persistente.
const giftChecks=[...document.querySelectorAll('[data-gift]')];const savedGifts=JSON.parse(localStorage.getItem('pp-gifts')||'[]');giftChecks.forEach(input=>{input.checked=savedGifts.includes(input.dataset.gift);input.addEventListener('change',()=>{const checked=giftChecks.filter(item=>item.checked).map(item=>item.dataset.gift);localStorage.setItem('pp-gifts',JSON.stringify(checked));document.querySelector('#gift-count').textContent=checked.length})});document.querySelector('#gift-count').textContent=giftChecks.filter(i=>i.checked).length;
// Criador de avatar v2: bola de chiclete em SVG.
(()=>{
const INK='#080808';
const COLORS=['#DF1164','#65A9D8','#EFD24C','#9B78D0','#4FD1A5','#FF8A3D','#F7F4EF','#2B2B2B'];
const BGS=['#B9DDF2','#EFD24C','#F5BBD2','#F7F4EF'];
const OPTS={
  face:['EXPRESSÃO',[['smile','SORRISO'],['wink','PISCADINHA'],['wow','SURPRESO'],['love','APAIXONADO'],['bubble','BOLHA']]],
  head:['CABEÇA',[['none','NENHUM'],['crown','COROA'],['cap','BONÉ'],['bow','LAÇO'],['phones','FONE']]],
  glasses:['ÓCULOS',[['none','NENHUM'],['round','REDONDO'],['shades','ESCURO'],['heart','CORAÇÃO']]],
  extra:['EXTRA',[['none','NENHUM'],['sparks','BRILHOS'],['bolt','RAIO']]]
};
const $=s=>document.querySelector(s);
const art=$('#avatar-art'),controls=$('#avatar-controls'),stage=$('#avatar-stage'),nameInput=$('#avatar-name'),
  nameLabel=$('#avatar-display-name'),rarityEl=$('#avatar-rarity'),feedback=$('.avatar-feedback');
if(!art||!controls)return;

let state={face:'smile',head:'none',glasses:'none',extra:'none',color:COLORS[0],bg:BGS[0],name:''};
try{state={...state,...JSON.parse(localStorage.getItem('pp-avatar-v2')||'{}')}}catch(e){}

// ---------- desenho ----------
const mix=(h,t,p)=>{const a=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),b=[1,3,5].map(i=>parseInt(t.slice(i,i+2),16));
  return '#'+a.map((v,i)=>Math.round(v+(b[i]-v)*p).toString(16).padStart(2,'0')).join('')};
const heart=(x,y,k,fill)=>`<path transform="translate(${x} ${y}) scale(${k})" d="M0 8C-14-2-6-12 0-4C6-12 14-2 0 8Z" fill="${fill}" stroke="${INK}" stroke-width="${2.6/k}" stroke-linejoin="round"/>`;
const spark=(x,y,r)=>`<path d="M${x} ${y-r}Q${x} ${y} ${x+r} ${y}Q${x} ${y} ${x} ${y+r}Q${x} ${y} ${x-r} ${y}Q${x} ${y} ${x} ${y-r}Z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
const eye=(x,y,r=5)=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r+2}" fill="${INK}"/>`;
const happy=(x,y)=>`<path d="M${x-8} ${y}Q${x} ${y-10} ${x+8} ${y}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
const smile=`<path d="M84 128Q100 144 116 128" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;

function face(s){
  switch(s.face){
    case 'wink':return eye(80,106)+happy(120,108)+smile;
    case 'wow':return eye(80,106,6)+eye(120,106,6)+`<ellipse cx="100" cy="132" rx="8" ry="10" fill="${INK}"/>`;
    case 'love':return heart(80,106,1.1,'#fff')+heart(120,106,1.1,'#fff')+smile;
    case 'bubble':return happy(80,108)+happy(120,108)+`<circle cx="104" cy="130" r="5" fill="${INK}"/>`;
    default:return eye(80,106)+eye(120,106)+smile;
  }
}
function glasses(s,acc){
  if(s.glasses==='round')return `<g fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="4"><circle cx="80" cy="108" r="16"/><circle cx="120" cy="108" r="16"/></g><path d="M96 108H104" stroke="${INK}" stroke-width="4"/>`;
  if(s.glasses==='shades')return `<g fill="${INK}"><rect x="62" y="96" width="34" height="24" rx="11"/><rect x="104" y="96" width="34" height="24" rx="11"/><rect x="94" y="102" width="12" height="5"/></g><path d="M69 103H77" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`;
  if(s.glasses==='heart')return heart(78,106,1.7,acc)+heart(122,106,1.7,acc);
  return '';
}
function head(s,acc){
  const st=`fill="${acc}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
  if(s.head==='crown')return `<path d="M72 54L74 26L89 41L100 22L111 41L126 26L128 54Z" ${st}/>`;
  if(s.head==='cap')return `<path d="M132 62H164Q170 72 158 74H132Z" ${st}/><path d="M64 66C64 22 136 22 136 66Z" ${st}/><circle cx="100" cy="29" r="5" fill="#fff" stroke="${INK}" stroke-width="3"/>`;
  if(s.head==='bow')return `<g transform="rotate(25 138 58)" ${st}><path d="M138 58L114 44V72Z"/><path d="M138 58L162 44V72Z"/><circle cx="138" cy="58" r="8"/></g>`;
  if(s.head==='phones')return `<path d="M33 104C33 14 167 14 167 104" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M33 104C33 14 167 14 167 104" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round"/><rect x="22" y="88" width="20" height="40" rx="9" ${st}/><rect x="158" y="88" width="20" height="40" rx="9" ${st}/>`;
  return '';
}
function extra(s,acc){
  if(s.extra==='bolt')return `<path d="M106 50L90 80H102L94 102L116 70H104Z" fill="${acc}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  return '';
}
function svg(s,size){
  const c=s.color,light=mix(c,'#ffffff',.55),dark=mix(c,'#000000',.3),acc=c.toUpperCase()==='#EFD24C'?'#DF1164':'#EFD24C';
  const sparks=s.extra==='sparks'?spark(28,56,14)+spark(176,50,16)+spark(180,150,11)+spark(22,150,10):'';
  const bubble=s.face==='bubble'?`<circle cx="128" cy="146" r="24" fill="#fff" fill-opacity=".35" stroke="${INK}" stroke-width="3"/><ellipse cx="119" cy="137" rx="6" ry="3.5" fill="#fff" opacity=".85" transform="rotate(-35 119 137)"/>`:'';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"${size?` width="${size}" height="${size}"`:''}>
<defs><radialGradient id="ppg" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs>
${sparks}<ellipse cx="100" cy="186" rx="46" ry="6" fill="#000" opacity=".18"/>
<circle cx="100" cy="110" r="68" fill="url(#ppg)" stroke="${INK}" stroke-width="4"/>
<ellipse cx="72" cy="70" rx="20" ry="11" fill="#fff" opacity=".75" transform="rotate(-35 72 70)"/><circle cx="56" cy="94" r="4" fill="#fff" opacity=".7"/>
<circle cx="64" cy="128" r="8" fill="${INK}" opacity=".1"/><circle cx="136" cy="128" r="8" fill="${INK}" opacity=".1"/>
${face(s)}${glasses(s,acc)}${extra(s,acc)}${head(s,acc)}${bubble}</svg>`;
}

// ---------- raridade e número do card ----------
const rarity=s=>{const n=['head','glasses','extra'].filter(k=>s[k]!=='none').length+(['love','bubble'].includes(s.face)?1:0);return n>=3?'LENDÁRIO':n===2?'RARO':'COMUM'};
const serial=s=>{let h=0;for(const ch of JSON.stringify([s.face,s.head,s.glasses,s.extra,s.color,s.bg]))h=(h*31+ch.charCodeAt(0))%97;return 'PP '+String(h+1).padStart(3,'0')};

// ---------- controles ----------
function sync(){
  art.innerHTML=svg(state);
  stage.style.background=state.bg;
  nameLabel.textContent=(state.name.trim()||'SEU AVATAR').toUpperCase();
  rarityEl.textContent=serial(state)+' · '+rarity(state);
  controls.querySelectorAll('[data-key]').forEach(b=>{const on=state[b.dataset.key]===b.dataset.val;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});
}
function build(){
  Object.entries(OPTS).forEach(([key,[label,items]])=>{
    const g=document.createElement('div'),row=document.createElement('div');
    g.innerHTML=`<b>${label}</b>`;row.className='choice-row';
    items.forEach(([val,txt])=>{const b=document.createElement('button');b.type='button';b.className='choice';b.dataset.key=key;b.dataset.val=val;b.textContent=txt;b.onclick=()=>{state[key]=val;sync()};row.appendChild(b)});
    g.appendChild(row);controls.appendChild(g);
  });
  [['color','COR DA BOLA',COLORS],['bg','FUNDO',BGS]].forEach(([key,label,list])=>{
    const g=document.createElement('div'),row=document.createElement('div');
    g.innerHTML=`<b>${label}</b>`;row.className='choice-row color-choices';
    list.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='color-choice';b.dataset.key=key;b.dataset.val=v;b.style.setProperty('--swatch',v);b.setAttribute('aria-label',v);b.onclick=()=>{state[key]=v;sync()};row.appendChild(b)});
    g.appendChild(row);controls.appendChild(g);
  });
  const actions=document.createElement('div');actions.className='avatar-actions';
  actions.innerHTML='<button type="button" class="button button-ghost" id="avatar-random">SORTEAR ↻</button><button type="button" class="button button-yellow" id="avatar-save">SALVAR ↗</button><button type="button" class="button button-yellow" id="avatar-download">BAIXAR PNG ↓</button><button type="button" class="button button-ghost" id="avatar-share">COMPARTILHAR ↗</button>';
  controls.appendChild(actions);
  $('#avatar-random').onclick=()=>{const pick=a=>a[Math.floor(Math.random()*a.length)];
    Object.entries(OPTS).forEach(([k,[,items]])=>state[k]=pick(items)[0]);state.color=pick(COLORS);state.bg=pick(BGS);sync();feedback.textContent='SORTEADO! NÃO GOSTOU? SORTEIE DE NOVO.'};
  $('#avatar-save').onclick=()=>{localStorage.setItem('pp-avatar-v2',JSON.stringify(state));feedback.textContent='AVATAR SALVO NESTE NAVEGADOR. SUA IDENTIDADE ESTÁ CRIADA!'};
  $('#avatar-download').onclick=download;$('#avatar-share').onclick=shareAvatar;
}
function createAvatarPng(){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(new Blob([svg(state,720)],{type:'image/svg+xml'})),img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas');c.width=c.height=800;const x=c.getContext('2d');
      x.fillStyle=state.bg;x.fillRect(0,0,800,800);x.drawImage(img,40,10,720,720);
      x.fillStyle=INK;x.textAlign='center';x.font='34px "Archivo Black","Arial Black",sans-serif';
      x.fillText((state.name.trim()||'PING PONG').toUpperCase(),400,765);
      x.font='16px "DM Sans",Arial,sans-serif';x.fillText(serial(state)+' · '+rarity(state),400,788);
      c.toBlob(blob=>{URL.revokeObjectURL(url);if(blob)resolve(blob);else reject(new Error('Não foi possível gerar o PNG.'))},'image/png');
    };
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Não foi possível montar a imagem.'))};
    img.src=url;
  });
}
async function download(){
  try{
    const blob=await createAvatarPng(),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.download='meu-avatar-ping-pong.png';a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    feedback.textContent='PNG BAIXADO!';
  }catch(error){feedback.textContent='NÃO FOI POSSÍVEL GERAR A IMAGEM. TENTE NOVAMENTE.'}
}
async function shareAvatar(){
  try{
    const blob=await createAvatarPng();
    const file=new File([blob],'meu-avatar-ping-pong.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){
      await navigator.share({files:[file],title:'Meu avatar Ping Pong Collection',text:'Olha o avatar que criei na Ping Pong Collection!'});
      feedback.textContent='AVATAR PRONTO PARA COMPARTILHAR!';
      return;
    }
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.download='meu-avatar-ping-pong.png';a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    const shareText='Criei meu avatar na Ping Pong Collection! '+location.href+'#avatar';
    if(navigator.share)await navigator.share({title:'Meu avatar Ping Pong Collection',text:shareText});
    else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareText);feedback.textContent='PNG BAIXADO E LINK COPIADO! ANEXE A IMAGEM PARA COMPARTILHAR.';return}
    feedback.textContent='PNG BAIXADO! ANEXE A IMAGEM ONDE QUISER COMPARTILHAR.';
  }catch(error){if(error.name!=='AbortError')feedback.textContent='NÃO FOI POSSÍVEL COMPARTILHAR. TENTE BAIXAR O PNG.'}
}
nameInput.value=state.name||'';
nameInput.addEventListener('input',e=>{state.name=e.target.value;sync()});
build();sync();
})();
// Quiz musical com 36 perguntas (duas por artista) + quiz da marca.
const quizData={
  music:{label:'QUIZ MUSICAL',questions:[
    {artist:'JOÃO GOMES',q:'Qual estilo musical está fortemente associado a João Gomes?',a:['Rock','Piseiro e forró','Música clássica','Reggae'],correct:1,why:'João Gomes ganhou destaque com o piseiro e o forró.'},
    {artist:'JOÃO GOMES',q:'Qual música ajudou a projetar João Gomes nacionalmente?',a:['Meu Pedaço de Pecado','Evidências','Anna Júlia','Garota de Ipanema'],correct:0,why:'“Meu Pedaço de Pecado” foi um dos grandes hits que impulsionaram sua carreira.'},
    {artist:'LOLA YOUNG',q:'Qual é a nacionalidade de Lola Young?',a:['Brasileira','Americana','Britânica','Canadense'],correct:2,why:'Lola Young é uma cantora britânica, nascida em Londres.'},
    {artist:'LOLA YOUNG',q:'Qual música de Lola Young ganhou grande destaque internacional?',a:['Messy','Flowers','Levitating','Havana'],correct:0,why:'“Messy” se tornou um sucesso internacional.'},
    {artist:'DUQUESA',q:'Duquesa é conhecida principalmente por qual estilo musical?',a:['Hip-hop e rap','Sertanejo','Samba','Música clássica'],correct:0,why:'A artista se destaca no rap e no hip-hop nacional.'},
    {artist:'DUQUESA',q:'De qual cidade brasileira é a artista Duquesa?',a:['São Paulo','Feira de Santana','Rio de Janeiro','Curitiba'],correct:1,why:'Duquesa é natural de Feira de Santana, na Bahia.'},
    {artist:'LUÍSA SONZA',q:'Qual é o principal gênero musical associado à carreira de Luísa Sonza?',a:['Pop','Jazz','Reggae','Country'],correct:0,why:'Luísa Sonza é uma das artistas de destaque do pop brasileiro.'},
    {artist:'LUÍSA SONZA',q:'Qual é o nome de um dos álbuns de Luísa Sonza?',a:['Escândalo Íntimo','Renaissance','Future Nostalgia','1989'],correct:0,why:'“Escândalo Íntimo” é um álbum de Luísa Sonza.'},
    {artist:'ZARA LARSSON',q:'Zara Larsson é uma cantora de qual país?',a:['França','Suécia','Itália','Espanha'],correct:1,why:'Zara Larsson nasceu na Suécia.'},
    {artist:'ZARA LARSSON',q:'Qual música é um dos grandes sucessos de Zara Larsson?',a:['Lush Life','Bad Romance','Halo','Toxic'],correct:0,why:'“Lush Life” é um dos hits mais conhecidos da cantora.'},
    {artist:'HALSEY',q:'Halsey é conhecida principalmente por qual estilo musical?',a:['Pop e música alternativa','Forró','Samba','Música sertaneja'],correct:0,why:'A sonoridade de Halsey mistura pop com influências alternativas.'},
    {artist:'HALSEY',q:'Qual destas músicas é de Halsey?',a:['Without Me','Shape of You','Rolling in the Deep','Roar'],correct:0,why:'“Without Me” é um dos grandes sucessos de Halsey.'},
    {artist:'DEMI LOVATO',q:'Em qual filme musical da Disney Demi Lovato ganhou destaque no início da carreira?',a:['Camp Rock','Frozen','Encanto','High School Musical 3'],correct:0,why:'Demi Lovato estrelou “Camp Rock”, do Disney Channel.'},
    {artist:'DEMI LOVATO',q:'Qual destas músicas pertence a Demi Lovato?',a:['Sorry Not Sorry','Shake It Off','Bad Guy','Waka Waka'],correct:0,why:'“Sorry Not Sorry” é um sucesso de Demi Lovato.'},
    {artist:'MGK',q:'MGK é conhecido por misturar principalmente quais estilos musicais?',a:['Rap e rock','Samba e pagode','Forró e sertanejo','Jazz e blues'],correct:0,why:'Machine Gun Kelly transitou do rap para uma sonoridade com forte influência do pop-punk e rock.'},
    {artist:'MGK',q:'Qual é o nome verdadeiro de MGK?',a:['Colson Baker','Michael George King','Mark Gabriel Kelly','Matthew Gordon King'],correct:0,why:'MGK é o nome artístico de Colson Baker.'},
    {artist:'J BALVIN',q:'J Balvin é um artista de qual país?',a:['México','Colômbia','Argentina','Brasil'],correct:1,why:'J Balvin é colombiano, nascido em Medellín.'},
    {artist:'J BALVIN',q:'Qual estilo musical está muito associado a J Balvin?',a:['Reggaeton','Rock clássico','Samba','Country'],correct:0,why:'J Balvin é um dos nomes internacionais do reggaeton.'},
    {artist:'CALVIN HARRIS',q:'Calvin Harris é conhecido mundialmente como:',a:['DJ e produtor musical','Ator de cinema','Guitarrista de rock','Cantor de ópera'],correct:0,why:'Calvin Harris é DJ, produtor e compositor.'},
    {artist:'CALVIN HARRIS',q:'Qual destas músicas é um sucesso de Calvin Harris?',a:['Summer','Perfect','Yellow','Hello'],correct:0,why:'“Summer” é um dos hits de Calvin Harris.'},
    {artist:'MAROON 5',q:'Qual é o nome do vocalista do Maroon 5?',a:['Adam Levine','Bruno Mars','Justin Timberlake','Harry Styles'],correct:0,why:'Adam Levine é o vocalista do Maroon 5.'},
    {artist:'MAROON 5',q:'Qual destas músicas pertence ao Maroon 5?',a:['Sugar','Viva La Vida','Numb','Believer'],correct:0,why:'“Sugar” é um dos sucessos do Maroon 5.'},
    {artist:'NE-YO',q:'Ne-Yo é conhecido principalmente por qual estilo musical?',a:['R&B e pop','Heavy metal','Forró','Música clássica'],correct:0,why:'Ne-Yo é conhecido por seus trabalhos de R&B e pop.'},
    {artist:'NE-YO',q:'Qual destas músicas é um sucesso de Ne-Yo?',a:['So Sick','Bad Romance','Despacito','Firework'],correct:0,why:'“So Sick” foi um dos primeiros grandes hits de Ne-Yo.'},
    {artist:'BLACK EYED PEAS',q:'Black Eyed Peas é conhecido por misturar quais estilos musicais?',a:['Hip-hop e pop','Sertanejo e pagode','Música clássica e ópera','Forró e samba'],correct:0,why:'O grupo mistura hip-hop, pop, dance e música eletrônica.'},
    {artist:'BLACK EYED PEAS',q:'Qual destas músicas é um dos maiores sucessos do grupo?',a:['I Gotta Feeling','Wonderwall','Imagine','Take On Me'],correct:0,why:'“I Gotta Feeling” se tornou um dos maiores hits do Black Eyed Peas.'},
    {artist:'NELLY',q:'Nelly é conhecido principalmente como:',a:['Rapper','Cantor de ópera','DJ de música eletrônica','Guitarrista clássico'],correct:0,why:'Nelly é um rapper norte-americano.'},
    {artist:'NELLY',q:'Qual destas músicas é de Nelly?',a:['Hot in Herre','Blinding Lights','Flowers','Viva La Vida'],correct:0,why:'“Hot in Herre” é um dos maiores sucessos de Nelly.'},
    {artist:'IVETE SANGALO',q:'Ivete Sangalo é uma cantora brasileira de qual estado?',a:['Bahia','Paraná','Goiás','Amazonas'],correct:0,why:'Ivete Sangalo nasceu em Juazeiro, na Bahia.'},
    {artist:'IVETE SANGALO',q:'Qual estilo musical está muito associado à carreira de Ivete Sangalo?',a:['Axé','Heavy metal','Country','Reggae'],correct:0,why:'O axé é um dos estilos mais associados à trajetória da cantora.'},
    {artist:'ELTON JOHN',q:'Elton John é conhecido por tocar principalmente qual instrumento?',a:['Piano','Bateria','Violino','Saxofone'],correct:0,why:'O piano é a marca registrada das apresentações de Elton John.'},
    {artist:'ELTON JOHN',q:'Qual destas músicas é um grande sucesso de Elton John?',a:['Rocket Man','Smells Like Teen Spirit','Thriller','Wonderwall'],correct:0,why:'“Rocket Man” é um clássico de Elton John.'},
    {artist:'GILBERTO GIL',q:'Gilberto Gil é um importante representante de qual movimento cultural e musical brasileiro?',a:['Tropicalismo','Jovem Guarda exclusivamente','Movimento punk','Grunge'],correct:0,why:'Gilberto Gil foi uma das figuras centrais do Tropicalismo.'},
    {artist:'GILBERTO GIL',q:'Qual destas músicas é de Gilberto Gil?',a:['Aquele Abraço','Garota de Ipanema','O Bêbado e a Equilibrista','Metamorfose Ambulante'],correct:0,why:'“Aquele Abraço” é uma canção de Gilberto Gil.'},
    {artist:'ROD STEWART',q:'Rod Stewart é conhecido mundialmente por qual estilo musical?',a:['Rock','Funk brasileiro','Forró','Reggae'],correct:0,why:'Rod Stewart é um dos grandes nomes do rock.'},
    {artist:'ROD STEWART',q:'Qual destas músicas é um sucesso de Rod Stewart?',a:['Maggie May','Billie Jean','Perfect','Someone Like You'],correct:0,why:'“Maggie May” é um dos clássicos de Rod Stewart.'}
  ]},
  brand:{label:'DESAFIO PING PONG',questions:[
    {q:'Em que ano, segundo a história apresentada no projeto, Ping Pong foi lançado?',a:['1945','1960','1985','2001'],correct:0,why:'O contexto histórico do projeto apresenta 1945 como ano de lançamento.'},
    {q:'O que acompanhava a experiência clássica da marca?',a:['Figurinhas e colecionáveis','Aplicativo de banco','Jogos online','Ingressos de cinema'],correct:0,why:'As figurinhas e colecionáveis faziam parte da experiência de descoberta e troca.'},
    {q:'Qual era uma das brincadeiras ligadas às coleções?',a:['Trocar figurinhas','Montar computadores','Fazer chamadas','Editar vídeos'],correct:0,why:'Trocar e completar coleções fazia parte da diversão.'},
    {q:'O que a nova Ping Pong Collection propõe?',a:['Levar a nostalgia ao universo digital','Apagar as coleções antigas','Vender apenas roupas','Substituir música por esportes'],correct:0,why:'A ideia é atualizar o legado com cards, avatares e experiências digitais.'}
  ]}
};
let quizType='music',quizIndex=0,quizScore=0,answered=false,finished=false;
const qEl=document.querySelector('#quiz-question'),optsEl=document.querySelector('#quiz-options'),feedbackEl=document.querySelector('#quiz-feedback'),nextEl=document.querySelector('#quiz-next');
function renderQuiz(){
  const data=quizData[quizType],q=data.questions[quizIndex];
  document.querySelector('#quiz-category').textContent=q.artist?data.label+' · '+q.artist:data.label;
  document.querySelector('#quiz-progress').textContent='PERGUNTA '+(quizIndex+1)+' / '+data.questions.length;
  qEl.textContent=q.q;optsEl.innerHTML='';feedbackEl.textContent='';
  nextEl.disabled=true;nextEl.textContent=quizIndex===data.questions.length-1?'VER RESULTADO ↗':'PRÓXIMA PERGUNTA →';
  answered=false;finished=false;
  q.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='quiz-option';b.textContent=String.fromCharCode(65+i)+'. '+answer;b.addEventListener('click',()=>answerQuiz(i));optsEl.appendChild(b)});
}
function answerQuiz(index){
  if(answered)return;answered=true;const q=quizData[quizType].questions[quizIndex];
  [...optsEl.children].forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add('correct');if(i===index&&i!==q.correct)b.classList.add('wrong')});
  if(index===q.correct){quizScore++;feedbackEl.textContent='ACERTOU! '+q.why}else feedbackEl.textContent='QUASE! '+q.why;
  nextEl.disabled=false;
}
nextEl.addEventListener('click',()=>{
  if(finished){quizIndex=0;quizScore=0;renderQuiz();return}
  if(!answered)return;
  if(quizIndex<quizData[quizType].questions.length-1){quizIndex++;renderQuiz()}
  else{
    const total=quizData[quizType].questions.length;
    qEl.textContent='VOCÊ FEZ '+quizScore+' DE '+total+' PONTOS!';
    optsEl.innerHTML='';
    feedbackEl.textContent=quizScore===total?'PERFEITO! VOCÊ DOMINA ESSA VIBE.':quizScore>=Math.ceil(total*.7)?'MANDOU MUITO BEM! VOCÊ CONHECE ESSA VIBE.':'BOA! CONTINUE EXPLORANDO O UNIVERSO PING PONG.';
    nextEl.textContent='JOGAR NOVAMENTE ↻';nextEl.disabled=false;finished=true;
  }
});
document.querySelectorAll('.quiz-tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.quiz-tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');quizType=tab.dataset.quiz;quizIndex=0;quizScore=0;renderQuiz();
}));
renderQuiz();
// Animações de entrada.
const revealTargets=document.querySelectorAll('.collect-card,.rarity-card,.feature-grid article,.story-content,.gift-item,.fact-card');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});revealTargets.forEach(item=>{item.classList.add('reveal');observer.observe(item)});}

/* =========================================================
   BEAT STATION — 18 music cards. Isolated module.
   ========================================================= */
(()=> {
  const PLAYLIST_URL='https://open.spotify.com/playlist/7lf8JbBcPKjFRzCZlkMv5m';
  const artists=[
    {n:1,name:'João Gomes',song:'Meu Pedaço de Pecado',genre:'Piseiro',quote:'O forró mora no peito',bio:'A voz do piseiro que levou o sertão pernambucano às paradas do Brasil.',motif:'✦ XOTE ✦ SERTÃO ✦ PISEIRO',c1:'#EFD24C',c2:'#DF1164',c3:'#55B96B'},
    {n:2,name:'Lola Young',song:'Messy',genre:'Alt Pop',quote:'Messy is honest',bio:'Cantora londrina de voz crua e composições sem filtro.',motif:'LONDON • RAW • ALT',c1:'#B9DDF2',c2:'#DF1164',c3:'#A6A6A6'},
    {n:3,name:'Duquesa',song:'99 Problemas',genre:'Hip-Hop',quote:'A rua é minha coroa',bio:'Rapper baiana que une rima afiada, moda e atitude.',motif:'BARS • STREET • CROWN',c1:'#EFD24C',c2:'#08080C',c3:'#DF1164'},
    {n:4,name:'Luísa Sonza',song:'Sagrado Profano',genre:'Pop',quote:'Ousadia é estilo',bio:'Estrela do pop brasileiro, sem medo de reinventar a própria imagem.',motif:'POP ★ FASHION ★ BOLD',c1:'#DF1164',c2:'#F5BBD2',c3:'#FFFFFF'},
    {n:5,name:'Zara Larsson',song:'Lush Life',genre:'Future Pop',quote:'Turn the lights up',bio:'Hitmaker sueca de pop vibrante e visual futurista.',motif:'STOCKHOLM // FUTURE // POP',c1:'#65A9D8',c2:'#F5BBD2',c3:'#B9DDF2'},
    {n:6,name:'Halsey',song:'Without Me',genre:'Alternative',quote:'Art is a mirror',bio:'Artista multifacetada entre o pop alternativo e o rock.',motif:'ART ◆ ALT ◆ SOUL',c1:'#55B96B',c2:'#08080C',c3:'#B9DDF2'},
    {n:7,name:'Demi Lovato',song:'Heart Attack',genre:'Pop Rock',quote:'Loud and unbroken',bio:'Voz potente que transita entre o pop e o rock com atitude.',motif:'ROCK ⚡ POP ⚡ VOICE',c1:'#DF1164',c2:'#08080C',c3:'#A6A6A6'},
    {n:8,name:'MGK',song:"my ex's best friend",genre:'Pop Punk',quote:'Plug in. Break out.',bio:'Do rap ao pop punk, sempre de guitarra rosa em punho.',motif:'PUNK ✕ ROCK ✕ STREET',c1:'#F5BBD2',c2:'#08080C',c3:'#DF1164'},
    {n:9,name:'J Balvin',song:'LA CANCIÓN',genre:'Reggaeton',quote:'Color es mi idioma',bio:'Embaixador colombiano do reggaeton e da cultura latina global.',motif:'MEDELLÍN ☼ REGGAETON ☼ COLOR',c1:'#55B96B',c2:'#EFD24C',c3:'#DF1164'},
    {n:10,name:'Calvin Harris',song:'One Kiss',genre:'Electronic',quote:'Feel the drop',bio:'DJ e produtor escocês que domina as pistas do mundo.',motif:'BPM 128 ▲ NEON ▲ DROP',c1:'#65A9D8',c2:'#DF1164',c3:'#B9DDF2'},
    {n:11,name:'Maroon 5',song:'Memories',genre:'Pop Rock',quote:'Five sounds, one groove',bio:'Banda de Los Angeles que define o pop rock contemporâneo.',motif:'BAND • LA • POP ROCK',c1:'#A6A6A6',c2:'#DF1164',c3:'#FFFFFF',group:true},
    {n:12,name:'Ne-Yo',song:'So Sick',genre:'R&B',quote:'Smooth never fades',bio:'Compositor e cantor de R&B, sinônimo de elegância.',motif:'R&B ♦ SMOOTH ♦ CLASS',c1:'#EFD24C',c2:'#08080C',c3:'#A6A6A6'},
    {n:13,name:'Black Eyed Peas',song:'I Gotta Feeling',genre:'Hip-Hop / Electro',quote:"Tonight's gonna be good",bio:'Grupo que fundiu hip-hop, eletrônica e cultura pop.',motif:'HIP-HOP ⟡ ELECTRO ⟡ PARTY',c1:'#55B96B',c2:'#65A9D8',c3:'#EFD24C',group:true},
    {n:14,name:'Nelly',song:'Dilemma',genre:'Hip-Hop',quote:'Hot in herre since 2000',bio:'Ícone do hip-hop de St. Louis e dos anos 2000.',motif:'ST. LOUIS • Y2K • HIP-HOP',c1:'#B9DDF2',c2:'#EFD24C',c3:'#08080C'},
    {n:15,name:'Ivete Sangalo',song:'Sorte Grande',genre:'Axé',quote:'Sai do chão!',bio:'A rainha do axé e do carnaval da Bahia.',motif:'AXÉ ✺ CARNAVAL ✺ BAHIA',c1:'#EFD24C',c2:'#DF1164',c3:'#65A9D8'},
    {n:16,name:'Elton John',song:'Cold Heart',genre:'Pop Rock',quote:'Glitter is forever',bio:'Lenda britânica de figurinos icônicos e hinos eternos.',motif:'GLAM ✧ PIANO ✧ LEGEND',c1:'#F5BBD2',c2:'#EFD24C',c3:'#DF1164'},
    {n:17,name:'Gilberto Gil',song:'Andar com Fé',genre:'MPB / Tropicália',quote:'Andar com fé eu vou',bio:'Mestre da Tropicália e da cultura brasileira.',motif:'TROPICÁLIA ❋ MPB ❋ BRASIL',c1:'#55B96B',c2:'#EFD24C',c3:'#65A9D8'},
    {n:18,name:'Rod Stewart',song:"Da Ya Think I'm Sexy?",genre:'Classic Rock',quote:'Forever young',bio:'Voz rouca do rock clássico com estilo vintage único.',motif:'ROCK • VINTAGE • ICON',c1:'#DF1164',c2:'#A6A6A6',c3:'#EFD24C'}
  ];
  const $=s=>document.querySelector(s), gallery=$('#beat-card-gallery'), modal=$('#beat-card-modal'), wrap=$('#beat-modal-card-wrap');
  if(!gallery||!modal)return;
  const photoFiles={
    1:'joao-gomes.jpeg',
    2:'lola-young.jpeg',
    3:'duquesa.jpeg',
    4:'luisa-sonza.jpeg',
    5:'zara-larsson.jpeg',
    6:'halsey.jpeg',
    7:'demi-lovato.jpeg',
    8:'mgk.jpg.jpeg',
    9:'j-balvin.jpeg',
    10:'calvin-harris.jpeg',
    11:'maroon-5.jpeg',
    12:'ne-yo.jpeg',
    13:'black-eyed-peas.jpeg',
    14:'nelly.jpeg',
    15:'ivete-sangalo.jpeg',
    16:'elton-john.jpeg',
    17:'gilberto-gil.jpeg',
    18:'rod-stewart.jpeg'
  };
  let selected=0;
  const pad=n=>String(n).padStart(2,'0');
  const initials=name=>name.split(/\s+/).map(p=>p[0]).slice(0,2).join('').toUpperCase();
  const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function face(a,back=false,large=false){
    const n=pad(a.n),file=photoFiles[a.n],photo=file?'<img class="beat-card-photo-img beat-card-photo-img-'+a.n+'" src="Static/Images/'+file+'" alt="Foto de '+esc(a.name)+'" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="beat-card-initials" hidden>'+initials(a.name)+'</span>':'<span class="beat-card-initials">'+initials(a.name)+'</span>';
    if(!back)return '<div class="beat-card-face beat-card-front"><div class="beat-card-face-inner" style="--c1:'+a.c1+';--c2:'+a.c2+';--c3:'+a.c3+'"><div class="beat-card-holo"></div><div class="beat-card-front-content"><div class="beat-card-topline"><span>PING●PONG</span><span>'+n+'/18</span></div><div class="beat-card-photo">'+photo+'</div><span class="beat-card-genre">'+esc(a.genre)+'</span><div class="beat-card-song">'+esc(a.song)+'</div><h4 class="beat-card-artist">'+esc(a.name)+'</h4><div class="beat-card-motif">'+esc(a.motif)+'</div><div class="beat-card-footer"><span>BEAT SERIES</span><span>✦ LIMITED ✦</span></div></div></div></div>';
    return '<div class="beat-card-face beat-card-back"><div class="beat-card-face-inner" style="--c1:'+a.c1+';--c2:'+a.c2+';--c3:'+a.c3+'"><div class="beat-card-holo"></div><div class="beat-card-back-content"><div class="beat-card-back-brand">PING●PONG / BEAT SERIES</div><h4 class="beat-card-back-name">'+esc(a.name)+'</h4><span class="beat-card-back-genre">'+esc(a.genre)+'</span><p class="beat-card-back-song">'+esc(a.song)+'</p><p class="beat-card-quote">“'+esc(a.quote)+'”</p><p class="beat-card-bio">'+esc(a.bio)+'</p><div class="beat-card-qr-row"><div class="beat-card-qr" data-qr></div><div class="beat-card-qr-label"><strong>SCAN & PLAY</strong>OUÇA A PLAYLIST<br>BEAT STATION</div></div><div class="beat-card-footer"><span>COLLECTIBLE MUSIC CARD</span><span>'+n+'/18</span></div></div></div></div>';
  }
  function cardMarkup(a,modalCard=false){
    return '<div class="beat-card-tile'+(modalCard?' beat-modal-tile':'')+'" data-card="'+a.n+'"><div class="beat-card-flipper">'+face(a)+face(a,true)+'</div></div>';
  }
  function addQr(root){
    root.querySelectorAll('[data-qr]').forEach(el=>{
      if(el.dataset.ready)return;
      el.dataset.ready='1';
      if(window.QRCode){new QRCode(el,{text:PLAYLIST_URL,width:140,height:140,colorDark:'#080808',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});}
      else el.textContent='QR';
    });
  }
  gallery.innerHTML=artists.map(a=>'<article class="beat-card-item">'+cardMarkup(a)+'<button type="button" class="beat-card-expand" data-open="'+a.n+'">AMPLIAR CARD ↗</button></article>').join('');
  addQr(gallery);
  gallery.addEventListener('click',e=>{
    const expand=e.target.closest('[data-open]');
    if(expand){openCard(Number(expand.dataset.open));return;}
    const tile=e.target.closest('.beat-card-tile');if(tile)tile.classList.toggle('is-flipped');
  });
  function openCard(n){
    selected=Math.max(1,Math.min(18,n));const a=artists[selected-1];
    $('#beat-modal-title').innerHTML='CARD <em>'+pad(a.n)+'/18</em>';
    wrap.innerHTML=cardMarkup(a,true);addQr(wrap);modal.hidden=false;document.body.style.overflow='hidden';
    $('#beat-modal-hint').textContent='O PNG inclui frente e verso. A impressão prepara os dois lados para recorte.';
  }
  function closeModal(){modal.hidden=true;document.body.style.overflow='';}
  modal.addEventListener('click',e=>{if(e.target.closest('[data-beat-close]'))closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});
  $('#beat-flip').addEventListener('click',()=>wrap.querySelector('.beat-card-tile')?.classList.toggle('is-flipped'));
  async function renderFaces(){
    if(!window.html2canvas)throw new Error('A ferramenta de imagem ainda está carregando. Atualize a página e tente novamente.');
    const tile=wrap.querySelector('.beat-card-tile');
    const front=tile.querySelector('.beat-card-front'),back=tile.querySelector('.beat-card-back');
    const saved=[front,back].map(el=>({transform:el.style.transform,backface:el.style.backfaceVisibility,webkit:el.style.webkitBackfaceVisibility}));
    const was=tile.classList.contains('is-flipped');
    tile.classList.remove('is-flipped');
    [front,back].forEach(el=>{el.style.transform='none';el.style.backfaceVisibility='visible';el.style.webkitBackfaceVisibility='visible'});
    const opts={backgroundColor:null,scale:3,useCORS:true,logging:false};
    try{
      const frontCanvas=await html2canvas(front,opts);
      const backCanvas=await html2canvas(back,opts);
      return {front:frontCanvas,back:backCanvas};
    }finally{
      [front,back].forEach((el,i)=>{el.style.transform=saved[i].transform;el.style.backfaceVisibility=saved[i].backface;el.style.webkitBackfaceVisibility=saved[i].webkit});
      if(was)tile.classList.add('is-flipped');
    }
  }
  $('#beat-download').addEventListener('click',async()=>{
    const btn=$('#beat-download'),hint=$('#beat-modal-hint');btn.disabled=true;hint.textContent='PREPARANDO SEU PNG...';
    try{
      const {front,back}=await renderFaces(),gap=36,canvas=document.createElement('canvas');
      canvas.width=front.width+back.width+gap;canvas.height=Math.max(front.height,back.height);
      const ctx=canvas.getContext('2d');ctx.fillStyle='#f3f0eb';ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(front,0,0);ctx.drawImage(back,front.width+gap,0);
      const a=document.createElement('a');a.download='beat-card-'+pad(selected)+'.png';a.href=canvas.toDataURL('image/png');a.click();
      hint.textContent='PNG SALVO! A FRENTE E O VERSO ESTÃO NA MESMA IMAGEM.';
    }catch(err){hint.textContent=err.message||'Não foi possível gerar o PNG.';}
    finally{btn.disabled=false;}
  });
  $('#beat-print').addEventListener('click',async()=>{
    const btn=$('#beat-print'),hint=$('#beat-modal-hint');btn.disabled=true;hint.textContent='PREPARANDO IMPRESSÃO...';
    const win=window.open('','_blank');
    if(!win){btn.disabled=false;hint.textContent='Permita pop-ups para imprimir o card.';return;}
    try{
      const {front,back}=await renderFaces();
      const frontUrl=front.toDataURL('image/png'),backUrl=back.toDataURL('image/png');
      win.document.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Beat Card '+pad(selected)+'</title><style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#fff}.sheet{min-height:180mm;display:flex;align-items:center;justify-content:center;gap:12mm}.sheet img{height:150mm;width:auto;max-width:48%;object-fit:contain}.caption{position:fixed;bottom:5mm;left:0;right:0;text-align:center;font-size:9pt;color:#555}@media print{.caption{display:none}}</style></head><body><main class="sheet"><img src="'+frontUrl+'" alt="Frente do card"><img src="'+backUrl+'" alt="Verso do card"></main><p class="caption">Frente e verso lado a lado para recorte.</p><script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>');
      win.document.close();hint.textContent='IMPRESSÃO ABERTA EM UMA NOVA ABA.';
    }catch(err){win.close();hint.textContent=err.message||'Não foi possível preparar a impressão.';}
    finally{btn.disabled=false;}
  });
})();
