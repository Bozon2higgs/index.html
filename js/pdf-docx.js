// ============================================================================
// HFH — Export PDF / DOCX
// Étape 3.6 — Mode Communication urgente ONU
// Local-first • Sans collecte de données
// ============================================================================

// ============================================================================
// I18N — Textes générés (ONU)
// ============================================================================
const HFH_I18N = {
  fr: {
    title_standard: "SIGNALEMENT HFH",
    title_urgent: "COMMUNICATION URGENTE — HFH",
    subtitle_standard: "Document généré localement — Confidentiel",
    subtitle_urgent:
      "Communication urgente — Risque de préjudice irréparable — Confidentiel",

    urgent_section_title: "COMMUNICATION URGENTE",
    urgent_section_text:
      "Cette communication est transmise à titre urgent en raison d’un risque " +
      "imminent ou continu de préjudice grave ou irréparable pour les personnes " +
      "ou populations concernées.",

    identity: "1. IDENTIFICATION DU SIGNALEMENT",
    identity_named: n => `1.1 Identité déclarée : ${n}`,
    identity_anon: "1.1 Identité déclarée : Anonyme",
    generated: "1.2 Date de génération du document",

    affected: "2. PERSONNES OU POPULATIONS AFFECTÉES",
    context: "3. CONTEXTE GÉOGRAPHIQUE ET TEMPOREL",
    country: c => `3.1 Pays / territoire : ${c}`,
    start: d => `3.2 Date de début : ${d}`,
    end: d => `3.3 Date de fin : ${d}`,
    ongoing: "3.3 Date de fin : en cours",

    authors: "4. AUTEURS PRÉSUMÉS",
    violations: "5. VIOLATIONS ALLÉGUÉES",

    facts_summary: "6.1 Résumé des faits",
    facts_detailed: "6.2 Faits détaillés",

    evidence: "7. ÉLÉMENTS DE PREUVE DISPONIBLES",
    requests: "8. DEMANDES ADRESSÉES AUX MÉCANISMES INTERNATIONAUX",

    legal_basis: "9. BASE JURIDIQUE INTERNATIONALE (INDICATIVE)",
    legal_text:
      "Les faits décrits peuvent relever notamment de la Déclaration universelle des droits de l’homme, " +
      "des Pactes internationaux relatifs aux droits civils et politiques et aux droits économiques, " +
      "sociaux et culturels, ainsi que d’autres conventions internationales applicables.",

    signature: "10. SIGNATURE (FACULTATIVE)",

    clause: "11. CLAUSE FINALE",
    clause_text:
      "Ce document a été généré localement. Aucune donnée n’a été transmise ni stockée.",

    footer: (i, t) => `HFH — Page ${i}/${t}`
  },

  en: {
    title_standard: "HFH COMMUNICATION",
    title_urgent: "URGENT COMMUNICATION — HFH",
    subtitle_standard: "Document generated locally — Confidential",
    subtitle_urgent:
      "Urgent communication — Risk of irreparable harm — Confidential",

    urgent_section_title: "URGENT COMMUNICATION",
    urgent_section_text:
      "This communication is submitted on an urgent basis due to an imminent or " +
      "ongoing risk of serious or irreparable harm to the persons or populations concerned.",

    identity: "1. IDENTIFICATION OF THE COMMUNICATION",
    identity_named: n => `1.1 Declared identity: ${n}`,
    identity_anon: "1.1 Declared identity: Anonymous",
    generated: "1.2 Document generation date",

    affected: "2. AFFECTED PERSONS OR POPULATIONS",
    context: "3. GEOGRAPHICAL AND TEMPORAL CONTEXT",
    country: c => `3.1 Country / territory: ${c}`,
    start: d => `3.2 Start date: ${d}`,
    end: d => `3.3 End date: ${d}`,
    ongoing: "3.3 End date: ongoing",

    authors: "4. ALLEGED PERPETRATORS",
    violations: "5. ALLEGED VIOLATIONS",

    facts_summary: "6.1 Summary of facts",
    facts_detailed: "6.2 Detailed facts",

    evidence: "7. AVAILABLE EVIDENCE",
    requests: "8. REQUESTS TO INTERNATIONAL MECHANISMS",

    legal_basis: "9. INTERNATIONAL LEGAL BASIS (INDICATIVE)",
    legal_text:
      "The facts described may fall under the Universal Declaration of Human Rights, " +
      "the International Covenants on Civil and Political Rights and on Economic, Social " +
      "and Cultural Rights, as well as other applicable international conventions.",

    signature: "10. SIGNATURE (OPTIONAL)",

    clause: "11. FINAL CLAUSE",
    clause_text:
      "This document was generated locally. No data was transmitted or stored.",

    footer: (i, t) => `HFH — Page ${i}/${t}`
  }
};

// ============================================================================
// UTILITAIRES
// ============================================================================
function getLang() {
  return document.getElementById("langSelect")?.value || "fr";
}
function t() {
  return HFH_I18N[getLang()] || HFH_I18N.fr;
}
function v(id) {
  return document.getElementById(id)?.value?.trim() || "";
}
function getViolations() {
  const out = [];
  document.querySelectorAll(".vio:checked").forEach(cb => out.push(cb.value));
  return out;
}
function getUrgencyMode() {
  return document.getElementById("communicationMode")?.value === "urgent";
}

