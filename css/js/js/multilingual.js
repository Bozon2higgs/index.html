// HFH - multilingual.js (ONU languages base)

const HFH_LANGUAGES = {
  fr: { title: "Générateur HFH", guide: "Guide ONU" },
  en: { title: "HFH Generator", guide: "UN Guide" },
  es: { title: "Generador HFH", guide: "Guía ONU" },
  ru: { title: "Генератор HFH", guide: "Руководство ООН" },
  ar: { title: "مولد HFH", guide: "دليل الأمم المتحدة" },
  zh: { title: "HFH 生成器", guide: "联合国指南" }
};

function setLanguage(lang) {
  const data = HFH_LANGUAGES[lang];
  if (!data) return;

  document.querySelectorAll("[data-i18n='title']").forEach(el => el.textContent = data.title);
  document.querySelectorAll("[data-i18n='guide']").forEach(el => el.textContent = data.guide);

  document.documentElement.lang = lang;
  console.log("HFH language:", lang);
}
