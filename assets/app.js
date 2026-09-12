const PRICE = {
  vaultSewa: 500,
  vaultBeli: 1500,
  custom: 1000,
  beauty: 1000,
};

const TEMPLATES = [
  { 
    id: "tv01", 
    name: "Template Mode Gelap", 
    cat: "simpel bebas", 
    slides: 12, 
    blurb: "Simpel bebas, cocok untuk presentasi modern bernuansa gelap.", 
    link: "https://docs.google.com/presentation/d/1z_zxlLjWh_Otb9f6OQnopv_yDRDvWLZx/edit?usp=drive_link&ouid=103576608868124956432&rtpof=true&sd=true",
    image: "assets/Screenshot 2026-09-12 225858.png" 
  },
  { 
    id: "tv02", 
    name: "Presentasi Kelas Interaktif", 
    cat: "edukasi", 
    slides: 10, 
    blurb: "Materi edukasi interaktif untuk kegiatan belajar mengajar.", 
    link: "https://docs.google.com/presentation/d/1IQpnDskK6kZFZiF-gIxODye-a6Jn9j0j/edit?usp=drive_link&ouid=103576608868124956432&rtpof=true&sd=true",
    image: "assets/Screenshot 2026-09-12 222825.png"
  },
  { 
    id: "tv03", 
    name: "Edukasi Kreatif & Inovatif", 
    cat: "edukasi", 
    slides: 12, 
    blurb: "Poster & materi edukasi dengan pendekatan visual yang segar.", 
    link: "https://docs.google.com/presentation/d/12m4Lrs9MdlzPPim0dLmjahQS6q2xvoFt/edit?usp=drive_link&ouid=103576608868124956432&rtpof=true&sd=true",
    image: "assets/Screenshot 2026-09-12 222710.png"
  },
  { 
    id: "tv04", 
    name: "Presentasi Bisnis Modern", 
    cat: "bisnis", 
    slides: 14, 
    blurb: "Deck profesional untuk strategi ekspansi dan korporasi.", 
    link: "https://docs.google.com/presentation/d/1T1s7K8EDd6toD3RsuXd5gYdk5tMU2zyo/edit?usp=drive_link&ouid=103576608868124956432&rtpof=true&sd=true",
    image: "assets/Screenshot 2026-09-12 225219.png"
  },
  { 
    id: "tv05", 
    name: "Strategi Pertumbuhan Berkelanjutan", 
    cat: "bisnis", 
    slides: 15, 
    blurb: "Laporan bisnis mendalam dengan fokus pada efisiensi & inovasi.", 
    link: "https://docs.google.com/presentation/d/1PC6rP-Gu1xg9WvO_cfjsSCxDmYNmMNyX/edit?usp=drive_link&ouid=103576608868124956432&rtpof=true&sd=true",
    image: "assets/Screenshot 2026-09-12 225334.png"
  }
];

const PALETTES = [
  ["#c45c3e", "#e7b39a", "#1c1714"],
  ["#5f7348", "#d9c4a6", "#2f4338"],
  ["#3a6d6a", "#7d9aa6", "#f4efe8"],
  ["#c4a35a", "#1c1714", "#e2b7a8"],
  ["#9a4030", "#f4efe8", "#3a322c"],
  ["#2f4338", "#c4a35a", "#efe4d2"],
];

const LYNK = "https://lynk.id/BukanSekedarSlide";
const cartKey = "bss-cart";

const $ = (id) => document.getElementById(id);
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");

function loadCart() {
  try { return JSON.parse(localStorage.getItem(cartKey)) || []; }
  catch { return []; }
}
function saveCart(items) {
  localStorage.setItem(cartKey, JSON.stringify(items));
  renderCart();
  if ($("layananSelect")) estimate();
}

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.hidden = true; }, 2400);
}

function previewStyle(i) {
  const [a, b, c] = PALETTES[i % PALETTES.length];
  return `background: linear-gradient(145deg, ${a}, ${b} 55%, ${c});`;
}

let filter = "all";
let query = "";

