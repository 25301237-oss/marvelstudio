'use strict';
const $ = s => document.querySelector(s);
const card = (m, i) => `<article class="movie-card reveal" tabindex="0" role="button" data-image="${
    m.imagen
}"
 data-title="${m.titulo.replaceAll('"','&quot;')

}" 
 aria-label="Ampliar póster de ${
    m.titulo
}">
 <div class="poster-frame">
 <img src="${
    m.imagen
}"
 alt="Póster de ${
    m.titulo
}
" loading="lazy"></div>
 <div class="movie-info">
 <h3>${m.titulo}</h3>
 <p><span class="number">${
    String(i+1).padStart(2,'0')
}
</span> ${
    m.anio
}
 · Película</p>
 </div></article>`;
function animate(){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>
{
    if(e.isIntersecting){
        e.target.classList.add('visible');
    observer.unobserve(e.target)}}),{threshold:.08});
    document.querySelectorAll('.reveal:not(.visible)')
    .forEach(el=>observer.observe(el))
}
function renderCards(target,movies){
    target.innerHTML=movies
    .map((m,i)=>card(m,i))
    .join('');
    animate()
}
const featured=$('#destacadas');
if(featured)renderCards(featured,[PELICULAS[6],PELICULAS[21],PELICULAS[22],PELICULAS[26]]);
const catalog=$('#catalogo');
if(catalog){
    const search=$('#buscador'),year=$('#filtro');
    [...new Set(PELICULAS.
        map(m=>m.anio))]
        .sort((a,b)=>a-b)
        .forEach(y=>year.add(new Option(y,y)));
    function filter(){const q=search.value.trim()
        .toLocaleLowerCase('es');
    const list=PELICULAS.filter(m=>m.titulo.toLocaleLowerCase('es')
    .includes(q)&&(!year.value||m.anio===Number(year.value)));
    renderCards(catalog,list);
    $('#contador').textContent=`${list.length} de ${PELICULAS.length} películas`;
}search.addEventListener('input',filter);
year.addEventListener('change',filter);
filter()
}
const timeline=$('#lineaTiempo');
if(timeline){
    timeline.innerHTML=PELICULAS.map((m,i)=>`<article class="timeline-item reveal">
    <span class="timeline-dot">
    ${String(i+1).padStart(2,'0')}</span>
    <div class="timeline-content" role="button" tabindex="0" data-image="${m.imagen}" data-title="
    ${m.titulo}">
    <img src="${m.imagen}" loading="lazy" alt="Póster de ${m.titulo}">
    <div><h3>${m.titulo}</h3>
    <p>Estreno: ${m.anio}</p>
    </div></div></article>`).join('');animate()
}
const characters=$('#personajes');
if(characters)
{
    const ids=[1,3,6,17,18,19,20,25,27,29,34,37];
    renderCards(characters,ids.map(i=>PELICULAS.find(m=>m.id===i)))
}
const form=$('#formFavorita');
if(form)
{
    const select=$('#pelicula');
    PELICULAS.forEach(m=>select.add(new Option(m.titulo,m.titulo)));
    function last(){try{const d=JSON.parse(localStorage.getItem('marvelFavorita'));
        if(d)$('#ultimaRespuesta')
        .textContent=`Última elección: ${d.pelicula} 
    · ${'★'.repeat(d.calificacion)} 
    · Gracias, ${d.nombre}.`;
}catch{}}last();
form.addEventListener('submit',e=>{e.preventDefault();
    if(!form.reportValidity())return;
    const d={nombre:$('#nombre')
        .value.trim(),correo:$('#correo')
        .value.trim(),pelicula:select
        .value,calificacion:Number($('#calificacion').value),razon:$('#razon')
        .value.trim()};try{localStorage.setItem('marvelFavorita',JSON.stringify(d));
            last();
            form.reset()}
            catch{$('#ultimaRespuesta')
                .textContent='No se pudo guardar la respuesta en este navegador.'}})}
const box=$('#lightbox');
function close(){
    box.hidden=true;
    document.body.style.overflow=''
}
document.addEventListener('click',e=>{const item=e.target.closest('[data-image]');
    if(item){box.querySelector('img')
        .src=item.dataset.image;box.querySelector('img').alt=item.dataset.title;
    box.querySelector('p').textContent=item.dataset.title;
    box.hidden=false;
    document.body.style.overflow='hidden'}if(e.target===box||e.target.closest('.close-lightbox'))close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();
        if((e.key==='Enter'||e.key===' ')&&document.activeElement.matches('[data-image]')){
            e.preventDefault();
            document.activeElement.click()}});
const menu=$('.menu-toggle');
menu.addEventListener('click',()=>{const open=$('.nav-links')
    .classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
    animate();
