/**
 * ╔══════════════════════════════════════════════╗
 *         profile.js — بيانات الملف الشخصي
 *         عدّل هذا الملف بمعلوماتك الشخصية
 * ╚══════════════════════════════════════════════╝
 */
const PROFILE = {

  // ── الشعار ──────────────────────────────────────
  // ضع رابط صورة الشعار أو اتركه "" للاستخدام الافتراضي
  logoUrl: "",

  // ── معلومات Discord ──────────────────────────────
  discord: {
    userId:    "652265859905093652",
    username:  "abonebal",
    // بنر صفحة التواصل — ضع رابط صورة أو اتركه ""
    bannerUrl: "https://i.ibb.co/0jVnzvK1/abonebal-github-banner.png",
    // أفاتار احتياطي إذا فشل Lanyard — اتركه "" ليستخدم API
    avatarUrl: "https://i.ibb.co/hJVCwkT1/abonebal-github.png",
  },

  // ── معلومات GitHub ───────────────────────────────
  github: {
    username:        "abonebal-code",
    owner:           "abonebal-code",
    repo:            "bot-settings-guide-html",
    branch:          "main",
    showcasesFolder: "showcases",
  },

  // ── الاسم الظاهر في الموقع ───────────────────────
  name: {
    ar: "Abonebal",
    en: "Abonebal"
  },

  // ── الألقاب — Typewriter يدور عليها ──────────────
  titles: {
    ar: ["مطور بوتات Discord", "مطور أنظمة عائلات", "مطور JavaScript", "مطور واجهات احترافية"],
    en: ["Discord Bot Developer", "Family Systems Developer", "JavaScript Developer", "UI/UX Developer"]
  },

  // ── الوصف المختصر ────────────────────────────────
  bio: {
    ar: "أطور بوتات Discord احترافية وأنظمة متكاملة لإدارة العائلات والمجتمعات. خبرة في بناء حلول مؤتمتة قابلة للتخصيص لأي سيرفر.",
    en: "I build professional Discord bots and integrated systems for managing families and communities. Experienced in creating automated, customizable solutions for any server."
  },

  // ── سنوات الخبرة ──────────────────────────────────
  experience: {
    ar: "+3 سنة خبرة",
    en: "3+ Years Experience"
  },

  // ── المهارات ──────────────────────────────────────
  skills: [
    { name: "Discord.js",   icon: "🤖", color: "#5865f2" },
    { name: "JavaScript",   icon: "⚡", color: "#f7df1e" },
    { name: "Node.js",      icon: "🟢", color: "#57f287" },
    { name: "HTML/CSS",     icon: "🎨", color: "#e44d26" },
    { name: "JSON / APIs",  icon: "🔗", color: "#00d4ff" },
    { name: "Git / GitHub", icon: "🐙", color: "#f0a500" },
  ],

  // ── إحصائيات Hero ─────────────────────────────────
  stats: {
    ar: [
      { number: "8+",   label: "نظام مطوّر"           },
      { number: "∞",    label: "سيرفر مدعوم"          },
      { number: "100%", label: "رضا العملاء"          },
      { number: "3+",   label: "سنة خبرة"             },
    ],
    en: [
      { number: "8+",   label: "Systems Built"        },
      { number: "∞",    label: "Servers Supported"    },
      { number: "100%", label: "Client Satisfaction"  },
      { number: "3+",   label: "Years Experience"     },
    ]
  },

};
