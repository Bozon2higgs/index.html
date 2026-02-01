// ============================================================================
// HFH — Export PDF / DOCX
// Étape 3.5 — Signature manuscrite locale (canvas)
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
      "des Pactes internationaux relatifs aux droits civils et politiques et aux droits économiques, sociaux et culturels, " +
      "ainsi que d’autres conventions internationales applicables.",
    signature: "10. SIGNATURE (FACULTATIVE)",
    clause: "11. CLAUSE FINALE",
    clause_text:
      "Ce document a été généré localement. Aucune donnée n’a été transmise ni stockée.",
    footer: (i, t) => `HFH — Page ${i}/${t}`
  },

  en: {
    title: "HFH COMMUNICATION",
    subtitle: "Document generated locally — Confidential",
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
      "the International Covenants on Civil and Political Rights and on Economic, Social and Cultural Rights, " +
      "and other applicable international conventions.",
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
function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}
function getViolations() {
  const v = [];
  document.querySelectorAll(".vio:checked").forEach(cb => v.push(cb.value));
  return v;
}
function getSignatureDataURL() {
  const canvas = document.getElementById("signatureCanvas");
  if (!canvas) return null;
  const blank = document.createElement("canvas");
  blank.width = canvas.width;
  blank.height = canvas.height;
  return canvas.toDataURL() !== blank.toDataURL()
    ? canvas.toDataURL("image/png")
    : null;
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
    const victims = getValue("victims");
    const country = getValue("country");
    const dateStart = getValue("dateStart");
    const dateEnd = getValue("dateEnd");
    const allegedAuthors = getValue("allegedAuthors");
    const factsSummary = getValue("factsSummary");
    const factsDetailed = getValue("factsDetailed");
    const evidence = getValue("evidence");
    const requests = getValue("requests");
    const violations = getViolations();
    const signature = getSignatureDataURL();

    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const lh = 7;
    const maxWidth = 170;

    function addSection(title, content) {
      if (!content) return;
      if (y > 260) {
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
    doc.setFontSize(10).text(TXT.subtitle, margin, y);
    y += lh * 2;

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

    if (signature) {
      addSection(TXT.signature, "");
      doc.addImage(signature, "PNG", margin, y, 60, 25);
      y += 35;
    }

    addSection(TXT.clause, TXT.clause_text);

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
    const { Document, Paragraph, HeadingLevel, AlignmentType, Packer, ImageRun } = docx;

    const identityMode = getValue("identityMode") || "anonymous";
    const fullName = getValue("fullName");
    const victims = getValue("victims");
    const country = getValue("country");
    const dateStart = getValue("dateStart");
    const dateEnd = getValue("dateEnd");
    const allegedAuthors = getValue("allegedAuthors");
    const factsSummary = getValue("factsSummary");
    const factsDetailed = getValue("factsDetailed");
    const evidence = getValue("evidence");
    const requests = getValue("requests");
    const violations = getViolations();
    const signature = getSignatureDataURL();

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
    addSection(TXT.legal_basis, TXT.legal_text);

    if (signature) {
      sections.push(
        new Paragraph({
          text: TXT.signature,
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: signature,
              transformation: { width: 200, height: 80 }
            })
          ]
        }),
        new Paragraph({ text: "" })
      );
    }

    addSection(TXT.clause, TXT.clause_text);

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
