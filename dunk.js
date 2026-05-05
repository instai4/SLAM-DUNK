// ─── DATA ───────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {id:0,name:'Official Game Ball',series:'Classic Series',price:34.99,color:'#FF5500',seam:'#1a0a00',label:'SPALDING',emissive:0x220a00,bgHex:0xff5500},
  {id:1,name:'Pro Tournament',series:'Elite Series',price:59.99,color:'#1a4aff',seam:'#000c33',label:'WILSON',emissive:0x000a22,bgHex:0x1a4aff},
  {id:2,name:'Street Slam Rider',series:'Street Series',price:24.99,color:'#1e1e1e',seam:'#ff5500',label:'STREET',emissive:0x0a0a0a,bgHex:0x222222},
  {id:3,name:'Midnight Edition',series:'Signature Series',price:89.99,color:'#8B1A1A',seam:'#ffcc00',label:'CUSTOM',emissive:0x1a0000,bgHex:0x8B1A1A},
];
const REVIEWS=[
  {text:'Best ball I\'ve ever played with',stars:5,name:'Marcus R.'},
  {text:'Street Slam held up all winter',stars:5,name:'Dani K.'},
  {text:'Midnight Edition is stunning',stars:5,name:'Tobi A.'},
  {text:'Pro grip is incredible',stars:5,name:'Jesse M.'},
  {text:'Fast shipping, perfect packaging',stars:4,name:'Riley C.'},
  {text:'Bought two, gifted one',stars:5,name:'Sam B.'},
  {text:'True NBA regulation feel',stars:5,name:'Chidi O.'},
  {text:'Worth every cent of the price',stars:5,name:'Priya S.'},
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let cur = 0, prev = 0;
let cart = [], wish = new Set();
let ballScale = [1,1,1,1]; // target scales
let ballY = [0,0,0,0];
let ballScaleCur = [1,0.001,0.001,0.001];
let isTransitioning = false;

// ─── CURSOR ──────────────────────────────────────────────────────────────────
let mx=0,my=0,rx=0,ry=0;
const curEl=document.getElementById('cur'),ringEl=document.getElementById('cur-ring');
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function aCursor(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;curEl.style.left=mx+'px';curEl.style.top=my+'px';ringEl.style.left=rx+'px';ringEl.style.top=ry+'px';requestAnimationFrame(aCursor);})();
document.querySelectorAll('button,a,.dot,.color-dot,.size-opt').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

// ─── TOAST ───────────────────────────────────────────────────────────────────
let toastId=0;
function showToast(type,title,sub){
  const w=document.getElementById('toast-wrap');
  const id='t'+(toastId++);
  const icons={cart:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,wish:`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,remove:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,info:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`};
  const ic=icons[type]||icons.info;
  const cls=type==='cart'?'cart':type==='wish'?'wish':type==='remove'?'remove':'cart';
  const el=document.createElement('div');
  el.className='toast';el.id=id;
  el.innerHTML=`<div class="toast-icon ${cls}">${ic}</div><div class="toast-text"><div class="toast-title">${title}</div><div class="toast-sub">${sub}</div></div>`;
  w.appendChild(el);
  setTimeout(()=>el.classList.add('show'),30);
  setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),400);},3200);
}

