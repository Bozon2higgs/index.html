// ============================================================================
// HFH — Export PDF / DOCX
// Étape 3.4 — Base juridique (normes et traités internationaux)
// Local-first • Sans collecte de données
// ============================================================================

/**
 * Vérification douce des bibliothèques
 */
(function checkLibs() {
  if (!window.jspdf) console.error("HFH: jsPDF manquant");
  if (typeof docx === "undefined") console.error("HFH: docx manquant");
  if (typeof saveAs !== "function") console.error("HFH: FileSaver manquant");
})();

// ============================================================================
// I18N — textes générés (ONU-style)
// ============================================================================
const HFH_I18N = {
  fr: {
    title: "SIGNALEMENT HFH",
    subtitle: "Document généré localement — Confidentiel",

    identity: "1. IDENTIFICATION DU SIGNALEMENT",
    identity_named: name => `1.1 Identité déclarée : ${name}`,
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
      "Les faits décrits ci-dessus peuvent relever, à titre indicatif et non exhaustif, " +
      "des normes et instruments internationaux suivants :\n\n" +
      "• Déclaration universelle des droits de l’homme (1948)\n" +
      "• Pacte international relatif aux droits civils et politiques (PIDCP)\n" +
      "• Pacte international relatif aux droits économiques, sociaux et culturels (PIDESC)\n" +
      "• Convention contre la torture et autres peines ou traitements cruels, inhumains ou dégradants\n" +
      "• Convention relative aux droits de l’enfant (le cas échéant)\n" +
      "• Conventions de Genève et Protocoles additionnels (le cas échéant)\n\n" +
      "Cette section est fournie à des fins d’orientation générale et ne constitue pas une qualification juridique définitive.",

    clause_title: "10. CLAUSE FINALE",
    clause_text:
      "Ce document a été généré localement. Aucune donnée n’a été transmise ni stockée.",

    footer: (i, t) => `HFH — Page ${i}/${t}`
  },

  en: {
    title: "HFH COMMUNICATION",
    subtitle: "Document generated locally — Confidential",

    identity: "1. IDENTIFICATION OF THE COMMUNICATION",
    identity_named: name => `1.1 Declared identity: ${name}`,
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
      "The facts described above may fall, on an indicative and non-exhaustive basis, " +
      "within the scope of the following international norms and instruments:\n\n" +
      "• Universal Declaration of Human Rights (1948)\n" +
      "• International Covenant on Civil and Political Rights (ICCPR)\n" +
      "• International Covenant on Economic, Social and Cultural Rights (ICESCR)\n" +
      "• Convention against Torture and Other Cruel, Inhuman or Degrading Treatment or Punishment\n" +
      "• Convention on the Rights of the Child (where applicable)\n" +
      "• Geneva Conventions and Additional Protocols (where applicable)\n\n" +
      "This section is provided for general guidance purposes only and does not constitute a definitive legal qualification.",

    clause_title: "10. FINAL CLAUSE",
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

function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function getViolations() {
  const v = [];
  document.querySelectorAll(".vio:checked").forEach(cb => v.push(cb.value));
  return v;
}

// ============================================================================
// EXPORT PDF
// ============================================================================
function hfhExportPDF() {
  try {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const TXT = t();

    const identityMode = getValue("identityMode") || "anonymous";
    const fullName = getValue("fullName");
    const country = getValue("country");
    const dateStart = getValue("dateStart");
    const dateEnd = getValue("dateEnd");
    const victims = getValue("victims");
    const allegedAuthors = getValue("allegedAuthors");
    const factsSummary = getValue("factsSummary");
    const factsDetailed = getValue("factsDetailed");
    const evidence = getValue("evidence");
    const requests = getValue("requests");
    const violations = getViolations();

    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const lh = 7;
    const maxWidth = 170;

    function addSection(title, content) {
      if (!content) return;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12).setFont(undefined, "bold");
      doc.text(title, margin, y);
      y += lh;

      doc.setFontSize(10).setFont(undefined, "normal");
      const lines = doc.splitTextToSize(content, maxWidth);
      lines.forEach(line => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lh;
      });
      y += lh;
    }

    // Header
    doc.setFontSize(18).setFont(undefined, "bold");
    doc.text(TXT.title, margin, y);
    y += lh * 2;

    doc.setFontSize(10).setFont(undefined, "normal");
    doc.text(TXT.subtitle, margin, y);
    y += lh * 2;

    // Sections
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

    // === BASE JURIDIQUE ===
    addSection(TXT.legal_basis, TXT.legal_text);

    // Clause finale
    addSection(TXT.clause_title, TXT.clause_text);

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8).setTextColor(120);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        TXT.footer(i, pageCount),
        margin,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save(`HFH_signalement_${getLang()}_${Date.now()}.pdf`);
  } catch (e) {
    console.error("HFH PDF:", e);
  }
}

// ============================================================================
// EXPORT DOCX
// ============================================================================
function hfhExportDOCX() {
  try {
    if (typeof docx === "undefined" || typeof saveAs !== "function") return;
    const TXT = t();
    const { Document, Paragraph, HeadingLevel, AlignmentType, Packer } = docx;

    const identityMode = getValue("identityMode") || "anonymous";
    const fullName = getValue("fullName");
    const country = getValue("country");
    const dateStart = getValue("dateStart");
    const dateEnd = getValue("dateEnd");
    const victims = getValue("victims");
    const allegedAuthors = getValue("allegedAuthors");
    const factsSummary = getValue("factsSummary");
    const factsDetailed = getValue("factsDetailed");
    const evidence = getValue("evidence");
    const requests = getValue("requests");
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
        text: TXT.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: TXT.subtitle,
        alignment: AlignmentType.CENTER,
        italics: true
      }),
      new Paragraph({ text: "" })
    );

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

    // === BASE JURIDIQUE ===
    addSection(TXT.legal_basis, TXT.legal_text);

    // Clause finale
    addSection(TXT.clause_title, TXT.clause_text);

    const doc = new Document({
      sections: [{ children: sections }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `HFH_signalement_${getLang()}_${Date.now()}.docx`);
    });
  } catch (e) {
    console.error("HFH DOCX:", e);
  }
}

// ============================================================================
// EXPOSITION & BOUTONS
// ============================================================================
window.hfhExportPDF = hfhExportPDF;
window.hfhExportDOCX = hfhExportDOCX;

document.addEventListener("DOMContentLoaded", () => {
  const btnPDF = document.getElementById("btn-export-pdf");
  const btnDOCX = document.getElementById("btn-export-docx");

  if (btnPDF) btnPDF.addEventListener("click", e => {
    e.preventDefault();
    hfhExportPDF();
  });

  if (btnDOCX) btnDOCX.addEventListener("click", e => {
    e.preventDefault();
    hfhExportDOCX();
  });
});
