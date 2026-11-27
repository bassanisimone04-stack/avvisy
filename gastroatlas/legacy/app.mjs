import {BRAND,cities,restaurants,sections} from '/data.mjs'
const [,lang,route='',slug='']=location.pathname.split('/')
const it=lang!=='en', locale=it?'it':'en', tr=(en,italian)=>it?italian:en
const url=(path='')=>'/'+locale+'/'+(path?path.replace(/\/$/,'')+'/':'')
const title=key=>sections[key]?.[it?1:0] ?? key
const params=new URLSearchParams(location.search)
const main=document.querySelector('#main')
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key))||[]}catch{return []}}
let saved=read('atlas-saves'), chosen=read('atlas-compare')
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const cityName=c=>c[it?1:0], country=c=>c[it?2:3], cuisine=r=>r.cuisine[it?1:0]
const photo=(name,alt='',hero=false)=>`<img class="photo" src="/assets/${name}.webp" alt="${esc(alt)}" ${hero?'fetchpriority="high"':'loading="lazy"'}>`
const link=(path,label,cls='')=>`<a class="${cls}" href="${url(path)}">${label}</a>`
const query=(key,value)=>url('restaurants')+'?'+new URLSearchParams({[key]:value})
const normalize=s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase(locale)
const demo=tr('Demo data','Dati dimostrativi')
const demoNotice=tr('Fictional venues and sample prices. Images are illustrative.','Locali e prezzi dimostrativi. Le immagini sono illustrative.')
const level=n=>tr('Demo distinction · Level ','Distinzione demo · Livello ')+n
const fmt=n=>new Intl.NumberFormat(locale,{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n)
const compareUrl=(ids=chosen)=>url('compare')+'?'+new URLSearchParams({r:ids.join(',')})
const notice=s=>`<p class="notice">${s}</p>`
const more=(path,label)=>link(path,label+' →','more')
const section=(heading,body,eyebrow='')=>`<section class="section wrap">${eyebrow?`<p class="eyebrow">${eyebrow}</p>`:''}<h2>${heading}</h2>${body}</section>`
const card=(img,heading,desc,href)=>`<article class="card"><a href="${href}">${photo(img,heading)}<h3>${heading}</h3><p class="muted">${desc}</p></a></article>`
const cityCard=c=>card(c[4],cityName(c),country(c),url('restaurants/'+c[4]))
const restCard=r=>`<article class="card">${link('restaurant/'+r.slug,photo(r.image,r.name)+'<h3>'+r.name+'</h3>')}<button class="save" data-save="${r.slug}" aria-label="${tr('Save','Salva')} ${r.name}" aria-pressed="${saved.includes(r.slug)}">${saved.includes(r.slug)?'♥':'♡'}</button><span class="tag">${level(r.level)}</span><p>${cityName(r.city)}, ${country(r.city)}</p><p class="muted">${cuisine(r)} · ${tr('Demo menu','Menù demo')} ${fmt(r.price)}</p><label><input class="check" type="checkbox" data-compare="${r.slug}" ${chosen.includes(r.slug)?'checked':''}> ${title('compare')}</label></article>`
const nav=['restaurants','destinations','hotels','experiences','travel','magazine','gifts']
document.documentElement.lang=locale
document.querySelector('.skip').textContent=tr('Skip to content','Vai al contenuto')
document.querySelector('#top').innerHTML=`<div class="bar">${link('',BRAND.name,'brand')}<nav aria-label="${tr('Main navigation','Navigazione principale')}">${nav.map(k=>link(k,title(k))).join('')}</nav><div class="tools"><button data-finder aria-label="${tr('Search','Cerca')}">⌕</button><a href="${'/'+(it?'en':'it')+'/' + location.pathname.split('/').slice(2).join('/')+location.search}" aria-label="${tr('Switch to Italian','Passa all’inglese')}">${it?'IT':'EN'} · EUR</a><a href="${url('favorites')}" aria-label="${title('favorites')}">♡ <span data-saved></span></a>${link('club',tr('Join the Club','Entra nel Club'),'btn outline club')}</div></div>`
document.querySelector('#footer').innerHTML=`<div class="wrap foot"><div>${link('',BRAND.name,'brand')}<p>${tr('Independent editorial guide.','Guida editoriale indipendente.')}</p><small>${demoNotice}</small></div><div>${['restaurants','destinations','experiences','price-index','compare'].map(k=>link(k,title(k))).join('')}</div><div>${['about','methodology','concierge','legal','business','account'].map(k=>link(k,title(k))).join('')}</div></div>`
const experienceCards=()=>[
['tasting',tr('Exceptional tasting menus','Menù degustazione'),tr('Discover and compare','Scopri e confronta'),query('sort','price')],
['lake',tr('Dine & Stay','Cena e soggiorno'),tr('Remarkable places to stay','Soggiorni per chi viaggia per il gusto'),url('hotels')],
['plate1',tr('Last-minute tables','Tavoli dell’ultimo minuto'),tr('Partner availability pending','Disponibilità dei partner in attesa'),url('experiences/last-minute')],
['wine',tr('Give an experience','Regala un’esperienza'),tr('Ideas for a special occasion','Idee per un’occasione speciale'),url('gifts')]
].map(x=>card(...x)).join('')
const travelCard=()=>'<div class="wide">'+card('tuscany',tr('A gastronomic journey through Tuscany','Un viaggio gastronomico in Toscana'),tr('Explore Italy through its tables, vineyards and stays.','Scopri l’Italia attraverso le sue tavole, i vigneti e i soggiorni.'),url('travel/tuscany'))+'</div>'
function home(){
  const chips=[[tr('Level 1','Livello 1'),'level','1'],[tr('Level 2','Livello 2'),'level','2'],[tr('Level 3','Livello 3'),'level','3'],[tr('Under €100','Meno di €100'),'max','100'],[tr('Dine & Stay','Cena e soggiorno'),'rooms','1']]
  main.innerHTML=`<section class="hero">${photo('hero',tr('Restaurant terrace overlooking the Amalfi Coast','Terrazza di un ristorante affacciata sulla Costiera Amalfitana'),true)}<h1>${tr('The world is yours to taste.','Il mondo, tutto da assaggiare.')}</h1><p>${tr('Discover exceptional restaurants, remarkable hotels and unforgettable culinary journeys.','Scopri ristoranti d’eccezione, soggiorni da ricordare e viaggi gastronomici.')}</p><form class="search" action="${url('restaurants')}"><label for="hero-query" aria-hidden="true">⌕</label><input id="hero-query" name="q" aria-label="${tr('Destination or restaurant','Destinazione o ristorante')}" placeholder="${tr('Where would you like to dine?','Dove ti piacerebbe cenare?')}"><button>${tr('Explore','Esplora')}</button></form><details class="hero-options"><summary>${tr('Advanced search','Ricerca avanzata')}</summary><form action="${url('restaurants')}" class="hero-filter"><label>${tr('Destination','Destinazione')}<select name="city"><option value="">${tr('Any city','Tutte le città')}</option>${cities.map(c=>`<option value="${c[4]}">${cityName(c)}</option>`).join('')}</select></label><label>${tr('Budget below (€)','Budget sotto (€)')}<input type="number" min="1" name="max"></label><label>${tr('Cuisine','Cucina')}<select name="cuisine"><option value="">${tr('Any cuisine','Tutte le cucine')}</option>${Array.from(new Map(restaurants.map(r=>[r.cuisine[0],cuisine(r)]))).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label><button>${tr('Explore','Esplora')}</button></form></details><div class="chips">${chips.map(([label,key,value])=>`<a href="${query(key,value)}">${label}</a>`).join('')}</div></section>`
    +section(tr('Explore culinary destinations','Esplora le destinazioni gastronomiche'),`<div class="grid cities">${cities.slice(0,3).map(cityCard).join('')}</div><div class="topline">${more('destinations',tr('View all destinations','Vedi tutte le destinazioni'))}</div>`,tr('The world’s finest destinations','Destinazioni dal mondo'))
    +section(tr('Find your next experience','Trova la tua prossima esperienza'),`<div class="grid two home-experiences">${experienceCards()}</div>`)
    +section(tr('Travel for taste','Viaggia per il gusto'),travelCard())
    +section(tr('Exceptional restaurants','Ristoranti da scoprire'),`${notice(demoNotice)}<div class="row">${[1,2,3].map(n=>`<button data-level="${n}" aria-pressed="${n===1}">${tr('Level','Livello')} ${n}</button>`).join('')}</div><div class="grid" id="featured"></div><div class="topline">${more('restaurants',tr('View all restaurants','Vedi tutti i ristoranti'))}</div>`)
    +section(tr('Fine dining for every budget','Fine dining per ogni budget'),`<div class="row">${[50,100,150,250].map(n=>`<a class="btn" href="${query('max',n)}">${tr('Under','Meno di')} ${fmt(n)}</a>`).join('')}</div><small>${demo}</small>`)
    +section(tr('Dine & Stay','Cena e soggiorno'),`<div class="split">${photo('dining')}<div><h3>${tr('Exceptional dining deserves an exceptional stay.','Una cena speciale merita un soggiorno all’altezza.')}</h3>${more('hotels',tr('Explore stays','Esplora i soggiorni'))}</div></div>`)
    +section(title('price-index'),`<p class="lead">${tr('Not enough verified data.','Dati verificati insufficienti.')}</p>${more('methodology',title('methodology'))}`)
    +section('Magazine',`<div class="grid two">${card('wine',tr('How to read a wine pairing','Come leggere un abbinamento vini'),tr('Wine and Champagne','Vino e Champagne'),url('magazine/wine'))}${card('plate2',tr('How to compare tasting menus','Come confrontare i menù degustazione'),tr('Fine dining guides','Guide al fine dining'),url('magazine/menus'))}</div>`)
    +`<section class="section dark"><div class="wrap"><h2>GastroAtlas Club</h2><p class="lead">${tr('Recommendations, saved lists and culinary journeys.','Consigli, liste di preferiti e itinerari gastronomici.')}</p>${link('club',tr('Discover the Club','Scopri il Club'),'btn')}</div></section>`
    +section('Newsletter',notice(tr('Subscriptions are currently unavailable.','Le iscrizioni non sono ancora disponibili.')))
  featured(1)
}
function featured(n){document.querySelector('#featured').innerHTML=restaurants.filter(r=>r.level===n).slice(0,3).map(restCard).join('')}
const page=(heading,body)=>{document.title=heading+' | '+BRAND.short;main.innerHTML=`<div class="wrap section"><h1>${heading}</h1>${body}</div>`}
function directory(){
 const selected=cities.find(c=>c[4]===slug)
 const options=(items,sel)=>items.map(([value,label])=>`<option value="${value}" ${value===sel?'selected':''}>${label}</option>`).join('')
 page(selected?cityName(selected):title('restaurants'),`${notice(demoNotice)}<div class="directory"><form id="filters" class="filters"><label>${tr('Search','Cerca')}<input name="q" value="${esc(params.get('q')||'')}"></label><label>${tr('City','Città')}<select name="city">${options([['',tr('All cities','Tutte le città')],...cities.map(c=>[c[4],cityName(c)])],selected?.[4]||params.get('city'))}</select></label><label>${tr('Cuisine','Cucina')}<select name="cuisine">${options([['',tr('All cuisines','Tutte le cucine')],...Array.from(new Map(restaurants.map(r=>[r.cuisine[0],cuisine(r)])))],params.get('cuisine'))}</select></label><label>${tr('Demo distinction','Distinzione dimostrativa')}<select name="level">${options([['',tr('Any level','Tutti i livelli')],...['1','2','3'].map(n=>[n,n])],params.get('level'))}</select></label><label>${tr('Price below (€)','Prezzo sotto (€)')}<input name="max" type="number" min="1" value="${esc(params.get('max')||'')}"></label><label>${tr('Sort','Ordina')}<select name="sort">${options([['',tr('Featured','In evidenza')],['price',tr('Lowest price','Prezzo crescente')],['high',tr('Highest price','Prezzo decrescente')],['name',tr('Name','Nome')]],params.get('sort'))}</select></label><label class="row"><input class="check" name="rooms" type="checkbox" value="1" ${params.has('rooms')?'checked':''}> ${tr('With rooms','Con camere')}</label><button class="primary">${tr('Apply filters','Applica filtri')}</button>${link('restaurants',tr('Reset','Azzera'),'btn topline')}</form><div><div class="row"><output id="count" aria-live="polite"></output><a class="btn" data-compare-link href="${compareUrl()}"></a></div><div class="grid results" id="results"></div></div></div>`)
 const filter=document.querySelector('#filters')
 const update=()=>{
 const f=new FormData(filter), q=normalize(String(f.get('q')).trim()), sort=f.get('sort')
 const matches=restaurants.filter(r=>(!q||normalize([r.name,...r.city.slice(0,4),...r.cuisine].join(' ')).includes(q))&&(!f.get('city')||r.city[4]===f.get('city'))&&(!f.get('cuisine')||r.cuisine[0]===f.get('cuisine'))&&(!f.get('level')||r.level===Number(f.get('level')))&&(!f.get('max')||r.price<Number(f.get('max')))&&(!f.get('rooms')||r.rooms))
 if(sort==='price')matches.sort((a,b)=>a.price-b.price)
 if(sort==='high')matches.sort((a,b)=>b.price-a.price)
 if(sort==='name')matches.sort((a,b)=>a.name.localeCompare(b.name,locale))
 document.querySelector('#count').textContent=matches.length+' '+tr('results','risultati')
 document.querySelector('#results').innerHTML=matches.map(restCard).join('')||notice(tr('No results. Try removing a filter.','Nessun risultato. Prova a rimuovere un filtro.'))
 }
 filter.addEventListener('submit',e=>{e.preventDefault();const p=new URLSearchParams([...new FormData(filter)].filter(([,v])=>v));history.replaceState({},'',url('restaurants')+'?'+p);update()})
 filter.addEventListener('change',()=>filter.requestSubmit()); update()
}
const fallback=tr('This service is not configured yet.','Il servizio non è ancora configurato.')
const articleText={
  wine:tr('Start with the rhythm of the meal. Ask which wines accompany several courses, how large the pours are and whether the restaurant offers an alcohol-free pairing. This makes it easier to compare an included pairing with one sold separately.','Parti dal ritmo della cena. Chiedi quali vini accompagnano più portate, quanto sono abbondanti i calici e se esiste un percorso analcolico. Potrai così confrontare abbinamenti inclusi e supplementi.'),
  menus:tr('Compare the number of courses, what the price includes and the restaurant’s policy on dietary adaptations. Check the date of the menu and ask whether a shorter lunch menu is available.','Confronta il numero di portate, cosa include il prezzo e quali adattamenti prevede il ristorante. Controlla la data del menù e chiedi se a pranzo è disponibile un percorso più breve.')
}
function profile(){
 const r=restaurants.find(x=>x.slug===slug)
 if(!r){missing();return}
 const gallery=[r.image,'tasting','dining']
 const labels=[tr('Main photo','Immagine principale'),tr('Tasting menu','Menù degustazione'),tr('Dining room','Sala')]
 const prices=[[tr('Lunch menu','Menù pranzo'),null],[tr('Dinner tasting menu','Menù degustazione cena'),fmt(r.price)],[tr('Wine pairing','Abbinamento vini'),null],[tr('Combined experience','Esperienza completa'),null]]
 page(r.name,`<p class="lead profile-intro">${cityName(r.city)}, ${country(r.city)} · ${cuisine(r)} · <span class="tag">${level(r.level)}</span></p>${notice(demoNotice)}
 <div class="gallery">${gallery.map((img,i)=>`<button type="button" data-gallery="${i}" aria-label="${labels[i]}">${photo(img,labels[i],i===0)}</button>`).join('')}</div>
 <div class="split topline"><div><h2>${tr('Menus and prices','Menù e prezzi')}</h2><div class="price-grid">${prices.map(([label,value])=>`<div>${label}<strong>${value||'—'}</strong><span class="tag">${value?demo:tr('Missing','Dato assente')}</span></div>`).join('')}</div></div>
 <div class="filters"><h2>${tr('Plan your visit','Organizza la visita')}</h2><p>${tr('Reservations are unavailable for demo listings.','Le schede dimostrative non accettano prenotazioni.')}</p><div class="row"><button data-save="${r.slug}" aria-pressed="${saved.includes(r.slug)}">${tr('Save','Salva')}</button><label><input type="checkbox" class="check" data-compare="${r.slug}" ${chosen.includes(r.slug)?'checked':''}> ${title('compare')}</label><a class="btn" data-compare-link href="${compareUrl()}"></a>${link('concierge',tr('Plan an itinerary','Crea un itinerario'),'btn')}</div></div></div>
 <h2 class="topline">${tr('Explore nearby','Esplora nei dintorni')}</h2><div class="grid">${restaurants.filter(x=>x.city===r.city&&x!==r).map(restCard).join('')}</div>
 <dialog class="gallery-view"><form method="dialog"><button aria-label="${tr('Close','Chiudi')}">×</button></form><div></div></dialog>`)
 const viewer=main.querySelector('.gallery-view')
 main.querySelectorAll('[data-gallery]').forEach(btn=>btn.onclick=()=>{
   const i=Number(btn.dataset.gallery)
   viewer.querySelector('div').innerHTML=photo(gallery[i],labels[i],true)
   viewer.showModal()
 })
}
function renderConcierge(){
 const cityOptions=cities.map(c=>`<option value="${c[4]}">${cityName(c)}</option>`).join('')
 page(tr('Culinary itinerary planner','Pianifica un itinerario gastronomico'),`<p class="lead">${tr('Build a draft from the demo catalogue. Final prices and availability require independent confirmation.','Crea una bozza dal catalogo demo. Prezzi finali e disponibilità vanno verificati separatamente.')}</p><form id="planner" class="details"><div class="row"><label>${tr('Destination','Destinazione')}<select name="city">${cityOptions}</select></label><label>${tr('Guests','Ospiti')}<input type="number" min="1" max="20" name="guests" value="2" required></label><label>${tr('Budget per guest (€)','Budget a persona (€)')}<input type="number" min="1" max="10000" name="budget" value="150" required></label><label>${tr('Date (optional)','Data (facoltativa)')}<input type="date" name="date"></label></div><button class="primary">${tr('Build itinerary','Crea itinerario')}</button></form><section id="plan-results" aria-live="polite"></section>`)
 const form=main.querySelector('#planner'), result=main.querySelector('#plan-results')
 form.addEventListener('submit',e=>{
   e.preventDefault()
   const f=new FormData(form), guests=Number(f.get('guests')), budget=Number(f.get('budget')), city=cities.find(c=>c[4]===f.get('city'))
   const options=restaurants.filter(r=>r.city===city&&r.price<=budget).sort((a,b)=>a.price-b.price)
   const date=String(f.get('date'))
   const localizedDate=date ? new Intl.DateTimeFormat(locale,{dateStyle:'long',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z')) : ''
   result.innerHTML=`<h2>${cityName(city)}${localizedDate?' · '+localizedDate:''}</h2>${notice(demoNotice)}`+(options.length?`<div class="grid">${options.map(r=>`<div>${restCard(r)}<p>${tr('Illustrative group total','Totale indicativo per il gruppo')}: ${fmt(r.price*guests)}</p></div>`).join('')}</div>`:notice(tr('No demo options within this budget.','Nessuna proposta demo per questo budget.')))
 })
}
function comparison(){
 const slugs=params.has('r')?[...new Set(params.get('r').split(','))].slice(0,4):chosen
 const records=slugs.map(s=>restaurants.find(r=>r.slug===s)).filter(Boolean)
 if(!records.length){page(title('compare'),notice(tr('Select up to four restaurants from the directory.','Seleziona fino a quattro ristoranti dalla directory.'))+more('restaurants',title('restaurants')));return}
 const rows=[[tr('City','Città'),r=>cityName(r.city)],[tr('Cuisine','Cucina'),cuisine],[tr('Distinction','Distinzione'),r=>level(r.level)],[tr('Tasting menu','Menù degustazione'),r=>fmt(r.price)],[tr('Rooms','Camere'),r=>r.rooms?tr('Yes','Sì'):tr('No','No')]]
 page(title('compare'),`${notice(demoNotice)}<div class="compare"><table><thead><tr><th scope="col">${tr('Details','Dettagli')}</th>${records.map(r=>'<th scope="col">'+link('restaurant/'+r.slug,r.name)+'</th>').join('')}</tr></thead><tbody>${rows.map(([label,get])=>'<tr><th scope="row">'+label+'</th>'+records.map(r=>'<td>'+get(r)+'</td>').join('')+'</tr>').join('')}</tbody></table></div><div class="row"><button id="share">${tr('Copy comparison link','Copia il link del confronto')}</button>${more('restaurants',title('restaurants'))}</div><output id="share-status" aria-live="polite"></output>`)
 document.querySelector('#share').onclick=async()=>{const href=new URL(compareUrl(records.map(r=>r.slug)),location.origin).href;const out=document.querySelector('#share-status');try{await navigator.clipboard.writeText(href);out.textContent=tr('Link copied','Link copiato')}catch{out.textContent=href}}
}
function missing(){page(tr('Page not found','Pagina non trovata'),`<div class="row">${more('',tr('Return home','Torna alla homepage'))}${more('destinations',title('destinations'))}</div>`)}
switch(route){
 case '':home();break
 case 'restaurants':directory();break
 case 'restaurant':profile();break
 case 'destinations':page(title(route),`<div class="grid cities topline">${cities.map(cityCard).join('')}</div>`);break
 case 'favorites':page(title(route),notice(saved.length?demoNotice:tr('Your saved restaurants appear here.','Qui troverai i ristoranti che salvi.'))+`<div class="grid">${restaurants.filter(r=>saved.includes(r.slug)).map(restCard).join('')}</div>`+more('restaurants',title('restaurants')));break
 case 'compare':comparison();break
 case 'experiences':page(slug?tr('Last-minute tables','Tavoli dell’ultimo minuto'):title(route),slug?notice(tr('Live availability is awaiting partner integration.','La disponibilità in tempo reale è in attesa dell’integrazione con i partner.')):`<div class="grid two topline">${experienceCards()}</div>`);break
 case 'hotels':page(title(route),`<div class="wide topline">${photo('dining')}</div>${notice(tr('Verified stays and partner booking links are pending.','I soggiorni verificati e i link di prenotazione sono in attesa di attivazione.'))}<a class="btn" href="${query('rooms','1')}">${tr('Browse demo restaurants with rooms','Esplora i ristoranti demo con camere')}</a>`);break
 case 'travel':page(slug?tr('A gastronomic journey through Tuscany','Un viaggio gastronomico in Toscana'):title(route),slug?`<div class="wide topline">${photo('tuscany')}</div><p class="lead">${tr('A self-guided itinerary idea for three days.','Un’idea di itinerario autonomo per tre giorni.')}</p><ol><li>${tr('Florence · Explore a food market and try seasonal Tuscan dishes.','Firenze · Esplora un mercato alimentare e assaggia la cucina toscana di stagione.')}</li><li>${tr('Chianti · Explore wine villages and contact estates about tastings.','Chianti · Esplora i borghi del vino e contatta le tenute per le degustazioni.')}</li><li>${tr('Val d’Orcia · Walk through Pienza and look for local pecorino.','Val d’Orcia · Passeggia per Pienza e cerca il pecorino locale.')}</li></ol>`:travelCard());break
 case 'magazine':page(slug?tr(slug==='wine'?'How to read a wine pairing':'How to compare tasting menus',slug==='wine'?'Come leggere un abbinamento vini':'Come confrontare i menù degustazione'):title(route),slug?`<div class="wide topline">${photo(slug==='wine'?'wine':'plate2')}</div><p class="lead">${articleText[slug]||''}</p>`:`<div class="grid two topline">${card('wine',tr('How to read a wine pairing','Come leggere un abbinamento vini'),tr('Wine','Vino'),url('magazine/wine'))}${card('plate2',tr('How to compare tasting menus','Come confrontare i menù degustazione'),tr('Guide','Guida'),url('magazine/menus'))}</div>`);break
 case 'price-index':page(title(route),notice(tr('Not enough verified data.','Dati verificati insufficienti.'))+more('methodology',title('methodology')));break
 case 'methodology':page(title(route),`<p class="lead">${tr('The Price Index requires at least five verified observations per group. Demo prices are excluded. Published figures should include the date, sample size and source.','L’indice richiede almeno cinque rilevazioni verificate per gruppo. I prezzi dimostrativi sono esclusi. Le cifre pubblicate devono riportare data, campione e fonte.')}</p>`);break
 case 'legal':page(title(route),`<p class="lead">${tr('This demo stores favourites and comparison choices in your browser. A shared comparison link includes the selected demo listings.','Questa demo salva preferiti e confronti nel tuo browser. Un link di confronto condiviso contiene le schede dimostrative selezionate.')}</p><button id="clear-data">${tr('Clear local preferences','Cancella le preferenze locali')}</button>`);document.querySelector('#clear-data').onclick=()=>{localStorage.removeItem('atlas-saves');localStorage.removeItem('atlas-compare');location.reload()};break
 case 'about':page(title(route),`<p class="lead">${tr('An independent editorial guide to fine dining and culinary travel. The current restaurant catalogue is illustrative.','Una guida editoriale indipendente al fine dining e ai viaggi gastronomici. Il catalogo attuale dei ristoranti è dimostrativo.')}</p>`);break
 case 'concierge':renderConcierge();break
 case 'club':case 'gifts':case 'account':case 'business':page(title(route),notice(fallback));break
 default:missing()
}
const updateCounts=()=>{
 document.querySelectorAll('[data-saved]').forEach(x=>x.textContent=saved.length||'')
 document.querySelectorAll('[data-compare-link]').forEach(x=>{x.href=compareUrl();x.textContent=title('compare')+' ('+chosen.length+')'})
}
updateCounts()
document.addEventListener('click',e=>{
 const save=e.target.closest('[data-save]')
 if(save){
 const id=save.dataset.save; saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id]
 localStorage.setItem('atlas-saves',JSON.stringify(saved))
 if(route==='favorites'){location.reload();return}
 document.querySelectorAll('[data-save]').forEach(x=>{const active=saved.includes(x.dataset.save);x.setAttribute('aria-pressed',String(active));if(x.classList.contains('save'))x.textContent=active?'♥':'♡'})
 updateCounts()
 }
 const tab=e.target.closest('[data-level]')
 if(tab){document.querySelectorAll('[data-level]').forEach(x=>x.setAttribute('aria-pressed',String(x===tab)));featured(Number(tab.dataset.level))}
})
document.addEventListener('change',e=>{
 const id=e.target.dataset.compare
 if(!id)return
 if(e.target.checked&&chosen.length>=4){e.target.checked=false;e.target.setCustomValidity(tr('Choose up to four restaurants.','Puoi scegliere fino a quattro ristoranti.'));e.target.reportValidity();e.target.setCustomValidity('');return}
 chosen=e.target.checked?[...new Set([...chosen,id])]:chosen.filter(x=>x!==id)
 localStorage.setItem('atlas-compare',JSON.stringify(chosen))
 updateCounts()
})
const dialog=document.querySelector('#finder')
dialog.innerHTML=`<div class="heading"><h2>${tr('Search','Cerca')}</h2><form method="dialog"><button aria-label="${tr('Close','Chiudi')}">×</button></form></div><form action="${url('restaurants')}"><input name="q" aria-label="${tr('Search restaurants and destinations','Cerca ristoranti e destinazioni')}" placeholder="${tr('Restaurant or city','Ristorante o città')}" autofocus><button class="primary">${tr('Search','Cerca')}</button></form><div id="suggestions"></div>`
const finder=dialog.querySelector('input'), suggestions=dialog.querySelector('#suggestions')
function suggest(){
 const q=finder.value.trim().toLowerCase()
 suggestions.innerHTML=cities.filter(c=>c.slice(0,4).some(v=>v.toLowerCase().includes(q))).slice(0,5).map(c=>`<p class="topline">${link('restaurants/'+c[4],cityName(c),'more')}</p>`).join('')+(q?restaurants.filter(r=>r.name.toLowerCase().includes(q)).slice(0,4).map(r=>`<p class="topline">${link('restaurant/'+r.slug,r.name,'more')}</p>`).join(''):'')
}
finder.addEventListener('input',suggest)
const openFinder=()=>{suggest();if(!dialog.open)dialog.showModal()}
document.querySelector('[data-finder]').onclick=openFinder
document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.target.matches('input,textarea,[contenteditable]')){e.preventDefault();openFinder()}})
