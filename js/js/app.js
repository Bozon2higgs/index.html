/* ==================================================
   HFH — Gestion des langues (local-only)
   - Aucune donnée utilisateur modifiée
   - Changement de langue sans rechargement
   ================================================== */

/* ------------------------------
   Traductions UI
------------------------------ */
const translations = {
  en: {
    title: "Human For Human",
    subtitle: "Local tool to structure facts related to human rights violations.",
    section_facts: "Structuration of facts",
    identity: "Identity",
    anonymous: "Anonymous",
    identified: "Identified",
    fullname: "Name / Surname",
    country: "Country / Territory",
    victims: "Victims / affected populations",
    summary: "Summary of facts",
    details: "Detailed description",
    export: "Local export",
    export_pdf: "Export PDF",
    export_docx: "Export DOCX"
  },

  fr: {
    title: "Human For Human",
    subtitle: "Outil local pour structurer des faits liés aux violations des droits humains.",
    section_facts: "Structuration des faits",
    identity: "Identité",
    anonymous: "Anonyme",
    identified: "Identifié",
    fullname: "Nom / Prénom",
    country: "Pays / Territoire",
    victims: "Victimes / populations affectées",
    summary: "Résumé des faits",
    details: "Description détaillée",
    export: "Export local",
    export_pdf: "Exporter en PDF",
    export_docx: "Exporter en DOCX"
  }
};

/* ------------------------------
   Détection automatique
------------------------------ */
let currentLang = navigator.language
  ? navigator.language.slice(0, 2)
  : "en";

if (!translations[currentLang]) {
  currentLang = "en";
}

/* ------------------------------
   Application de la langue
------------------------------ */
function applyLang(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

/* ------------------------------
   Boutons de langue
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (translations[lang]) {
        currentLang = lang;
        applyLang(currentLang);
      }
    });
  });

  // Langue initiale
  applyLang(currentLang);
});
