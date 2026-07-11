/* SoftApps — bilingual RO/EN dictionary + client-side toggle.
   Applies to [data-i18n] (textContent) and [data-i18n-html] (innerHTML).
   Persists choice in localStorage. Default: ro. */
(function () {
  "use strict";

  const DICT = {
    ro: {
      // nav
      nav_about: "Despre",
      nav_work: "Portofoliu",
      nav_services: "Servicii",
      nav_contact: "Contact",
      nav_cta: "Contact",

      // hero
      hero_eyebrow: "Studio de software · România",
      hero_title_html: "Construim <span class='grad'>aplicații native</span> &amp; experiențe web.",
      hero_sub: "SoftApps SRL. Aplicații mobile pentru iOS și Android și site-uri rapide, moderne — de la idee la App Store.",
      hero_cta: "Vezi ce am construit",
      hero_cta2: "Scrie-ne",
      hero_scroll: "Scroll",

      // marquee
      marquee: "iOS · Android · Flutter · Web · UI/UX · Cloudflare · Offline-first · App Store · Google Play ·",

      // about
      about_eyebrow: "Cine suntem",
      about_title_html: "O firmă mică, produse pe care le <span class='grad'>folosește lumea</span>.",
      about_p1: "SoftApps SRL construiește aplicații mobile native și pagini web de prezentare. Punem accent pe viteză, design curat și lucruri care funcționează chiar și offline.",
      about_p2: "Avem produse proprii în magazinele de aplicații și site-uri livrate pentru clienți reali — de la restaurante la studiouri de beauty.",
      stat_apps_n: "2",
      stat_apps: "aplicații proprii",
      stat_sites_n: "3+",
      stat_sites: "site-uri livrate",
      stat_langs_n: "10",
      stat_langs: "limbi suportate",
      stat_platforms_n: "iOS · Android",
      stat_platforms: "platforme native",

      // work
      work_eyebrow: "Portofoliu",
      work_title_html: "Ce am <span class='grad'>construit</span>",
      work_sub: "Produse proprii și proiecte pentru clienți. Apasă un card pentru a deschide site-ul.",
      badge_own: "Produs propriu",
      badge_client: "Client",
      badge_live: "Live",
      badge_soon: "În dezvoltare",
      work_appts_title: "Appointments & Reports",
      work_appts_desc: "Aplicație de programări și rapoarte financiare pentru saloane și afaceri de servicii. Live pe iOS și Android, în 10 limbi.",
      work_istetel_title: "Istețel",
      work_istetel_desc: "Aplicație educativă pentru copii — engleză și matematică, prin lecții scurte și jucăușe. Complet offline, fără conturi, fără reclame.",
      work_popasul_title: "Popasul Drumețului",
      work_popasul_desc: "Site de prezentare pentru un restaurant tradițional din Bucovina. Design cald, rustic, optimizat pentru Google.",
      work_silvia_title: "Silvia Skin Studio",
      work_silvia_desc: "Site pentru un studio de beauty din Marea Britanie. React modern, animat, cu programări prin telefon.",
      cta_visit: "Deschide site-ul",
      cta_learn: "Află mai multe",

      // services
      services_eyebrow: "Ce oferim",
      services_title_html: "Servicii de la <span class='grad'>cap la coadă</span>",
      svc_mobile_title: "Aplicații mobile native",
      svc_mobile_desc: "iOS și Android din aceeași bază de cod, cu Flutter. Publicare în App Store și Google Play.",
      svc_web_title: "Site-uri web",
      svc_web_desc: "Pagini de prezentare rapide și moderne, optimizate SEO, găzduite pe infrastructură globală.",
      svc_design_title: "Design & UI/UX",
      svc_design_desc: "Interfețe curate, animații fine și o identitate vizuală care rămâne în minte.",
      svc_offline_title: "Offline-first",
      svc_offline_desc: "Aplicații care funcționează fără internet, fără conturi și fără urmărirea utilizatorilor.",

      // contact
      contact_eyebrow: "Hai să vorbim",
      contact_title_html: "Ai o idee? <span class='grad'>O construim.</span>",
      contact_sub: "Scrie-ne despre aplicația sau site-ul tău. Răspundem repede.",
      contact_cta: "contact@softsapps.com",
      footer_tagline: "Aplicații native & experiențe web.",
      footer_rights: "Toate drepturile rezervate.",

      // istetel page
      ist_back: "SoftApps",
      ist_badge: "Live · App Store și Google Play",
      ist_title_html: "Istețel — <span class='grad'>învățare pentru copii</span>",
      ist_sub: "Engleză și matematică prin lecții scurte și interactive. Complet offline, fără conturi, fără reclame, fără urmărire.",
      ist_f1_title: "Complet offline",
      ist_f1_desc: "Funcționează oriunde, fără internet. Nimic nu părăsește dispozitivul.",
      ist_f2_title: "Engleză & Matematică",
      ist_f2_desc: "Lecții scurte, jucăușe, care cresc odată cu copilul.",
      ist_f3_title: "Bilingv",
      ist_f3_desc: "Instrucțiuni în limba copilului, răspunsuri în limba țintă.",
      ist_f4_title: "Sigur pentru copii",
      ist_f4_desc: "Fără conturi, fără reclame, fără colectare de date. Deloc.",
      ist_soon: "Disponibil acum pe App Store și Google Play.",
      ist_privacy: "Politica de confidențialitate",
      ist_home: "← Înapoi la SoftApps",
    },

    en: {
      nav_about: "About",
      nav_work: "Work",
      nav_services: "Services",
      nav_contact: "Contact",
      nav_cta: "Contact",

      hero_eyebrow: "Software studio · Romania",
      hero_title_html: "We build <span class='grad'>native apps</span> &amp; web experiences.",
      hero_sub: "SoftApps Ltd. Mobile apps for iOS and Android and fast, modern websites — from idea to the App Store.",
      hero_cta: "See what we built",
      hero_cta2: "Get in touch",
      hero_scroll: "Scroll",

      marquee: "iOS · Android · Flutter · Web · UI/UX · Cloudflare · Offline-first · App Store · Google Play ·",

      about_eyebrow: "Who we are",
      about_title_html: "A small team, products <span class='grad'>people actually use</span>.",
      about_p1: "SoftApps Ltd builds native mobile apps and presentation websites. We care about speed, clean design, and things that work even offline.",
      about_p2: "We ship our own products to the app stores and deliver websites for real clients — from restaurants to beauty studios.",
      stat_apps_n: "2",
      stat_apps: "own apps",
      stat_sites_n: "3+",
      stat_sites: "sites delivered",
      stat_langs_n: "10",
      stat_langs: "languages supported",
      stat_platforms_n: "iOS · Android",
      stat_platforms: "native platforms",

      work_eyebrow: "Portfolio",
      work_title_html: "What we <span class='grad'>built</span>",
      work_sub: "Our own products and client projects. Tap a card to open the site.",
      badge_own: "Own product",
      badge_client: "Client",
      badge_live: "Live",
      badge_soon: "In development",
      work_appts_title: "Appointments & Reports",
      work_appts_desc: "Appointment scheduling and financial reports for salons and service businesses. Live on iOS and Android, in 10 languages.",
      work_istetel_title: "Istețel",
      work_istetel_desc: "A learning app for kids — English and Math through short, playful, game-like lessons. Fully offline, no accounts, no ads.",
      work_popasul_title: "Popasul Drumețului",
      work_popasul_desc: "Presentation site for a traditional restaurant in Bucovina. Warm, rustic design, tuned for Google.",
      work_silvia_title: "Silvia Skin Studio",
      work_silvia_desc: "Website for a UK beauty studio. Modern animated React, bookings by phone.",
      cta_visit: "Open the site",
      cta_learn: "Learn more",

      services_eyebrow: "What we offer",
      services_title_html: "End-to-end <span class='grad'>services</span>",
      svc_mobile_title: "Native mobile apps",
      svc_mobile_desc: "iOS and Android from one codebase with Flutter. Shipped to the App Store and Google Play.",
      svc_web_title: "Websites",
      svc_web_desc: "Fast, modern presentation pages, SEO-tuned, hosted on global infrastructure.",
      svc_design_title: "Design & UI/UX",
      svc_design_desc: "Clean interfaces, subtle motion, and a visual identity that sticks.",
      svc_offline_title: "Offline-first",
      svc_offline_desc: "Apps that work with no internet, no accounts, and no user tracking.",

      contact_eyebrow: "Let's talk",
      contact_title_html: "Got an idea? <span class='grad'>We'll build it.</span>",
      contact_sub: "Tell us about your app or website. We reply fast.",
      contact_cta: "contact@softsapps.com",
      footer_tagline: "Native apps & web experiences.",
      footer_rights: "All rights reserved.",

      ist_back: "SoftApps",
      ist_badge: "Live · App Store & Google Play",
      ist_title_html: "Istețel — <span class='grad'>learning for kids</span>",
      ist_sub: "English and Math through short, playful lessons. Fully offline, no accounts, no ads, no tracking.",
      ist_f1_title: "Fully offline",
      ist_f1_desc: "Works anywhere, no internet needed. Nothing leaves the device.",
      ist_f2_title: "English & Math",
      ist_f2_desc: "Short, playful lessons that grow with the child.",
      ist_f3_title: "Bilingual",
      ist_f3_desc: "Instructions in the child's language, answers in the target language.",
      ist_f4_title: "Kid-safe",
      ist_f4_desc: "No accounts, no ads, no data collection. None at all.",
      ist_soon: "Available now on the App Store and Google Play.",
      ist_privacy: "Privacy policy",
      ist_home: "← Back to SoftApps",
    },
  };

  const STORAGE_KEY = "softapps_lang";

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ro" || saved === "en") return saved;
    const nav = (navigator.language || "ro").toLowerCase();
    return nav.startsWith("ro") ? "ro" : "en";
  }

  function apply(lang) {
    const t = DICT[lang] || DICT.ro;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key] != null) el.textContent = t[key];
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (t[key] != null) el.innerHTML = t[key];
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (t[key] != null) el.setAttribute("aria-label", t[key]);
    });

    // reflect active state on lang buttons
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });
  }

  function setLang(lang) {
    if (lang !== "ro" && lang !== "en") return;
    localStorage.setItem(STORAGE_KEY, lang);
    apply(lang);
  }

  function init() {
    apply(getLang());
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
    });
  }

  window.SoftAppsI18n = { setLang, getLang };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
