/* =====================================================
   VET GLAM — script.js
   Funciones: WhatsApp, menú, scroll, animaciones
   ===================================================== */

// ============================================================
// CONFIGURACIÓN EDITABLE
// ► Cambia estos valores con tus datos reales antes de publicar
// ============================================================

const CONFIG = {
  // Número de WhatsApp: código de país + número, sin espacios ni +
  whatsappNumber: "56981302056",

  // Mensaje predeterminado para el botón general
  defaultMsg: "Hola, quiero agendar una hora para mi mascota.",

  // Mensajes específicos por sección
  msgs: {
    hero:      "Hola, quiero agendar una hora para mi mascota.",
    microchip: "Hola, quisiera agendar el servicio de microchip.",
    grooming:  "Hola, quisiera agendar una hora de peluquería para mi mascota.",
    surgery:   "Hola, quisiera consultar sobre cirugías y procedimientos.",
    contact:   "Hola, me gustaría agendar la atención de mi mascota.",
    header:    "Hola, quiero agendar una hora para mi mascota.",
    footer:    "Hola, quiero contactar a Vet Glam.",
  }
};

// ============================================================
// HELPER: construir URL de WhatsApp
// ============================================================

/**
 * Genera una URL de WhatsApp con número y mensaje codificado.
 * @param {string} msg  Mensaje a pre-completar en WhatsApp.
 * @returns {string}    URL completa de wa.me.
 */
function buildWhatsappUrl(msg) {
  const text = encodeURIComponent(msg || CONFIG.defaultMsg);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

// ============================================================
// INICIALIZAR TODOS LOS BOTONES DE WHATSAPP
// ============================================================

function initWhatsappButtons() {
  // Botón del header
  const headerBtn = document.getElementById("headerWhatsapp");
  if (headerBtn) headerBtn.href = buildWhatsappUrl(CONFIG.msgs.header);

  // Botón del hero
  const heroBtn = document.getElementById("heroWhatsapp");
  if (heroBtn) heroBtn.href = buildWhatsappUrl(CONFIG.msgs.hero);

  // Botón de microchip
  const chipBtn = document.getElementById("microchipWhatsapp");
  if (chipBtn) chipBtn.href = buildWhatsappUrl(CONFIG.msgs.microchip);

  // Botón de contacto principal
  const contactBtn = document.getElementById("contactWhatsapp");
  if (contactBtn) contactBtn.href = buildWhatsappUrl(CONFIG.msgs.contact);

  // Botón flotante
  const floatBtn = document.getElementById("whatsappFloat");
  if (floatBtn) floatBtn.href = buildWhatsappUrl(CONFIG.defaultMsg);

  // Botón del footer (ícono WhatsApp)
  const footerWaBtn = document.getElementById("footerWhatsapp");
  if (footerWaBtn) footerWaBtn.href = buildWhatsappUrl(CONFIG.msgs.footer);

  // Botones de servicios individuales (data-msg personalizado)
  const serviceButtons = document.querySelectorAll(".service-whatsapp");
  serviceButtons.forEach(btn => {
    const customMsg = btn.dataset.msg || CONFIG.defaultMsg;
    btn.href = buildWhatsappUrl(customMsg);
  });

  // Botón de peluquería
  const groomBtn = document.querySelector(".grooming-whatsapp");
  if (groomBtn) groomBtn.href = buildWhatsappUrl(CONFIG.msgs.grooming);

  // Botón de cirugías
  const surgBtn = document.querySelector(".surgery-whatsapp");
  if (surgBtn) surgBtn.href = buildWhatsappUrl(CONFIG.msgs.surgery);
}


// ============================================================
// MODO OSCURO / CLARO
// ============================================================

function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const icon = toggle.querySelector(".theme-toggle__icon");
  const text = toggle.querySelector(".theme-toggle__text");
  const STORAGE_KEY = "vetglam-theme";

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (text) text.textContent = isDark ? "Claro" : "Oscuro";
  }

  applyTheme(getCurrentTheme());

  toggle.addEventListener("click", function () {
    const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (e) {
      // Si el navegador bloquea localStorage, el cambio funciona igual durante la sesión.
    }
  });
}