function renderCatalog() {
  const root = $("catalog");
  const list = TEMPLATES.filter((t) => {
    const itemCat = t.cat.toLowerCase().trim();
    const currentFilter = filter.toLowerCase().trim();
    
    const okCat = currentFilter === "all" || itemCat === currentFilter;
    const q = query.trim().toLowerCase();
    const okQ = !q || t.name.toLowerCase().includes(q) || t.blurb.toLowerCase().includes(q) || itemCat.includes(q);
    return okCat && okQ;
  });
  if (!list.length) {
    root.innerHTML = `<p class="empty">Tidak ada template dengan filter itu. Coba kata lain.</p>`;
    return;
  }
  root.innerHTML = list.map((t, i) => {
    let previewContent = `
      <div class="mini" style="${previewStyle(i)}">
        <small>${t.cat}</small>
        <strong>${t.slides} slide</strong>
      </div>`;
    if (t.image) {
      previewContent = `
        <img src="${t.image}" alt="${t.name}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent 60%); border-radius: 12px; display: flex; flex-direction: column; justify-content: space-between; padding: 12px; color: white; pointer-events: none;">
          <small style="background: rgba(0,0,0,0.4); padding: 2px 8px; border-radius: 999px; width: max-content; font-size: 11px;">${t.cat}</small>
          <strong style="font-size: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${t.slides} slide</strong>
        </div>`;
    }

    return `
      <article class="card">
        <div class="preview" style="position: relative;">${previewContent}</div>
        <div class="card-body">
          <h3>${t.name}</h3>
          <p class="meta">${t.blurb}</p>
          <p class="meta">Sewa ${rupiah(PRICE.vaultSewa * t.slides)} · Beli ${rupiah(PRICE.vaultBeli * t.slides)}</p>
          <div class="card-actions">
            <button class="btn btn-ghost" type="button" data-detail="${t.id}">Detail</button>
            <button class="btn btn-olive" type="button" data-add="${t.id}" data-mode="sewa">Sewa</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id);
}

function addToCart(id, mode) {
  const t = getTemplate(id);
  if (!t) return;
  const items = loadCart();
  const key = id + "-" + mode;
  if (items.some((x) => x.key === key)) {
    toast("Sudah ada di keranjang.");
    return;
  }
  const unit = mode === "beli" ? PRICE.vaultBeli : PRICE.vaultSewa;
  items.push({
    key, id, mode, name: t.name, slides: t.slides,
    price: unit * t.slides, link: t.link || ""
  });
  saveCart(items);
  toast(`${t.name} (${mode}) masuk keranjang.`);
}

function removeFromCart(key) {
  saveCart(loadCart().filter((x) => x.key !== key));
}

function renderCart() {
  const items = loadCart();
  $("cartCount").textContent = items.length;
  const box = $("cartItems");
  if (!items.length) {
    box.innerHTML = `<p class="empty">Keranjang masih kosong. Ambil template dari Vault.</p>`;
    $("cartTotal").textContent = rupiah(0);
    return;
  }
  box.innerHTML = items.map((x) => `
    <div class="cart-row">
      <div>
        <strong>${x.name}</strong>
        <p class="meta">${x.mode} · ${x.slides} slide</p>
      </div>
      <div>
        <div>${rupiah(x.price)}</div>
        <button type="button" data-remove="${x.key}">hapus</button>
      </div>
    </div>
  `).join("");
  const total = items.reduce((s, x) => s + x.price, 0);
  $("cartTotal").textContent = rupiah(total);
}

function openModal(id) {
  const t = getTemplate(id);
  const i = TEMPLATES.indexOf(t);
  const sewa = PRICE.vaultSewa * t.slides;
  const beli = PRICE.vaultBeli * t.slides;
  const modal = $("modal");
  
  let linkButtonHtml = "";
  if (t.link) {
    linkButtonHtml = `<a class="btn btn-teal" href="${t.link}" target="_blank" rel="noopener">Buka Link Google Drive ↗</a>`;
  }

  let modalPreviewContent = `${t.cat} · ${t.slides} halaman`;
  let modalPreviewStyle = previewStyle(i);
  if (t.image) {
    modalPreviewStyle = `background: url('${t.image}') center/cover no-repeat;`;
    modalPreviewContent = `${t.cat} · ${t.slides} halaman`;
  }

  $("modalPanel").innerHTML = `
    <header>
      <h2>${t.name}</h2>
      <button type="button" class="icon-x" id="closeModal" aria-label="Tutup">✕</button>
    </header>
    <div class="modal-preview" style="${modalPreviewStyle}; display: flex; flex-direction: column; justify-content: space-between; padding: 16px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${modalPreviewContent}</div>
    <p>${t.blurb}</p>
    <p class="meta" style="margin-top:8px">Termasuk file PPTX, palet, dan catatan pairing font. Sewa berlaku 7 hari sejak pengiriman.</p>
    <div class="modal-actions" style="flex-wrap: wrap;">
      <button class="btn btn-olive" type="button" data-add="${t.id}" data-mode="sewa">Sewa ${rupiah(sewa)}</button>
      <button class="btn btn-clay" type="button" data-add="${t.id}" data-mode="beli">Beli ${rupiah(beli)}</button>
      ${linkButtonHtml}
    </div>
  `;
  modal.hidden = false;
}

function estimate() {
  const layanan = $("layananSelect").value;
  const slides = Math.max(1, Number($("slideCount").value) || 1);
  const tenggat = $("tenggatSelect").value;
  let unit = PRICE.custom;
  if (layanan === "beauty") unit = PRICE.beauty;
  if (layanan === "vault") unit = PRICE.vaultSewa;
  let total = unit * slides;
  let hint = `${slides} slide × ${rupiah(unit)}`;
  if (layanan !== "vault" && tenggat === "24") {
    total = Math.round(total * 1.25);
    hint += " + kilat 24 jam (±25%)";
  }
  const cart = loadCart().reduce((s, x) => s + x.price, 0);
  if (cart) {
    total += cart;
    hint += ` + keranjang Vault ${rupiah(cart)}`;
  }
  $("estimateValue").textContent = rupiah(total);
  $("estimateHint").textContent = hint;
  return { total, hint, layanan, slides, tenggat };
}

function orderText(form, est) {
  const data = Object.fromEntries(new FormData(form));
  const labels = { vault: "Template Vault", custom: "Custom Express", beauty: "Beatifying Slide" };
  const cart = loadCart();
  const cartLines = cart.length
    ? cart.map((x) => `- ${x.name} (${x.mode}, ${x.slides} slide) ${rupiah(x.price)} ${x.link ? '-> ' + x.link : ''}`).join("\n")
    : "- (tidak ada)";
  return [
    "Pesanan BukanSekedarSlide (BSS)",
    `Nama: ${data.nama}`,
    `Kontak: ${data.kontak}`,
    `Layanan: ${labels[data.layanan]}`,
    `Jumlah slide: ${data.slides}`,
    `Tenggat: ${data.tenggat}`,
    `Catatan: ${data.catatan || "-"}`,
    "",
    "Keranjang Vault:",
    cartLines,
    "",
    `Estimasi awal: ${rupiah(est.total)}`,
    `(${est.hint})`,
  ].join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
  $("year").textContent = new Date().getFullYear();
  renderCatalog();
  renderCart();
  estimate();

  $("filters").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    filter = btn.dataset.filter;
    $("filters").querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-on", c === btn));
    renderCatalog();
  });

  $("searchInput").addEventListener("input", (e) => {
    query = e.target.value;
    renderCatalog();
  });

  document.body.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) addToCart(add.dataset.add, add.dataset.mode || "sewa");
    const detail = e.target.closest("[data-detail]");
    if (detail) openModal(detail.dataset.detail);
    const rm = e.target.closest("[data-remove]");
    if (rm) removeFromCart(rm.dataset.remove);
    if (e.target.closest("[data-service]")) {
      $("layananSelect").value = e.target.closest("[data-service]").dataset.service;
      estimate();
    }
  });

  $("cartBtn").addEventListener("click", () => { $("cartDrawer").hidden = false; });
  $("closeCart").addEventListener("click", () => { $("cartDrawer").hidden = true; });
  $("checkoutBtn").addEventListener("click", () => { $("cartDrawer").hidden = true; });
  $("cartDrawer").addEventListener("click", (e) => {
    if (e.target.id === "cartDrawer") $("cartDrawer").hidden = true;
  });

  $("modal").addEventListener("click", (e) => {
    if (e.target.id === "modal" || e.target.id === "closeModal") $("modal").hidden = true;
  });

  $("menuBtn").addEventListener("click", () => $("navLinks").classList.toggle("open"));
  $("navLinks").addEventListener("click", () => $("navLinks").classList.remove("open"));

  ["layananSelect", "slideCount", "tenggatSelect"].forEach((id) => {
    $(id).addEventListener("input", estimate);
    $(id).addEventListener("change", estimate);
  });

  $("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const est = estimate();
    const text = orderText(e.target, est);
    navigator.clipboard?.writeText(text).then(
      () => toast("Ringkasan disalin. Membuka Lynk.id…"),
      () => toast("Ringkasan siap. Membuka Lynk.id…")
    );
    window.open(LYNK, "_blank", "noopener");
    console.log(text);
  });
});