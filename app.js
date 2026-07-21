const $=s=>document.querySelector(s);const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
async function load(){try{const r=await fetch('data/content.json',{cache:'no-store'});if(!r.ok)throw new Error();return await r.json()}catch{return null}}
function text(id,v){const e=$('#'+id);if(e)e.textContent=v||''}
function bullets(id,items){$('#'+id).innerHTML=(items||[]).map(x=>`<li>${esc(x)}</li>`).join('')}
function openDetail(item){text('modalMeta',`${item.date||item.year||''}${item.author?' · updated by '+item.author:''}`);text('modalTitle',item.title);text('modalContent',item.content||item.summary||item.description||'');const a=$('#modalLink');a.style.display=item.link?'inline-block':'none';a.href=item.link||'#';$('#detailModal').showModal()}
function render(d){
 const p=d.profile;text('siteTitle',d.siteTitle);text('name',p.name);text('nameEn',p.nameEn);text('bio',p.bio);text('footerName',p.name);text('updatedAt',d.updatedAt);
 $('#contactList').innerHTML=`<li>职称：${esc(p.role)}</li><li>单位：${esc(p.college)}</li><li>邮箱：<a href="mailto:${esc(p.email)}">${esc(p.email)}</a></li><li>地址：${esc(p.office)}</li>`;
 const portrait=$('#portrait'),fallback=$('#portraitFallback');if(p.photo){portrait.src=p.photo;portrait.style.display='block';fallback.style.display='none'}
 bullets('experienceList',d.experience);bullets('researchList',d.research);bullets('teachingList',d.teaching);bullets('awardList',d.awards);bullets('serviceList',d.services);
 $('#newsList').innerHTML=d.news.map((n,i)=>`<article class="news-card" data-news="${i}"><div class="news-meta">${esc(n.date)} updated by <b>${esc(n.author||p.nameEn)}</b></div><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p>${n.image?`<img src="${esc(n.image)}" alt="${esc(n.title)}">`:''}</article>`).join('');
 const list=(id,items,type)=>{$('#'+id).innerHTML=(items||[]).map((x,i)=>`<article class="list-row" data-kind="${type}" data-index="${i}"><span>${esc(x.year||x.date||'')}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.venue||x.description||x.members||'')}</p></div><b>↗</b></article>`).join('')};list('paperList',d.papers,'papers');list('projectList',d.projects,'projects');list('studentList',d.students,'students');
 text('joinTitle',d.join.title);text('joinText',d.join.text);const mail=$('#joinEmail');mail.href='mailto:'+p.email;
 document.querySelectorAll('[data-news]').forEach(e=>e.onclick=()=>openDetail(d.news[+e.dataset.news]));document.querySelectorAll('[data-kind]').forEach(e=>e.onclick=()=>openDetail(d[e.dataset.kind][+e.dataset.index]));document.title=`${p.name}｜西安电子科技大学`;
}
load().then(d=>{if(d)render(d);else $('#newsList').innerHTML='<div class="error-box">内容文件未能加载。请通过网站地址访问，或检查 data/content.json 是否存在。</div>'});
$('#menuToggle').onclick=()=>$('#nav').classList.toggle('open');document.querySelectorAll('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));$('.modal-close').onclick=()=>$('#detailModal').close();$('#detailModal').onclick=e=>{if(e.target===$('#detailModal'))$('#detailModal').close()};
