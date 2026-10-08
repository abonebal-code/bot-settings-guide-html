/**
 * ╔══════════════════════════════════════════════╗
 *   links.js — روابط التواصل والخدمات والتنقل
 *   عدّل هذا الملف بمعلوماتك
 * ╚══════════════════════════════════════════════╝
 */
const LINKS = {

  // ── معلومات التواصل ────────────────────────────
  contact: [
    {
      id:       "discord",
      label:    { ar: "Discord", en: "Discord" },
      value:    "abonebal",
      icon:     "🎮",
      color:    "#5865f2",
      copyable: true,
      url:      null
    },
    {
      id:       "github",
      label:    { ar: "GitHub", en: "GitHub" },
      value:    "abonebal-code",
      icon:     "🐙",
      color:    "#f0f0f0",
      copyable: false,
      url:      "https://github.com/abonebal-code"
    },
    // أضف المزيد هنا:
    // {
    //   id:       "telegram",
    //   label:    { ar: "تيليغرام", en: "Telegram" },
    //   value:    "@username",
    //   icon:     "✈️",
    //   color:    "#229ed9",
    //   copyable: true,
    //   url:      "https://t.me/username"
    // },
  ],

  // ── الخدمات ────────────────────────────────────
  services: [
    {
      icon:  "🤖",
      color: "#5865f2",
      title: { ar: "بوت Discord مخصص",     en: "Custom Discord Bot"    },
      desc:  { ar: "بوت كامل حسب طلبك بكل الأنظمة التي تحتاجها", en: "Full custom bot tailored to your needs" },
      price: { ar: "تواصل للسعر",           en: "Contact for pricing"  }
    },
    {
      icon:  "👨‍👩‍👧‍👦",
      color: "#57f287",
      title: { ar: "نظام عائلة متكامل",     en: "Family System"        },
      desc:  { ar: "تجنيد، فصل، غرامات، مكافآت، تقارير وأكثر", en: "Recruit, kick, fines, rewards, reports & more" },
      price: { ar: "تواصل للسعر",           en: "Contact for pricing"  }
    },
    {
      icon:  "🗂️",
      color: "#f0a500",
      title: { ar: "لوحة تحكم ويب",         en: "Web Dashboard"        },
      desc:  { ar: "لوحة تحكم احترافية لإدارة البوت عبر المتصفح", en: "Professional web dashboard for your bot" },
      price: { ar: "تواصل للسعر",           en: "Contact for pricing"  }
    },
    {
      icon:  "🔧",
      color: "#00d4ff",
      title: { ar: "دعم وصيانة",             en: "Support & Maintenance"},
      desc:  { ar: "تعديل وإضافة ميزات لبوتات موجودة", en: "Edit and add features to existing bots" },
      price: { ar: "تواصل للسعر",           en: "Contact for pricing"  }
    },
  ],

  // ── روابط التنقل (sidebar + navbar) ───────────
  nav: [
    { id: "hero",     icon: "🏠", label: { ar: "الرئيسية", en: "Home"     } },
    { id: "about",    icon: "👤", label: { ar: "عني",       en: "About"    } },
    { id: "projects", icon: "📁", label: { ar: "المشاريع",  en: "Projects" } },
    { id: "services", icon: "⚙️", label: { ar: "الخدمات",   en: "Services" } },
    { id: "contact",  icon: "✉️", label: { ar: "التواصل",   en: "Contact"  } },
  ]
};