// ─── CART ─────────────────────────────────────────────────────────────────────
function addToCart(id){
  const p=PRODUCTS[id];
  const existing=cart.find(i=>i.id===id);
  if(existing){existing.qty++;}else{cart.push({...p,qty:1});}
  updateCartUI();
  showToast('cart','Added to Cart',p.name+' — $'+p.price.toFixed(2));
}
function removeFromCart(id){
  const p=PRODUCTS[id];
  cart=cart.filter(i=>i.id!==id);
  updateCartUI();
  showToast('remove','Removed',p.name+' removed from cart');
}
function changeQty(id,delta){
  const item=cart.find(i=>i.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)removeFromCart(id);
  else updateCartUI();
}
function updateCartUI(){
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const count=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').textContent=count;
  document.getElementById('cart-count').classList.toggle('show',count>0);
  document.getElementById('cart-badge').textContent=count;
  document.getElementById('cartTotal').textContent='$'+total.toFixed(2);
  const ci=document.getElementById('cartItems');
  if(cart.length===0){ci.innerHTML='<div class="empty-cart" id="emptyCart"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>Your cart is empty</p></div>';return;}
  ci.innerHTML=cart.map(i=>`<div class="cart-item"><div class="cart-item-color" style="background:${i.color};"></div><div class="cart-item-info"><div class="cart-item-name">${i.name}</div><div class="cart-item-meta">${i.series}</div><div class="cart-qty"><button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button><span class="qty-num">${i.qty}</span><button class="qty-btn" onclick="changeQty(${i.id},1)">+</button></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;"><div class="cart-item-price">$${(i.price*i.qty).toFixed(2)}</div><button class="cart-item-remove" onclick="removeFromCart(${i.id})">✕</button></div></div>`).join('');
}
function openCart(){document.getElementById('cart-drawer').classList.add('open');document.getElementById('cartOverlay').classList.add('show');}
function closeCart(){document.getElementById('cart-drawer').classList.remove('open');document.getElementById('cartOverlay').classList.remove('show');}
function checkout(){if(cart.length===0){showToast('info','Cart Empty','Add items before checking out');return;}showToast('cart','Order Placed!','Thank you for your purchase 🏀');cart=[];updateCartUI();closeCart();}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
function toggleWish(id){
  const p=PRODUCTS[id];
  const btn=document.getElementById('wish-'+id);
  if(wish.has(id)){
    wish.delete(id);
    btn.classList.remove('wish-active');
    showToast('remove','Removed from Wishlist',p.name);
  } else {
    wish.add(id);
    btn.classList.add('wish-active');
    showToast('wish','Saved to Wishlist',p.name);
  }
  updateWishUI();
}
function updateWishUI(){
  const wc=document.getElementById('wishCount');
  wc.textContent=wish.size;
  wc.classList.toggle('show',wish.size>0);
  const wi=document.getElementById('wishItems');
  if(wish.size===0){wi.innerHTML='<div class="empty-cart"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><p>No items saved yet</p></div>';return;}
  wi.innerHTML=[...wish].map(id=>{const p=PRODUCTS[id];return`<div class="wish-item"><div class="wish-ball" style="background:${p.color};"></div><div class="wish-info"><div class="wish-name">${p.name}</div><div class="wish-price">$${p.price.toFixed(2)}</div></div><button class="wish-remove" onclick="toggleWish(${id})">✕</button></div>`;}).join('');
}
function openWish(){document.getElementById('wish-panel').classList.add('open');document.getElementById('wishOverlay').classList.add('show');}
function closeWish(){document.getElementById('wish-panel').classList.remove('open');document.getElementById('wishOverlay').classList.remove('show');}

// ─── SHARE ────────────────────────────────────────────────────────────────────
function shareProduct(id){
  const p=PRODUCTS[id];
  if(navigator.share){navigator.share({title:p.name,text:'Check out '+p.name+' at Slam Dunk!',url:window.location.href});}
  else{navigator.clipboard.writeText(window.location.href).then(()=>showToast('info','Link Copied!',p.name+' link copied to clipboard'));}
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function openModal(){document.getElementById('vid-modal').classList.add('open');}
function closeModal(){document.getElementById('vid-modal').classList.remove('open');}
document.getElementById('vid-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function toggleSearch(){
  const sb=document.getElementById('searchBar');
  const isOpen=sb.classList.toggle('open');
  if(isOpen)document.getElementById('searchInput').focus();
}
document.getElementById('searchInput').addEventListener('keydown',e=>{
  if(e.key==='Escape')toggleSearch();
  if(e.key==='Enter'){
    const v=e.target.value.trim();
    if(v)showToast('info','Searching…','"'+v+'" — feature coming soon');
    toggleSearch();
  }
});

// ─── SIZE PICKERS ────────────────────────────────────────────────────────────
document.querySelectorAll('.size-picker').forEach(picker=>{
  picker.querySelectorAll('.size-opt').forEach(btn=>{
    btn.addEventListener('click',()=>{
      picker.querySelectorAll('.size-opt').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      showToast('info','Size Selected','Size '+btn.dataset.size+' selected');
    });
  });
});

// ─── DOTS & COUNTER ──────────────────────────────────────────────────────────
const dotsWrap=document.getElementById('dots');
PRODUCTS.forEach((_,i)=>{const d=document.createElement('div');d.className='dot'+(i===0?' active':'');d.addEventListener('click',()=>setSlide(i));dotsWrap.appendChild(d);});
function updateDots(){document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===cur));document.getElementById('pgCur').textContent=String(cur+1).padStart(2,'0');}

