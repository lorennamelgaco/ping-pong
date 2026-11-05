// Navegação por âncoras (layout desktop).
const filters=document.querySelectorAll('.filter');const cards=document.querySelectorAll('.collect-card');filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(item=>item.classList.remove('active'));button.classList.add('active');const selected=button.dataset.filter;cards.forEach(card=>{card.hidden=selected!=='todos'&&card.dataset.category!==selected;});}));
// Menu mobile (botão ☰): abre e fecha a navegação.
const menuToggle=document.querySelector('.menu-toggle'),mainNav=document.querySelector('.main-nav');if(menuToggle&&mainNav){menuToggle.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open))});mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}))}
const toast=document.querySelector('.toast');let toastTimer;document.querySelectorAll('.collect-card').forEach(card=>{card.setAttribute('tabindex','0');card.setAttribute('role','button');const show=()=>{toast.textContent='Em breve: '+card.querySelector('h3').textContent+' — coleção demonstrativa.';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)};card.addEventListener('click',show);card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();show()}});});
// Álbum: progresso de figurinhas salvo no navegador.
const stickerButtons=[...document.querySelectorAll('.sticker-slot button')];const savedStickers=JSON.parse(localStorage.getItem('pp-stickers')||'[]');stickerButtons.forEach((button,index)=>{if(savedStickers.includes(index)){button.classList.add('collected');button.setAttribute('aria-pressed','true')}button.addEventListener('click',()=>{button.classList.toggle('collected');button.setAttribute('aria-pressed',String(button.classList.contains('collected')));updateStickerCount()})});function updateStickerCount(){const count=stickerButtons.filter(b=>b.classList.contains('collected')).length;document.querySelector('#sticker-count').textContent=count;document.querySelector('#sticker-percent').textContent=Math.round(count/stickerButtons.length*100)+'%';document.querySelector('#sticker-progress').style.width=count/stickerButtons.length*100+'%';localStorage.setItem('pp-stickers',JSON.stringify(stickerButtons.map((b,i)=>b.classList.contains('collected')?i:null).filter(v=>v!==null)))}updateStickerCount();
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
  actions.innerHTML='<button type="button" class="button button-ghost" id="avatar-random">SORTEAR ↻</button><button type="button" class="button button-yellow" id="avatar-save">SALVAR ↗</button><button type="button" class="button button-yellow" id="avatar-download">BAIXAR PNG ↓</button>';
  controls.appendChild(actions);
  $('#avatar-random').onclick=()=>{const pick=a=>a[Math.floor(Math.random()*a.length)];
    Object.entries(OPTS).forEach(([k,[,items]])=>state[k]=pick(items)[0]);state.color=pick(COLORS);state.bg=pick(BGS);sync();feedback.textContent='SORTEADO! NÃO GOSTOU? SORTEIE DE NOVO.'};
  $('#avatar-save').onclick=()=>{localStorage.setItem('pp-avatar-v2',JSON.stringify(state));feedback.textContent='AVATAR SALVO NESTE NAVEGADOR. SUA IDENTIDADE ESTÁ CRIADA!'};
  $('#avatar-download').onclick=download;
}
function download(){
  const url=URL.createObjectURL(new Blob([svg(state,720)],{type:'image/svg+xml'})),img=new Image();
  img.onload=()=>{
    const c=document.createElement('canvas');c.width=c.height=800;const x=c.getContext('2d');
    x.fillStyle=state.bg;x.fillRect(0,0,800,800);x.drawImage(img,40,10,720,720);
    x.fillStyle=INK;x.textAlign='center';x.font='34px "Archivo Black","Arial Black",sans-serif';
    x.fillText((state.name.trim()||'PING PONG').toUpperCase(),400,765);
    x.font='16px "DM Sans",Arial,sans-serif';x.fillText(serial(state)+' · '+rarity(state),400,788);
    const a=document.createElement('a');a.download='meu-avatar-ping-pong.png';a.href=c.toDataURL('image/png');a.click();URL.revokeObjectURL(url);
    feedback.textContent='PNG BAIXADO!';
  };
  img.src=url;
}
nameInput.value=state.name||'';
nameInput.addEventListener('input',e=>{state.name=e.target.value;sync()});
build();sync();
})();
// Quiz com dois temas e quatro perguntas por rodada.
const quizData={music:{label:'DESAFIO MUSICAL',questions:[{q:'Qual destes elementos costuma fazer parte de uma playlist?',a:['Faixas musicais','Figurinhas','Chaveiros','Posters'],correct:0,why:'Uma playlist reúne músicas para ouvir em sequência.'},{q:'Qual plataforma de streaming aparece nesta experiência?',a:['Spotify','Calculadora','Bloco de notas','Agenda'],correct:0,why:'A área Beat Station foi pensada para integrar uma playlist do Spotify.'},{q:'Qual destes gêneros é ligado à cultura urbana?',a:['Hip-hop','Ópera barroca','Música medieval','Canto gregoriano'],correct:0,why:'O hip-hop é uma das expressões culturais urbanas que inspiram o projeto.'},{q:'O que combina com a proposta Beat Station?',a:['Música e identidade','Controle de estoque','Receitas culinárias','Manual de montagem'],correct:0,why:'A proposta conecta música, arte e identidade.'}]},brand:{label:'DESAFIO PING PONG',questions:[{q:'Em que ano, segundo a história apresentada no projeto, Ping Pong foi lançado?',a:['1945','1960','1985','2001'],correct:0,why:'O contexto histórico do projeto apresenta 1945 como ano de lançamento.'},{q:'O que acompanhava a experiência clássica da marca?',a:['Figurinhas e colecionáveis','Aplicativo de banco','Jogos online','Ingressos de cinema'],correct:0,why:'As figurinhas e colecionáveis faziam parte da experiência de descoberta e troca.'},{q:'Qual era uma das brincadeiras ligadas às coleções?',a:['Trocar figurinhas','Montar computadores','Fazer chamadas','Editar vídeos'],correct:0,why:'Trocar e completar coleções fazia parte da diversão.'},{q:'O que a nova Ping Pong Collection propõe?',a:['Levar a nostalgia ao universo digital','Apagar as coleções antigas','Vender apenas roupas','Substituir música por esportes'],correct:0,why:'A ideia é atualizar o legado com cards, avatares e experiências digitais.'}]}};let quizType='music',quizIndex=0,quizScore=0,answered=false,finished=false;const qEl=document.querySelector('#quiz-question'),optsEl=document.querySelector('#quiz-options'),feedbackEl=document.querySelector('#quiz-feedback'),nextEl=document.querySelector('#quiz-next');function renderQuiz(){const data=quizData[quizType],q=data.questions[quizIndex];document.querySelector('#quiz-category').textContent=data.label;document.querySelector('#quiz-progress').textContent='PERGUNTA '+(quizIndex+1)+' / '+data.questions.length;qEl.textContent=q.q;optsEl.innerHTML='';feedbackEl.textContent='';nextEl.disabled=true;nextEl.textContent=quizIndex===data.questions.length-1?'VER RESULTADO ↗':'PRÓXIMA PERGUNTA →';answered=false;finished=false;q.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='quiz-option';b.textContent=String.fromCharCode(65+i)+'. '+answer;b.addEventListener('click',()=>answerQuiz(i));optsEl.appendChild(b)})}function answerQuiz(index){if(answered)return;answered=true;const q=quizData[quizType].questions[quizIndex];[...optsEl.children].forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add('correct');if(i===index&&i!==q.correct)b.classList.add('wrong')});if(index===q.correct){quizScore++;feedbackEl.textContent='ACERTOU! '+q.why}else feedbackEl.textContent='QUASE! '+q.why;nextEl.disabled=false}nextEl.addEventListener('click',()=>{if(finished){quizIndex=0;quizScore=0;renderQuiz();return}if(!answered)return;if(quizIndex<quizData[quizType].questions.length-1){quizIndex++;renderQuiz()}else{qEl.textContent='VOCÊ FEZ '+quizScore+' DE '+quizData[quizType].questions.length+' PONTOS!';optsEl.innerHTML='';feedbackEl.textContent=quizScore===4?'PERFEITO! VOCÊ DOMINA ESSA VIBE.':'BOA! CONTINUE EXPLORANDO O UNIVERSO PING PONG.';nextEl.textContent='JOGAR NOVAMENTE ↻';nextEl.disabled=false;finished=true}});document.querySelectorAll('.quiz-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.quiz-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');quizType=tab.dataset.quiz;quizIndex=0;quizScore=0;renderQuiz()}));renderQuiz();
// Animações de entrada.
const revealTargets=document.querySelectorAll('.collect-card,.rarity-card,.feature-grid article,.story-content,.gift-item,.fact-card');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});revealTargets.forEach(item=>{item.classList.add('reveal');observer.observe(item)});}