// ============================================================================
// EXPORT PDF
// ============================================================================
function hfhExportPDF() {
  const TXT = t();
  const urgent = getUrgencyMode();

  const identityMode = v("identityMode") || "anonymous";
  const fullName = v("fullName");
  const victims = v("victims");
  const country = v("country");
  const dateStart = v("dateStart");
  const dateEnd = v("dateEnd");
  const allegedAuthors = v("allegedAuthors");
  const factsSummary = v("factsSummary");
  const factsDetailed = v("factsDetailed");
  const evidence = v("evidence");
  const requests = v("requests");
  const violations = getViolations();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;
  const m = 20;
  const lh = 7;
  const maxW = 170;

  function addSection(title, content) {
    if (!content) return;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12).setFont(undefined, "bold");
    doc.text(title, m, y);
    y += lh;
    doc.setFontSize(10).setFont(undefined, "normal");
    doc.splitTextToSize(content, maxW).forEach(line => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, m, y);
      y += lh;
    });
    y += lh;
  }

  doc.setFontSize(18).setFont(undefined, "bold");
  doc.text(urgent ? TXT.title_urgent : TXT.title_standard, m, y);
  y += lh * 2;
  doc.setFontSize(10);
  doc.text(urgent ? TXT.subtitle_urgent : TXT.subtitle_standard, m, y);
  y += lh * 2;

  if (urgent) {
    addSection(TXT.urgent_section_title, TXT.urgent_section_text);
  }

  addSection(
    TXT.identity,
    identityMode === "identified" && fullName
      ? TXT.identity_named(fullName)
      : TXT.identity_anon
  );
  addSection(TXT.generated, new Date().toLocaleDateString());
  addSection(TXT.affected, victims);
  addSection(
    TXT.context,
    [
      country ? TXT.country(country) : "",
      dateStart ? TXT.start(dateStart) : "",
      dateEnd ? TXT.end(dateEnd) : TXT.ongoing
    ].filter(Boolean).join("\n")
  );
  addSection(TXT.authors, allegedAuthors);
  addSection(
    TXT.violations,
    violations.length ? "• " + violations.join("\n• ") : ""
  );
  addSection(TXT.facts_summary, factsSummary);
  addSection(TXT.facts_detailed, factsDetailed);
  addSection(TXT.evidence, evidence);
  addSection(TXT.requests, requests);
  addSection(TXT.legal_basis, TXT.legal_text);
  addSection(TXT.clause, TXT.clause_text);

  const pages = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.text(
      TXT.footer(i, pages),
      m,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  doc.save(
    `HFH_${urgent ? "urgent_" : ""}${getLang()}_${Date.now()}.pdf`
  );
}

// ============================================================================
// EXPORT DOCX
// ============================================================================
function hfhExportDOCX() {
  const TXT = t();
  const urgent = getUrgencyMode();
  const { Document, Paragraph, HeadingLevel, AlignmentType, Packer } = docx;

  const identityMode = v("identityMode") || "anonymous";
  const fullName = v("fullName");
  const victims = v("victims");
  const country = v("country");
  const dateStart = v("dateStart");
  const dateEnd = v("dateEnd");
  const allegedAuthors = v("allegedAuthors");
  const factsSummary = v("factsSummary");
  const factsDetailed = v("factsDetailed");
  const evidence = v("evidence");
  const requests = v("requests");
  const violations = getViolations();

  const sections = [];

  function addSection(title, content) {
    if (!content) return;
    sections.push(
      new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: content }),
      new Paragraph({ text: "" })
    );
  }

  sections.push(
    new Paragraph({
      text: urgent ? TXT.title_urgent : TXT.title_standard,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER
    }),
    new Paragraph({
      text: urgent ? TXT.subtitle_urgent : TXT.subtitle_standard,
      alignment: AlignmentType.CENTER,
      italics: true
    }),
    new Paragraph({ text: "" })
  );

  if (urgent) {
    addSection(TXT.urgent_section_title, TXT.urgent_section_text);
  }

  addSection(
    TXT.identity,
    identityMode === "identified" && fullName
      ? TXT.identity_named(fullName)
      : TXT.identity_anon
  );
  addSection(TXT.generated, new Date().toLocaleDateString());
  addSection(TXT.affected, victims);
  addSection(
    TXT.context,
    [
      country ? TXT.country(country) : "",
      dateStart ? TXT.start(dateStart) : "",
      dateEnd ? TXT.end(dateEnd) : TXT.ongoing
    ].filter(Boolean).join("\n")
  );
  addSection(TXT.authors, allegedAuthors);
  addSection(
    TXT.violations,
    violations.length ? "• " + violations.join("\n• ") : ""
  );
  addSection(TXT.facts_summary, factsSummary);
  addSection(TXT.facts_detailed, factsDetailed);
  addSection(TXT.evidence, evidence);
  addSection(TXT.requests, requests);
  addSection(TXT.legal_basis, TXT.legal_text);
  addSection(TXT.clause, TXT.clause_text);

  const doc = new Document({ sections: [{ children: sections }] });

  Packer.toBlob(doc).then(blob => {
    saveAs(
      blob,
      `HFH_${urgent ? "urgent_" : ""}${getLang()}_${Date.now()}.docx`
    );
  });
}

// ============================================================================
// EXPOSITION + BOUTONS
// ============================================================================
window.hfhExportPDF = hfhExportPDF;
window.hfhExportDOCX = hfhExportDOCX;

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("btn-export-pdf")
    ?.addEventListener("click", e => {
      e.preventDefault();
      hfhExportPDF();
    });

  document
    .getElementById("btn-export-docx")
    ?.addEventListener("click", e => {
      e.preventDefault();
      hfhExportDOCX();
    });
});
