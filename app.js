const grid = document.getElementById('galleryGrid');
const heroImage = document.getElementById('heroImage');
let artworks = [];

fetch('/artworks.json')
  .then(r => r.json())
  .then(data => {
    artworks = data.artworks || [];
    if (artworks[0]) heroImage.style.backgroundImage = `url('${artworks[0].image}')`;
    renderGallery();
  })
  .catch(() => grid.innerHTML = '<p>La galerie est en cours de chargement.</p>');

function renderGallery(){
  grid.innerHTML = artworks.map((a,i)=>`
    <article class="art-card" onclick="openArt(${i})">
      <img src="${a.image}" alt="${escapeHtml(a.title)}" loading="lazy">
      <h3>${escapeHtml(a.title)}</h3>
      <p class="meta">${escapeHtml(a.medium || '')}<br>${escapeHtml(a.dimensions || '')}</p>
      <p class="price">${escapeHtml(a.price || 'Prix sur demande')}</p>
    </article>
  `).join('');
}

function openArt(i){
  const a = artworks[i];
  dialogImage.src = a.image;
  dialogImage.alt = a.title;
  dialogCollection.textContent = a.collection || '';
  dialogTitle.textContent = a.title || '';
  dialogMeta.textContent = [a.year, a.medium, a.dimensions, a.status].filter(Boolean).join(' · ');
  dialogDescription.textContent = a.description || '';
  dialogPrice.textContent = a.price || 'Prix sur demande';
  dialogAsk.href = `mailto:sun.pascal09@gmail.com?subject=${encodeURIComponent('Demande pour ' + (a.title || 'une œuvre PASCAL SUN'))}`;
  if(a.paypal_link){ dialogBuy.style.display='inline-flex'; dialogBuy.href=a.paypal_link; }
  else { dialogBuy.style.display='none'; }
  artDialog.showModal();
}

function escapeHtml(str){return String(str).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user && window.location.hash.includes('invite_token')) window.netlifyIdentity.open('signup');
  });
}
