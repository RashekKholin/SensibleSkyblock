const API='https://api.hypixel.net/v2/skyblock/bazaar';
const items=[
 {name:'Enchanted Copper',copper:1,materials:[['Copper Ingot',160]],sell:0},
 {name:'Refined Titanium',copper:50,materials:[['Titanium Ore',160]],sell:0},
 {name:'Enchanted Iron',copper:2,materials:[['Iron Ingot',160]],sell:0},
 {name:'Enchanted Gold',copper:2,materials:[['Gold Ingot',160]],sell:0},
 {name:'Enchanted Redstone',copper:2,materials:[['Redstone',160]],sell:0},
 {name:'Enchanted Lapis Lazuli',copper:2,materials:[['Lapis Lazuli',160]],sell:0},
 {name:'Enchanted Emerald',copper:3,materials:[['Emerald',160]],sell:0},
 {name:'Enchanted Diamond',copper:4,materials:[['Diamond',160]],sell:0}
];
let market={};
const $=id=>document.getElementById(id);
function coins(n){return Math.round(n).toLocaleString()+' coins'}
function price(name){const x=market[name];return x?.buy||x?.sell||0}
function render(){
 const q=$('search').value.toLowerCase(); const mode=$('mode').value; const sort=$('sort').value;
 let rows=items.map(x=>{const mat=x.materials.reduce((s,[n,q])=>s+price(n)*q,0);const sell= x.sell||price(x.name)*160;const orderCost=mat+x.copper*10;const instantCost=mat+x.copper*10;return {...x,mat,sell,orderProfit:sell-orderCost,instantProfit:sell-instantCost,ppc:(sell-orderCost)/x.copper}}).filter(x=>x.name.toLowerCase().includes(q));
 if(mode==='recommended')rows=rows.filter(x=>x.ppc>0); if(mode==='instant')rows=rows.filter(x=>x.instantProfit>0); if(mode==='instantNoCraft')rows=rows.filter(x=>x.instantProfit>0&&x.materials.length===0); if(mode==='noCraft')rows=rows.filter(x=>x.materials.length===0);
 rows.sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='sell'?b.sell-a.sell:sort==='cost'?(a.mat-a.copper*10)-(b.mat-b.copper*10):b.ppc-a.ppc);
 $('rows').innerHTML=rows.map(x=>`<tr><td><div class="item"><span class="icon">◆</span>${x.name}</div></td><td><span class="profit ${x.orderProfit<0?'negative':''}">${coins(x.orderProfit)}</span><div class="small">${x.copper} Copper</div></td><td><span class="profit ${x.instantProfit<0?'negative':''}">${coins(x.instantProfit)}</span></td><td class="req">${x.materials.map(([n,q])=>`${q.toLocaleString()}× ${n}`).join('<br>')}</td><td>${coins(x.sell)}<div class="small">cost ${coins(x.mat+x.copper*10)}</div></td></tr>`).join('');
 $('empty').classList.toggle('hidden',rows.length>0);
}
async function load(){ $('statusText').textContent='Loading'; try{const r=await fetch(API);if(!r.ok)throw Error();const d=await r.json();market=d.products||{}; $('statusText').textContent='Live';$('dot').parentElement.classList.add('ok');$('updated').textContent=new Date().toLocaleTimeString();render()}catch(e){$('statusText').textContent='Offline';$('updated').textContent='Demo data';render()}}
['search','mode','sort'].forEach(id=>$(id).addEventListener('input',render));$('refresh').onclick=load;load();