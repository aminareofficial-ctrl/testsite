const THEME_KEY = "rb-theme";
const MOBILE_BREAKPOINT = 980;

const moonIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.8A9 9 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8Z"></path>
  </svg>
`;

const sunIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2.5v2.2M12 19.3v2.2M4.93 4.93l1.55 1.55M17.52 17.52l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.93 19.07l-1.55 1.55M17.52 6.48l1.55-1.55"></path>
  </svg>
`;

function applyTheme(theme) {
  const root = document.documentElement;
  const safeTheme = theme === "dark" ? "dark" : "light";
  root.setAttribute("data-theme", safeTheme);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.innerHTML = safeTheme === "dark" ? sunIcon : moonIcon;
    const label = safeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : prefersDark
      ? "dark"
      : "light";

  applyTheme(initialTheme);
}

function initThemeToggle() {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  });
}

function initMobileMenu() {
  const button = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("#primary-navigation");

  if (!button || !navigation) return;

  const setOpen = (isOpen) => {
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    button.querySelector("span").textContent = isOpen ? "×" : "☰";
    navigation.classList.toggle("is-open", isOpen);
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (
      button.getAttribute("aria-expanded") === "true" &&
      !button.contains(event.target) &&
      !navigation.contains(event.target)
    ) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });

  window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT + 1}px)`).addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

function setActiveNav() {
  const pathname = window.location.pathname;
  const normalized = pathname.endsWith("/") ? pathname : pathname.replace(/\/$/, "");
  const pageMap = {
    "/": "home",
    "/index.html": "home",
    "/services": "services",
    "/services.html": "services",
    "/platforms": "platforms",
    "/platforms.html": "platforms",
    "/proof": "proof",
    "/proof.html": "proof",
    "/pricing": "pricing",
    "/pricing.html": "pricing",
    "/terms": "terms",
    "/terms.html": "terms"
  };
  const currentKey = pageMap[normalized] || "home";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = link.getAttribute("data-nav") === currentKey;
    link.classList.toggle("is-active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initHeroMotion() {
  const panel = document.querySelector("[data-tilt]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!panel || !finePointer || reducedMotion) return;

  panel.addEventListener("pointermove", (event) => {
    const bounds = panel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    panel.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${-y * 2}deg)`;
  });

  panel.addEventListener("pointerleave", () => {
    panel.style.transform = "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    initTheme();
    initThemeToggle();
    initMobileMenu();
    setActiveNav();
    initHeroMotion();
  } catch (error) {
    console.error("ReBackend initialization failed:", error);
  }
});