// ============================================================
// FORMULARIO DE CONTACTO → WhatsApp
// ============================================================

function initContactForm() {
  const sendBtn = document.getElementById("sendFormWhatsapp");
  if (!sendBtn) return;

  sendBtn.addEventListener("click", function () {
    const nombre  = document.getElementById("nombre")?.value.trim()   || "";
    const telefono = document.getElementById("telefono")?.value.trim() || "";
    const email   = document.getElementById("email")?.value.trim()    || "";
    const mensaje = document.getElementById("mensaje")?.value.trim()   || "";

    // Construir mensaje combinado
    let text = `Hola, me contacto desde el sitio web de Vet Glam.\n`;
    if (nombre)   text += `\n*Nombre:* ${nombre}`;
    if (telefono) text += `\n*Teléfono:* ${telefono}`;
    if (email)    text += `\n*Correo:* ${email}`;
    if (mensaje)  text += `\n*Mensaje:* ${mensaje}`;
    if (!nombre && !mensaje) {
      text = CONFIG.msgs.contact;
    }

    window.open(buildWhatsappUrl(text), "_blank");
  });
}

// ============================================================
// MENÚ HAMBURGUESA
// ============================================================

function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const nav       = document.getElementById("nav");
  if (!hamburger || !nav) return;

  function openMenu() {
    nav.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; // evita scroll mientras menú abierto
  }

  function closeMenu() {
    nav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", function () {
    const isOpen = nav.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar menú al hacer clic en un enlace
  const navLinks = nav.querySelectorAll(".nav__link");
  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      closeMenu();
    }
  });

  // Cerrar al redimensionar a desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) closeMenu();
  });
}

// ============================================================
// SCROLL SUAVE
// Aplica scroll suave nativo a todos los anclas internos
// ============================================================

function initSmoothScroll() {
  const headerH = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return; // ignorar # vacío
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerH() - 10;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

// ============================================================
// HEADER: clase al hacer scroll
// ============================================================

function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const threshold = 30;

  function checkScroll() {
    if (window.scrollY > threshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll(); // estado inicial
}

// ============================================================
// ANIMACIONES AL HACER SCROLL (Intersection Observer)
// ============================================================

function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate-in");
  if (!elements.length) return;

  // Si el navegador no soporta IntersectionObserver, mostrar todo
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animar sólo una vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach(el => observer.observe(el));
}

// ============================================================
// ENLACE ACTIVO EN EL MENÚ según sección visible
// ============================================================

function initActiveNavLinks() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");
  if (!sections.length || !navLinks.length) return;

  const headerH = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;

  function setActive() {
    let current = "";
    sections.forEach(section => {
      const top = section.offsetTop - headerH() - 60;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
}

// ============================================================
// PLACEHOLDER: si la imagen no carga, mostrar placeholder
// (complementa el onerror inline en el HTML)
// ============================================================

function initImageFallbacks() {
  // Esta función es complementaria al onerror en el HTML.
  // Por si alguna imagen se carga tarde, re-verifica.
  const imgs = document.querySelectorAll("img[onerror]");
  imgs.forEach(img => {
    if (!img.complete || img.naturalWidth === 0) {
      // dispara el onerror manualmente si es necesario
      const handler = img.getAttribute("onerror");
      if (handler && img.naturalWidth === 0 && img.complete) {
        try { eval(handler.replace(/this/g, "img")); } catch (e) { /* ignorar */ }
      }
    }
  });
}

// ============================================================
// INICIO: ejecutar todo al cargar el DOM
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  initThemeToggle();
  initWhatsappButtons();
  initContactForm();
  initMobileMenu();
  initSmoothScroll();
  initHeaderScroll();
  initScrollAnimations();
  initActiveNavLinks();
  initImageFallbacks();

  console.log(
    "%c🐾 Vet Glam %c— web lista",
    "color:#355A43;font-weight:bold;font-size:14px;",
    "color:#7F8D6A;font-size:12px;"
  );
});
