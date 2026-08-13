/* main.js: loads pois.json and displays markers + list with client-side search */
let map = L.map('map').setView([37.7749, -122.4194], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let markers = [];
let pois = [];

const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const clearBtn = document.getElementById('clear');

function renderList(items){
  listEl.innerHTML = '';
  items.forEach(p => {
    const el = document.createElement('div');
    el.className = 'poi';
    el.innerHTML = `<h3>${p.name}</h3><p>${p.category || ''} — ${p.description || ''}</p><p style=\"font-size:0.85rem;color:#555\">${p.address || ''}</p>`;
    el.addEventListener('click', ()=>{
      map.setView([p.lat,p.lon],16);
    });
    listEl.appendChild(el);
  });
}

function clearMarkers(){
  markers.forEach(m=>map.removeLayer(m));
  markers = [];
}

function addMarkers(items){
  clearMarkers();
  items.forEach(p=>{
    const m = L.marker([p.lat,p.lon]).addTo(map).bindPopup(`<b>${p.name}</b><br>${p.category || ''}`);
    markers.push(m);
  });
}

function applyFilter(){
  const q = searchEl.value.trim().toLowerCase();
  if(!q){
    renderList(pois);
    addMarkers(pois);
    return;
  }
  const filtered = pois.filter(p=>{
    return (p.name && p.name.toLowerCase().includes(q)) || (p.category && p.category.toLowerCase().includes(q)) || (p.description && p.description.toLowerCase().includes(q));
  });
  renderList(filtered);
  addMarkers(filtered);
}

clearBtn.addEventListener('click', ()=>{searchEl.value='';applyFilter();});
searchEl.addEventListener('input', applyFilter);

fetch('pois.json').then(r=>r.json()).then(data=>{
  pois = data;
  if(pois.length){
    const first = pois[0];
    map.setView([first.lat, first.lon],13);
  }
  renderList(pois);
  addMarkers(pois);
}).catch(e=>{
  listEl.innerHTML = '<p style="color:red">Failed to load POIs.</p>'
});
