const PRICE = {
  vaultSewa: 1000,
  vaultBeli: 2500,
  custom: 1000,
  beauty: 1000,
};

const TEMPLATES = [
  { id: "tv01", name: "Pitch Terracotta", cat: "pitch", slides: 12, blurb: "Deck startup hangat untuk investor yang capek slide biru." },
  { id: "tv02", name: "Laporan Olive", cat: "bisnis", slides: 10, blurb: "Laporan bulanan rapi: KPI, catatan, next step." },
  { id: "tv03", name: "Skripsi Tenang", cat: "akademik", slides: 15, blurb: "Sidang yang terasa serius tanpa kaku. Hierarki baca jelas." },
  { id: "tv04", name: "Lookbook Event", cat: "event", slides: 8, blurb: "Rundown, guest, mood. Cocok launching dan gathering." },
  { id: "tv05", name: "Company Ink", cat: "bisnis", slides: 14, blurb: "Profil perusahaan editorial: cerita, tim, bukti kerja." },
  { id: "tv06", name: "Proposal Teal", cat: "bisnis", slides: 11, blurb: "Proposal kerja sama yang tidak menyerupai surat dinas." },
  { id: "tv07", name: "Seminar Gold", cat: "akademik", slides: 18, blurb: "Materi kuliah/seminar: judul kuat, kutipan, diagram longgar." },
  { id: "tv08", name: "Seed Story", cat: "pitch", slides: 10, blurb: "Masalah → solusi → traksi. Ringkas untuk 8 menit." },
  { id: "tv09", name: "Rapat Q-Board", cat: "bisnis", slides: 9, blurb: "Board meeting: agenda, keputusan, risiko." },
  { id: "tv10", name: "PKM / Lomba", cat: "akademik", slides: 13, blurb: "Presentasi kompetisi mahasiswa. Visual berani, isi tetap akademik." },
  { id: "tv11", name: "Wedding Brief", cat: "event", slides: 7, blurb: "Mood, vendor, rundown. Estetik tanpa berlebihan." },
  { id: "tv12", name: "Campaign Burst", cat: "pitch", slides: 12, blurb: "Pitch kampanye brand: insight, konsep, timeline." },
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
    const okCat = filter === "all" || t.cat === filter;
    const q = query.trim().toLowerCase();
    const okQ = !q || t.name.toLowerCase().includes(q) || t.blurb.toLowerCase().includes(q) || t.cat.includes(q);
    return okCat && okQ;
  });
  if (!list.length) {
    root.innerHTML = `<p class="empty">Tidak ada template dengan filter itu. Coba kata lain.</p>`;
    return;
  }
  root.innerHTML = list.map((t, i) => `
    <article class="card">
      <div class="preview"><div class="mini" style="${previewStyle(i)}">
        <small>${t.cat}</small>
        <strong>${t.slides} slide</strong>
      </div></div>
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
  `).join("");
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
    price: unit * t.slides,
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
  $("modalPanel").innerHTML = `
    <header>
      <h2>${t.name}</h2>
      <button type="button" class="icon-x" id="closeModal" aria-label="Tutup">✕</button>
    </header>
    <div class="modal-preview" style="${previewStyle(i)}">${t.cat} · ${t.slides} halaman</div>
    <p>${t.blurb}</p>
    <p class="meta" style="margin-top:8px">Termasuk file PPTX, palet, dan catatan pairing font. Sewa berlaku 7 hari sejak pengiriman.</p>
    <div class="modal-actions">
      <button class="btn btn-olive" type="button" data-add="${t.id}" data-mode="sewa">Sewa ${rupiah(sewa)}</button>
      <button class="btn btn-clay" type="button" data-add="${t.id}" data-mode="beli">Beli ${rupiah(beli)}</button>
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
    ? cart.map((x) => `- ${x.name} (${x.mode}, ${x.slides} slide) ${rupiah(x.price)}`).join("\n")
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
