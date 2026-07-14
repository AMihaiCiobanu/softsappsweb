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
      ist_sub: "Engleză și matematică prin lecții scurte, ca un joc. Complet offline, fără conturi, fără reclame, fără urmărire.",

      ist_courses_label: "Alegi cursul din aplicație, oricând:",
      ist_c1: "Română → Engleză",
      ist_c2: "Engleză → Română",
      ist_c3: "Doar română",
      ist_c4: "Doar engleză",

      ist_s1: "materii",
      ist_s2: "teme",
      ist_s3: "lecții",
      ist_s4: "tipuri de exerciții",
      ist_s5: "cuvinte cu audio",

      ist_shots_eyebrow: "Cum arată",
      ist_shots_title_html: "Lecții care <span class='grad'>se joacă</span>",
      ist_shots_sub: "Aceleași lecții, în temă luminoasă sau întunecată — copilul alege.",
      ist_shot1: "Teme de engleză, cu progresul pe zile",
      ist_shot2: "Întâi învață cuvintele, bilingv",
      ist_shot3: "Apoi le exersează, cu pronunție",
      ist_shot4: "Construiește cuvântul din litere",
      ist_shot5: "Potrivește cuvintele cu imaginile",
      ist_shot6: "Ce literă lipsește?",
      ist_shot7: "Matematică vizuală, cu tastatură proprie",
      ist_shot8: "De la numărat la ordinea operațiilor",

      ist_feats_eyebrow: "De ce Istețel",
      ist_feats_title_html:
        "Făcut pentru copii, <span class='grad'>liniștitor pentru părinți</span>",
      ist_f1_title: "Complet offline",
      ist_f1_desc: "Toate lecțiile sunt în aplicație. Merge în mașină, în avion, la bunici — fără internet.",
      ist_f2_title: "Sigur pentru copii",
      ist_f2_desc: "Fără conturi, fără reclame, fără cumpărături în aplicație, fără colectare de date. Deloc.",
      ist_f3_title: "Patru cursuri, schimbate oricând",
      ist_f3_desc: "Română → engleză, engleză → română, doar română sau doar engleză. Instrucțiunile în limba copilului, răspunsurile și pronunția în limba învățată.",
      ist_f4_title: "Pronunție la atingere",
      ist_f4_desc: "Fiecare cuvânt se aude. Poți alege chiar și vocea, din cele instalate pe telefon.",
      ist_f5_title: "Matematică adaptivă",
      ist_f5_desc: "Numerele cresc când copilul răspunde corect și coboară când greșește — separat pentru adunare, scădere, înmulțire și împărțire.",
      ist_f6_title: "Antrenament fără sfârșit",
      ist_f6_desc: "Un mod de exerciții care generează întrebări la nesfârșit, cu accent pe operațiile mai slabe.",
      ist_f7_title: "Stele și serii zilnice",
      ist_f7_desc: "Stele pentru fiecare lecție și o serie care crește dacă revine în fiecare zi. Fără presiune, doar motivație.",
      ist_f8_title: "Temă luminoasă sau întunecată",
      ist_f8_desc: "Urmează sistemul sau se fixează manual — util seara, înainte de culcare.",

      ist_subj_eyebrow: "Ce învață",
      ist_subj_title_html: "Două materii, <span class='grad'>71 de teme</span>",
      ist_subj_sub: "Conținutul crește odată cu copilul: de la primele cuvinte și numărat, până la ordinea operațiilor.",
      ist_subj_en_title: "Engleză",
      ist_subj_en_meta: "33 de teme · 77 de lecții · peste 570 de cuvinte",
      ist_subj_en_lead: "Fiecare temă începe cu cartonașe bilingve, apoi trece la exerciții: ascultare, ortografie, traducere, propoziții.",
      ist_subj_ma_title: "Matematică",
      ist_subj_ma_meta: "38 de teme · 207 lecții · 5 grupe de dificultate",
      ist_subj_ma_lead: "Temele sunt grupate în Bazele, Operații, Geometrie, Măsurători și Provocări — se deblochează în ritmul copilului.",

      ist_upd_title: "Lecții noi, constant",
      ist_upd_desc: "Adăugăm teme și lecții noi la matematică și la limba aleasă, prin actualizări obișnuite. Intră în plata inițială — nu se cumpără separat.",

      ist_t_alphabet: "Alfabet",
      ist_t_animals: "Animale",
      ist_t_colors: "Culori",
      ist_t_numbers: "Numere",
      ist_t_family: "Familia",
      ist_t_body: "Corpul",
      ist_t_food: "Mâncare",
      ist_t_clothes: "Haine",
      ist_t_house: "Casa",
      ist_t_school: "Școală",
      ist_t_jobs: "Meserii",
      ist_t_vehicles: "Vehicule",
      ist_t_sports: "Sporturi",
      ist_t_toys: "Jucării",
      ist_t_music: "Muzică",
      ist_t_nature: "Natura",
      ist_t_weather: "Vremea",
      ist_t_seasons: "Anotimpuri",
      ist_t_days: "Zile și luni",
      ist_t_feelings: "Emoții",
      ist_t_greetings: "Salutări",
      ist_t_verbs: "Verbe",
      ist_t_adjectives: "Adjective",
      ist_t_opposites: "Opuse",
      ist_t_space: "Spațiu",
      ist_t_world: "Țări și steaguri · 6 continente",

      ist_g_basics: "Bazele",
      ist_g_ops: "Operații",
      ist_g_geo: "Geometrie",
      ist_g_measure: "Măsurători",
      ist_g_challenges: "Provocări",
      ist_t_counting: "Numărat",
      ist_t_compare: "Comparare",
      ist_t_numwords: "Numere în cuvinte",
      ist_t_parity: "Par și impar",
      ist_t_rounding: "Rotunjire",
      ist_t_place: "Ordine și clase",
      ist_t_add: "Adunare",
      ist_t_sub: "Scădere",
      ist_t_mul: "Înmulțire",
      ist_t_tables: "Tabla înmulțirii",
      ist_t_div: "Împărțire",
      ist_t_remainder: "Rest",
      ist_t_shapes: "Forme",
      ist_t_solids: "Corpuri geometrice",
      ist_t_symmetry: "Simetrie",
      ist_t_angles: "Unghiuri",
      ist_t_perimeter: "Perimetru",
      ist_t_area: "Aria",
      ist_t_money: "Bani și rest",
      ist_t_clock: "Ceasul",
      ist_t_time: "Timpul",
      ist_t_problems: "Probleme",
      ist_t_fractions: "Fracții",
      ist_t_roman: "Numere romane",
      ist_t_orderops: "Ordinea operațiilor",

      ist_ex_eyebrow: "Varietate",
      ist_ex_title_html:
        "59 de tipuri de exerciții, <span class='grad'>nu un singur quiz</span>",
      ist_ex_sub: "Fiecare lecție amestecă mai multe tipuri, ca să nu devină rutină.",
      ist_e1: "Imagine → cuvânt",
      ist_e2: "Ascultă și alege",
      ist_e3: "Potrivește perechile",
      ist_e4: "Joc de memorie",
      ist_e5: "Litera lipsă",
      ist_e6: "Anagrame",
      ist_e7: "Scrie cuvântul",
      ist_e8: "Careu de cuvinte",
      ist_e9: "Intrusul",
      ist_e10: "Construiește propoziția",
      ist_e11: "Completează spațiul",
      ist_e12: "Traducere",
      ist_e13: "Adevărat sau fals",
      ist_e14: "Sortare pe categorii",
      ist_e15: "Ordonare",
      ist_e16: "Numărat vizual",
      ist_e17: "Termenul lipsă",
      ist_e18: "Probleme cu text",
      ist_e19: "Rețea de numere",
      ist_e20: "Citește ceasul",
      ist_e21: "Calculează restul",
      ist_e22: "Fracții vizuale",
      ist_e23: "Modele și șiruri",
      ist_e_more: "…și încă 36",

      ist_faq_eyebrow: "Pentru părinți",
      ist_faq_title_html: "Întrebări <span class='grad'>frecvente</span>",
      ist_q1: "Cum se plătește?",
      ist_a1: "O singură plată, la descărcare. Fără abonament, fără reclame și fără cumpărături în aplicație — tot conținutul e acolo de la instalare, pentru totdeauna. Prețul în moneda ta apare în App Store și Google Play.",
      ist_q2: "Ce vârstă are copilul potrivit?",
      ist_a2: "Aproximativ 4–11 ani. Primele teme merg pentru preșcolari care recunosc imagini, iar temele de la final (fracții, ordinea operațiilor, numere romane) acoperă clasele primare.",
      ist_q3: "Are nevoie de internet?",
      ist_a3: "Nu. Lecțiile, imaginile și sunetele sunt incluse în aplicație. După instalare merge complet offline.",
      ist_q4: "Ce date colectați?",
      ist_a4: "Niciuna. Nu există conturi, nu există server, nu există analytics. Progresul rămâne pe telefon și dispare dacă dezinstalezi aplicația.",
      ist_q5: "Ce limbi sunt disponibile?",
      ist_a5: "Patru cursuri, schimbate oricând din Setări: română → engleză, engleză → română, doar română și doar engleză. Instrucțiunile apar în prima limbă, răspunsurile și pronunția în a doua. Spaniola, franceza și germana apar deja în setări, pregătite pentru versiunile următoare.",
      ist_q7: "Se mai adaugă lecții?",
      ist_a7: "Da. Adăugăm constant teme și lecții noi, atât la matematică, cât și la limba aleasă, prin actualizările din App Store și Google Play. Sunt incluse în plata inițială.",
      ist_q6: "Cum funcționează matematica adaptivă?",
      ist_a6: "Aplicația reține separat cât de bine merge fiecare operație. Când copilul răspunde corect, numerele cresc; la greșeli, coboară. Antrenamentul mixt alege mai des operațiile la care are nevoie de exercițiu.",

      ist_cta_title_html: "Descarcă <span class='grad'>Istețel</span>",
      ist_cta_sub: "Pe iPhone, iPad și Android. O singură plată, fără cont, fără reclame — doar lecții.",

      ist_privacy: "Politica de confidențialitate",
      ist_home: "Înapoi la SoftApps",
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
      ist_sub: "English and Math through short, game-like lessons. Fully offline, no accounts, no ads, no tracking.",

      ist_courses_label: "Pick the course inside the app, any time:",
      ist_c1: "Romanian → English",
      ist_c2: "English → Romanian",
      ist_c3: "Romanian only",
      ist_c4: "English only",

      ist_s1: "subjects",
      ist_s2: "topics",
      ist_s3: "lessons",
      ist_s4: "exercise types",
      ist_s5: "words with audio",

      ist_shots_eyebrow: "A look inside",
      ist_shots_title_html: "Lessons that <span class='grad'>play like games</span>",
      ist_shots_sub: "The same lessons in light or dark theme — the child picks.",
      ist_shot1: "English topics, with the week's progress",
      ist_shot2: "Learn the words first, bilingual",
      ist_shot3: "Then practise them, with pronunciation",
      ist_shot4: "Build the word from its letters",
      ist_shot5: "Match the words to the pictures",
      ist_shot6: "Which letter is missing?",
      ist_shot7: "Visual math, with its own keypad",
      ist_shot8: "From counting to order of operations",

      ist_feats_eyebrow: "Why Istețel",
      ist_feats_title_html:
        "Built for kids, <span class='grad'>reassuring for parents</span>",
      ist_f1_title: "Fully offline",
      ist_f1_desc: "Every lesson ships inside the app. Works in the car, on a plane, at grandma's — no internet.",
      ist_f2_title: "Kid-safe",
      ist_f2_desc: "No accounts, no ads, no in-app purchases, no data collection. None at all.",
      ist_f3_title: "Four courses, switch any time",
      ist_f3_desc: "Romanian → English, English → Romanian, Romanian only or English only. Instructions in the child's language, answers and pronunciation in the one they're learning.",
      ist_f4_title: "Pronunciation on tap",
      ist_f4_desc: "Every word is spoken aloud. You can even pick the voice from the ones installed on the phone.",
      ist_f5_title: "Adaptive math",
      ist_f5_desc: "Numbers grow on correct answers and shrink on mistakes — tracked separately for addition, subtraction, multiplication and division.",
      ist_f6_title: "Endless practice",
      ist_f6_desc: "A practice mode that generates questions forever, leaning on the operations that need work.",
      ist_f7_title: "Stars and daily streaks",
      ist_f7_desc: "A star for every lesson and a streak that grows with each day they come back. No pressure, just motivation.",
      ist_f8_title: "Light or dark theme",
      ist_f8_desc: "Follows the system or stays fixed — handy in the evening, before bed.",

      ist_subj_eyebrow: "What it teaches",
      ist_subj_title_html: "Two subjects, <span class='grad'>71 topics</span>",
      ist_subj_sub: "The content grows with the child: from first words and counting all the way to order of operations.",
      ist_subj_en_title: "English",
      ist_subj_en_meta: "33 topics · 77 lessons · 570+ words",
      ist_subj_en_lead: "Every topic opens with bilingual flashcards, then moves into exercises: listening, spelling, translation, sentences.",
      ist_subj_ma_title: "Math",
      ist_subj_ma_meta: "38 topics · 207 lessons · 5 difficulty groups",
      ist_subj_ma_lead: "Topics are grouped into Basics, Operations, Geometry, Measures and Challenges — opened at the child's own pace.",

      ist_upd_title: "New lessons, all the time",
      ist_upd_desc: "We keep adding topics and lessons to both math and the language you picked, through regular updates. They're part of the original payment — never sold separately.",

      ist_t_alphabet: "Alphabet",
      ist_t_animals: "Animals",
      ist_t_colors: "Colors",
      ist_t_numbers: "Numbers",
      ist_t_family: "Family",
      ist_t_body: "Body",
      ist_t_food: "Food",
      ist_t_clothes: "Clothes",
      ist_t_house: "House",
      ist_t_school: "School",
      ist_t_jobs: "Jobs",
      ist_t_vehicles: "Vehicles",
      ist_t_sports: "Sports",
      ist_t_toys: "Toys",
      ist_t_music: "Music",
      ist_t_nature: "Nature",
      ist_t_weather: "Weather",
      ist_t_seasons: "Seasons",
      ist_t_days: "Days & months",
      ist_t_feelings: "Feelings",
      ist_t_greetings: "Greetings",
      ist_t_verbs: "Verbs",
      ist_t_adjectives: "Adjectives",
      ist_t_opposites: "Opposites",
      ist_t_space: "Space",
      ist_t_world: "Countries & flags · 6 continents",

      ist_g_basics: "Basics",
      ist_g_ops: "Operations",
      ist_g_geo: "Geometry",
      ist_g_measure: "Measures",
      ist_g_challenges: "Challenges",
      ist_t_counting: "Counting",
      ist_t_compare: "Compare",
      ist_t_numwords: "Numbers in words",
      ist_t_parity: "Even & odd",
      ist_t_rounding: "Rounding",
      ist_t_place: "Place value",
      ist_t_add: "Addition",
      ist_t_sub: "Subtraction",
      ist_t_mul: "Multiplication",
      ist_t_tables: "Times tables",
      ist_t_div: "Division",
      ist_t_remainder: "Remainders",
      ist_t_shapes: "Shapes",
      ist_t_solids: "3D solids",
      ist_t_symmetry: "Symmetry",
      ist_t_angles: "Angles",
      ist_t_perimeter: "Perimeter",
      ist_t_area: "Area",
      ist_t_money: "Money & change",
      ist_t_clock: "The clock",
      ist_t_time: "Time",
      ist_t_problems: "Story problems",
      ist_t_fractions: "Fractions",
      ist_t_roman: "Roman numerals",
      ist_t_orderops: "Order of operations",

      ist_ex_eyebrow: "Variety",
      ist_ex_title_html:
        "59 exercise types, <span class='grad'>not one quiz on repeat</span>",
      ist_ex_sub: "Every lesson mixes several types, so it never turns into a routine.",
      ist_e1: "Picture → word",
      ist_e2: "Listen and choose",
      ist_e3: "Match the pairs",
      ist_e4: "Memory game",
      ist_e5: "Missing letter",
      ist_e6: "Anagrams",
      ist_e7: "Spell the word",
      ist_e8: "Word search",
      ist_e9: "Odd one out",
      ist_e10: "Build the sentence",
      ist_e11: "Fill the gap",
      ist_e12: "Translation",
      ist_e13: "True or false",
      ist_e14: "Sort into groups",
      ist_e15: "Put in order",
      ist_e16: "Visual counting",
      ist_e17: "Missing term",
      ist_e18: "Story problems",
      ist_e19: "Number web",
      ist_e20: "Read the clock",
      ist_e21: "Work out the change",
      ist_e22: "Visual fractions",
      ist_e23: "Patterns & sequences",
      ist_e_more: "…and 36 more",

      ist_faq_eyebrow: "For parents",
      ist_faq_title_html: "Frequently <span class='grad'>asked</span>",
      ist_q1: "How do I pay?",
      ist_a1: "One payment, once, when you download it. No subscription, no ads and no in-app purchases — all the content is there from the moment you install it, for good. The price in your currency shows in the App Store and Google Play.",
      ist_q2: "What age is it for?",
      ist_a2: "Roughly 4–11. The first topics work for preschoolers who recognise pictures, while the later ones (fractions, order of operations, Roman numerals) cover primary school.",
      ist_q3: "Does it need internet?",
      ist_a3: "No. Lessons, images and sounds all ship inside the app. Once installed, it runs fully offline.",
      ist_q4: "What data do you collect?",
      ist_a4: "None. There are no accounts, no server, no analytics. Progress stays on the phone and goes away if you uninstall the app.",
      ist_q5: "Which languages are available?",
      ist_a5: "Four courses, switchable any time in Settings: Romanian → English, English → Romanian, Romanian only and English only. Instructions come in the first language, answers and pronunciation in the second. Spanish, French and German already appear in settings, lined up for future releases.",
      ist_q7: "Do you keep adding lessons?",
      ist_a7: "Yes. We keep adding topics and lessons to both math and the language you picked, through App Store and Google Play updates. They're included in the original payment.",
      ist_q6: "How does adaptive math work?",
      ist_a6: "The app tracks how each operation is going, separately. Correct answers push the numbers up; mistakes bring them back down. Mixed practice picks the operations that need work more often.",

      ist_cta_title_html: "Download <span class='grad'>Istețel</span>",
      ist_cta_sub: "On iPhone, iPad and Android. One payment, no account, no ads — just lessons.",

      ist_privacy: "Privacy policy",
      ist_home: "Back to SoftApps",
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
