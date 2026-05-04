const LANG_KEY = "nm-lang";
window.currentTranslations = {};

async function applyLang(lang) {
  try {
    const [common, products, corporate] = await Promise.all([
      fetch(`./locales/${lang}/common.json`).then((res) => res.json()),
      fetch(`./locales/${lang}/products.json`).then((res) => res.json()),
      fetch(`./locales/${lang}/corporate.json`).then((res) => res.json()),
    ]);

    window.currentTranslations = { ...common, ...products, ...corporate };
    const t = window.currentTranslations;

    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          if (
            el.type === "submit" ||
            el.type === "button" ||
            el.type === "reset"
          ) {
            el.value = t[key];
          } else {
            el.placeholder = t[key];
          }
        } else {
          el.innerHTML = t[key];
        }
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (t[key] !== undefined) el.title = t[key];
    });

    const titleTag = document.querySelector("title[data-i18n-title-tag]");
    if (titleTag) {
      const key = titleTag.getAttribute("data-i18n-title-tag");
      if (t[key] !== undefined) document.title = t[key];
    }

    document.querySelectorAll(".lang-option").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    const currentLangLabel = document.getElementById("current-lang-label");
    if (currentLangLabel) {
      currentLangLabel.textContent = lang.toUpperCase();
    }

    // Meta description güncelle
    const metaDescriptions = {
      tr: "Narmanlı Mobilya - Antalya'da özel tasarım mutfak, banyo, gardırop ve daha fazlası. Sipariş üzerine üretim, butik mobilya çözümleri.",
      en: "Narmanlı Furniture - Custom design kitchen, bathroom, wardrobe and more in Antalya, Turkey. Made-to-order, boutique furniture solutions.",
      ru: "Нармanlı Мебель - Мебель на заказ в Анталье: кухни, ванные, шкафы и многое другое. Индивидуальный дизайн, бутиковые решения."
    };
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDescriptions[lang]) {
      metaDesc.setAttribute("content", metaDescriptions[lang]);
    }

    document.querySelectorAll(".blog-btn").forEach((btn) => {
      if (!btn.classList.contains("expanded-btn")) {
        btn.textContent = t["blog-btn"] || btn.textContent;
      }
    });

    setupMenuEvents();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.style.visibility = "visible";
    });
  } catch (error) {
    console.error("Çeviri yüklenirken hata oluştu:", error);
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.style.visibility = "visible";
    });
  }
}

function setupMenuEvents() {
  let menuBtn = document.querySelector("#menu-btn");
  let navbar = document.querySelector(".header .navbar");

  if (menuBtn && navbar) {
    menuBtn.onclick = null;
    menuBtn.onclick = () => {
      menuBtn.classList.toggle("fa-times");
      navbar.classList.toggle("active");
    };
  }

  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const btn = dropdown.querySelector(".dropbtn");
    if (btn) {
      btn.onclick = (e) => {
        if (window.innerWidth < 1024) {
          e.preventDefault();
          document.querySelectorAll(".dropdown").forEach((d) => {
            if (d !== dropdown) d.classList.remove("active");
          });
          dropdown.classList.toggle("active");
        }
      };
    }
  });
}

function toggleLangDropdown() {
  const switcher = document.getElementById("lang-switcher");
  if (switcher) switcher.classList.toggle("open");
}

function setLang(lang) {
  applyLang(lang);
  const switcher = document.getElementById("lang-switcher");
  if (switcher) switcher.classList.remove("open");
}

document.addEventListener("click", (e) => {
  const wrapper = document.getElementById("lang-switcher");
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove("open");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setupMenuEvents();
  const saved = localStorage.getItem(LANG_KEY);
  const browserLang = navigator.language?.startsWith("ru")
    ? "ru"
    : navigator.language?.startsWith("en")
      ? "en"
      : "tr";
  applyLang(saved || browserLang);
});

window.setLang = setLang;
window.toggleLangDropdown = toggleLangDropdown;