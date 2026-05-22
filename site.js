function toggleMobileNav() {
  document.getElementById("mobile-nav").classList.toggle("open");
  document.body.style.overflow = document.getElementById("mobile-nav").classList.contains("open") ? "hidden" : "";
}
function closeMobileNav() {
  var nav = document.getElementById("mobile-nav");
  if (nav) nav.classList.remove("open");
  document.body.style.overflow = "";
}

function loadBrandLogo() {
  fetch("catalog.html")
    .then(function (r) { return r.text(); })
    .then(function (html) {
      var m = html.match(/src="(data:image\/png;base64,[^"]+)"/);
      if (!m) return;
      document.querySelectorAll("[data-brand-logo]").forEach(function (img) {
        img.src = m[1];
        img.style.display = "block";
      });
      document.querySelectorAll("[data-brand-text]").forEach(function (el) {
        el.style.display = "none";
      });
    })
    .catch(function () {});
}

function initReveal() {
  var els = document.querySelectorAll(".reveal");
  if (!els.length || !("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach(function (el) { io.observe(el); });
}

function initCounters() {
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var started = false;
    function run() {
      if (started) return;
      started = true;
      var dur = 1400;
      var t0 = performance.now();
      function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * ease) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { run(); io.disconnect(); }
      }, { threshold: 0.5 });
      io.observe(el);
    } else run();
  });
}

/* Vehicle OEM brands (spell-checked) */
var VEHICLE_BRANDS = [
  { name: "Audi", icon: "https://cdn.simpleicons.org/audi/BB0A30", color: "#BB0A30" },
  { name: "Mercedes-Benz", icon: "https://cdn.simpleicons.org/mercedes/242424", color: "#242424" },
  { name: "BMW", icon: "https://cdn.simpleicons.org/bmw/0066B1", color: "#0066B1" },
  { name: "Land Rover", icon: "https://cdn.simpleicons.org/landrover/005A2B", color: "#005A2B" },
  { name: "Toyota", icon: "https://cdn.simpleicons.org/toyota/EB0A1E", color: "#EB0A1E" },
  { name: "Honda", icon: "https://cdn.simpleicons.org/honda/CC0000", color: "#CC0000" },
  { name: "Nissan", icon: "https://cdn.simpleicons.org/nissan/C3002F", color: "#C3002F" },
  { name: "Hyundai", icon: "https://cdn.simpleicons.org/hyundai/002C5F", color: "#002C5F" },
  { name: "Kia", icon: "https://cdn.simpleicons.org/kia/05141F", color: "#05141F" },
  { name: "Tata", icon: "https://cdn.simpleicons.org/tata/486AAE", color: "#486AAE" },
  { name: "Mahindra", icon: "https://cdn.simpleicons.org/mahindra/DD052B", color: "#DD052B" },
  { name: "Bajaj", icon: "https://cdn.simpleicons.org/bajaj/0066B3", color: "#0066B3" },
  {
    name: "Maruti Suzuki",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Maruti_Suzuki_logo.svg/256px-Maruti_Suzuki_logo.svg.png",
    color: "#2E3192"
  },
  {
    name: "Ashok Leyland",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ashok_Leyland_Logo.svg/256px-Ashok_Leyland_Logo.svg.png",
    color: "#003DA5"
  },
  {
    name: "BharatBenz",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/BharatBenz_logo.svg/256px-BharatBenz_logo.svg.png",
    color: "#1A1A1A"
  },
  {
    name: "Eicher",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Eicher_Motors_logo.svg/256px-Eicher_Motors_logo.svg.png",
    color: "#ED1C24"
  },
  { name: "MG", icon: "https://cdn.simpleicons.org/mg/FF0000", color: "#FF0000" },
  { name: "Jaguar", icon: "https://cdn.simpleicons.org/jaguar/000000", color: "#000000" },
  { name: "Ford", icon: "https://cdn.simpleicons.org/ford/00274E", color: "#00274E" },
  { name: "Chevrolet", icon: "https://cdn.simpleicons.org/chevrolet/CD9834", color: "#CD9834" },
  { name: "Volkswagen", icon: "https://cdn.simpleicons.org/volkswagen/151F5D", color: "#151F5D" },
  { name: "Skoda", icon: "https://cdn.simpleicons.org/skoda/4BA82E", color: "#4BA82E" },
  { name: "JCB", icon: "https://cdn.simpleicons.org/jcb/FCB026", color: "#FCB026" },
  {
    name: "Komatsu",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Komatsu_logo.svg/256px-Komatsu_logo.svg.png",
    color: "#140A9A"
  },
  { name: "Piaggio Ape", icon: "https://cdn.simpleicons.org/piaggio/0D4B87", color: "#0D4B87" }
];

function onBrandImgError(img) {
  img.style.display = "none";
  var mono = img.parentElement.querySelector(".vehicle-brand-mono");
  if (mono) mono.style.display = "flex";
}

function buildVehicleBrandChip(brand) {
  var mono = brand.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  if (brand.name.indexOf("Maruti") === 0) mono = "MS";
  if (brand.name === "MG") mono = "MG";
  if (brand.name.indexOf("Piaggio") === 0) mono = "AP";
  var chip = document.createElement("div");
  chip.className = "vehicle-brand-chip";
  chip.setAttribute("title", brand.name);
  var iconWrap = document.createElement("div");
  iconWrap.className = "vehicle-brand-icon";
  iconWrap.style.setProperty("--brand-color", brand.color || "#b8860b");
  if (brand.icon) {
    var img = document.createElement("img");
    img.className = "vehicle-brand-img";
    img.src = brand.icon;
    img.alt = brand.name + " logo";
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.onerror = function () { onBrandImgError(img); };
    iconWrap.appendChild(img);
  }
  var monoEl = document.createElement("span");
  monoEl.className = "vehicle-brand-mono";
  monoEl.textContent = mono;
  if (!brand.icon) monoEl.style.display = "flex";
  iconWrap.appendChild(monoEl);
  var label = document.createElement("span");
  label.className = "vehicle-brand-name";
  label.textContent = brand.name;
  chip.appendChild(iconWrap);
  chip.appendChild(label);
  return chip;
}

function initBrandsMarquee() {
  document.querySelectorAll("[data-brands-track]").forEach(function (track) {
    if (track.dataset.built) return;
    track.dataset.built = "1";
    var row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "20px";
    VEHICLE_BRANDS.forEach(function (b) {
      row.appendChild(buildVehicleBrandChip(b));
    });
    var clone = row.cloneNode(true);
    track.appendChild(row);
    track.appendChild(clone);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadBrandLogo();
  initReveal();
  initCounters();
  initBrandsMarquee();
});
