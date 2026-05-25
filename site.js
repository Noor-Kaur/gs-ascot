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
      document.querySelectorAll("[data-hero-wordmark]").forEach(function (el) {
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

/* Vehicle OEM brands — local logos in images/brands/ */
var VEHICLE_BRANDS = [
  { name: "Audi", icon: "images/brands/audi.png", color: "#BB0A30" },
  { name: "Mercedes-Benz", icon: "images/brands/mercedes.png", color: "#242424" },
  { name: "BMW", icon: "images/brands/bmw.png", color: "#0066B1" },
  { name: "Land Rover", icon: "images/brands/land-rover.png", color: "#005A2B" },
  { name: "Toyota", icon: "images/brands/toyota.png", color: "#EB0A1E" },
  { name: "Honda", icon: "images/brands/honda.png", color: "#CC0000" },
  { name: "Nissan", icon: "images/brands/nissan.png", color: "#C3002F" },
  { name: "Hyundai", icon: "images/brands/hyundai.png", color: "#002C5F" },
  { name: "Kia", icon: "images/brands/kia.png", color: "#05141F" },
  { name: "Tata", icon: "images/brands/tata.png", color: "#486AAE" },
  { name: "Mahindra", icon: "images/brands/mahindra.png", color: "#DD052B" },
  { name: "Bajaj", icon: "images/brands/bajaj.svg", color: "#0066B3" },
  { name: "Maruti Suzuki", icon: "images/brands/maruti-suzuki.png", color: "#2E3192" },
  { name: "Ashok Leyland", icon: "images/brands/ashok-leyland.png", color: "#003DA5" },
  { name: "BharatBenz", icon: "images/brands/bharatbenz.png", color: "#1A1A1A" },
  { name: "Eicher", icon: "images/brands/eicher.png", color: "#ED1C24" },
  { name: "Force", icon: "images/brands/force.png", color: "#003399" },
  { name: "Volvo", icon: "images/brands/volvo.png", color: "#003057" },
  { name: "MG", icon: "images/brands/mg.png", color: "#FF0000" },
  { name: "Jaguar", icon: "images/brands/jaguar.png", color: "#000000" },
  { name: "Ford", icon: "images/brands/ford.png", color: "#00274E" },
  { name: "Chevrolet", icon: "images/brands/chevrolet.png", color: "#CD9834" },
  { name: "Volkswagen", icon: "images/brands/volkswagen.png", color: "#151F5D" },
  { name: "Skoda", icon: "images/brands/skoda.png", color: "#4BA82E" },
  { name: "JCB", icon: "images/brands/jcb.svg", color: "#FCB026" },
  { name: "Komatsu", icon: "images/brands/komatsu.svg", color: "#140A9A" },
  { name: "Piaggio Ape", icon: "images/brands/piaggio-ape.svg", color: "#000000" }
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