// ─── SLIDE LOGIC ─────────────────────────────────────────────────────────────
function setSlide(idx){
  if(idx===cur)return;
  prev=cur;cur=idx;
  document.querySelector('.sl.active').classList.remove('active');
  document.getElementById('sl-'+cur).classList.add('active');
  updateDots();

  // bg text swap
  const bg=document.getElementById('bgTxt');
  bg.style.transition='opacity .25s ease,transform .25s ease';
  bg.style.opacity='0';bg.style.transform='translateY(24px) scale(.95)';
  setTimeout(()=>{
    bg.textContent=PRODUCTS[cur].label;
    bg.style.transform='translateY(0) scale(1)';bg.style.opacity='1';
  },280);

  // ball transition: shrink old, grow new
  ballScaleCur[prev]=1; // will lerp to tiny
  ballTargetScale[prev]=0.001;
  setTimeout(()=>{ballScaleCur[cur]=0.001;ballTargetScale[cur]=1;},220);
}
window.goSlide=function(d){setSlide(Math.max(0,Math.min(PRODUCTS.length-1,cur+d)));};
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key==='ArrowDown')goSlide(1);
  if(e.key==='ArrowLeft'||e.key==='ArrowUp')goSlide(-1);
});

// ─── THREE.JS ────────────────────────────────────────────────────────────────
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(42,1,.1,100);
camera.position.set(0,0,5);
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
resize();window.addEventListener('resize',resize);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff,.25));
const kl=new THREE.DirectionalLight(0xffffff,2.8);kl.position.set(3,5,3);kl.castShadow=true;scene.add(kl);
const rl=new THREE.DirectionalLight(0xff6622,.9);rl.position.set(-4,0,-3);scene.add(rl);
const fl=new THREE.PointLight(0x4488ff,.5,20);fl.position.set(-3,2,2);scene.add(fl);

function makeTex(color,seam){
  const S=1024,c=document.createElement('canvas');c.width=c.height=S;
  const ctx=c.getContext('2d');
  ctx.fillStyle=color;ctx.fillRect(0,0,S,S);
  // pebbles
  const gc=document.createElement('canvas');gc.width=gc.height=S;const gx=gc.getContext('2d');
  for(let i=0;i<20000;i++){const x=Math.random()*S,y=Math.random()*S,r=Math.random()*2.2+.4;gx.beginPath();gx.arc(x,y,r,0,Math.PI*2);gx.fillStyle=`rgba(0,0,0,${Math.random()*.22+.04})`;gx.fill();}
  ctx.drawImage(gc,0,0);
  // seams
  ctx.strokeStyle=seam;ctx.lineWidth=8;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(S/2,0);ctx.bezierCurveTo(S/2-90,S/4,S/2+90,S*3/4,S/2,S);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,S/2);ctx.bezierCurveTo(S/4,S/2-90,S*3/4,S/2+90,S,S/2);ctx.stroke();
  ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(0,S/2);ctx.bezierCurveTo(S*.25,S*.15,S*.75,S*.15,S,S/2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,S/2);ctx.bezierCurveTo(S*.25,S*.85,S*.75,S*.85,S,S/2);ctx.stroke();
  // highlight
  const g=ctx.createRadialGradient(S*.35,S*.28,0,S*.35,S*.28,S*.55);
  g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(.4,'rgba(255,255,255,.04)');g.addColorStop(1,'rgba(0,0,0,.22)');
  ctx.fillStyle=g;ctx.fillRect(0,0,S,S);
  return new THREE.CanvasTexture(c);
}
function makeNorm(){
  const S=512,c=document.createElement('canvas');c.width=c.height=S;const ctx=c.getContext('2d');
  ctx.fillStyle='#8080ff';ctx.fillRect(0,0,S,S);
  for(let i=0;i<5000;i++){const x=Math.random()*S,y=Math.random()*S,r=Math.random()*4+1;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#9090ff');g.addColorStop(.5,'#8888ff');g.addColorStop(1,'#7878ff');ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();}
  return new THREE.CanvasTexture(c);
}
const normMap=makeNorm();
const geo=new THREE.SphereGeometry(1.6,64,64);
const balls=PRODUCTS.map((p,i)=>{
  const mat=new THREE.MeshStandardMaterial({map:makeTex(p.color,p.seam),normalMap:normMap,normalScale:new THREE.Vector2(.45,.45),roughness:.68,metalness:0,emissive:new THREE.Color(p.emissive),emissiveIntensity:.3});
  const m=new THREE.Mesh(geo,mat);m.castShadow=true;m.position.set(0,0,0);scene.add(m);
  return m;
});

// shadow
const sp=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.ShadowMaterial({opacity:.2}));
sp.rotation.x=-Math.PI/2;sp.position.y=-2;sp.receiveShadow=true;scene.add(sp);

// Per-ball state
const ballPos=[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
const ballRot=[{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}];
const ballTargetScale=[1,.001,.001,.001];
let mxN=0,myN=0;
document.addEventListener('mousemove',e=>{mxN=(e.clientX/innerWidth-.5)*2;myN=(e.clientY/innerHeight-.5)*2;});

let t=0;
function animate(){
  requestAnimationFrame(animate);t+=.007;
  balls.forEach((ball,i)=>{
    // lerp scale
    const ts=ballTargetScale[i];
    ballScaleCur[i]+=(ts-ballScaleCur[i])*.09;
    ball.scale.setScalar(Math.max(.001,ballScaleCur[i]));
    ball.visible=ballScaleCur[i]>.005;
    // bounce only for current
    const bounce=i===cur?Math.sin(t*1.3)*.045:0;
    ball.position.y=bounce;
    // rotation
    const tRY=i===cur?t*.28+mxN*.35:ball.rotation.y;
    const tRX=i===cur?myN*.22:ball.rotation.x;
    ballRot[i].x+=(tRX-ballRot[i].x)*.04;
    ballRot[i].y+=(tRY-ballRot[i].y)*.04;
    ball.rotation.x=ballRot[i].x;
    ball.rotation.y=ballRot[i].y;
  });
  camera.position.x=Math.sin(t*.18)*.12;
  camera.position.y=Math.cos(t*.13)*.08;
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
}
animate();

// ─── SCROLL ───────────────────────────────────────────────────────────────────
window.addEventListener('scroll',()=>{
  const sy=scrollY;
  const sh=document.getElementById('scroll-hint');
  if(sy>80)sh.classList.add('hidden');else sh.classList.remove('hidden');
  const stH=document.getElementById('stage').offsetHeight-innerHeight;
  const p=Math.max(0,Math.min(1,sy/stH));
  const idx=Math.min(PRODUCTS.length-1,Math.floor(p*PRODUCTS.length));
  if(idx!==cur)setSlide(idx);
});

// ─── TICKER ───────────────────────────────────────────────────────────────────
const tt=document.getElementById('tickerTrack');
const allR=[...REVIEWS,...REVIEWS]; // double for loop
tt.innerHTML=allR.map(r=>`<div class="ticker-item"><span class="stars">${'★'.repeat(r.stars)}</span><span>"${r.text}"</span><span class="reviewer">— ${r.reviewer||r.name}</span></div>`).join('');

// ─── COLOR DOTS ──────────────────────────────────────────────────────────────
document.querySelectorAll('.color-picker').forEach(picker=>{
  picker.querySelectorAll('.color-dot').forEach(dot=>{
    dot.addEventListener('click',()=>{
      picker.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));
      dot.classList.add('active');
      showToast('info','Color Selected',dot.title||'Color applied');
    });
  });
});

// init
updateCartUI();updateWishUI();
function openContactToast(){

  const w = document.getElementById('toast-wrap');

  const el = document.createElement('div');

  el.className = 'toast show';

  el.innerHTML = `
    <div class="toast-icon cart">
      👤
    </div>

    <div class="toast-text">
      <div class="toast-title">
        Contact Us
      </div>

      <div class="toast-sub">
        <a href="https://instai4.github.io/PORT-FOLIO/"
           target="_blank"
           style="
             color: var(--orange);
             text-decoration:none;
             font-weight:600;
           ">
          ANURAG SINGH
        </a>
      </div>
    </div>
  `;

  w.appendChild(el);

  setTimeout(() => {
    el.classList.remove('show');

    setTimeout(() => {
      el.remove();
    }, 400);

  }, 4000);
}
