// ============================================================================
// HFH — Export PDF / DOCX
// Étape 3.2 — Numérotation juridique fine (ONU)
// Local-first • Sans collecte de données
// ============================================================================

/**
 * Vérification douce des bibliothèques (console uniquement)
 */
(function checkLibs() {
  if (!window.jspdf) console.error("HFH: jsPDF manquant");
  if (typeof docx === "undefined") console.error("HFH: docx manquant");
  if (typeof saveAs !== "function") console.error("HFH: FileSaver manquant");
})();

// ============================================================================
// UTILITAIRES
// ============================================================================
function getValue(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

function getViolations() {
  const list = [];
  document.querySelectorAll(".vio:checked").forEach(cb => list.push(cb.value));
  return list;
}

// ============================================================================
// EXPORT PDF
// ============================================================================
function hfhExportPDF() {
  try {
    if (!window.jspdf) return;
    const { jsPDF } = window.jspdf;

    // Données formulaire
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

    // PDF setup
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

    // En-tête
    doc.setFontSize(18).setFont(undefined, "bold");
    doc.text("SIGNALEMENT HFH", margin, y);
    y += lh * 2;

    doc.setFontSize(10).setFont(undefined, "normal");
    doc.text("Document généré localement — Confidentiel", margin, y);
    y += lh * 2;

    // ===============================
    // STRUCTURE JURIDIQUE ONU — PDF
    // ===============================
    addSection(
      "1. IDENTIFICATION DU SIGNALEMENT",
      identityMode === "identified" && fullName
        ? `1.1 Identité déclarée : ${fullName}`
        : "1.1 Identité déclarée : Anonyme"
    );

    addSection(
      "1.2 Date de génération du document",
      new Date().toLocaleDateString()
    );

    addSection(
      "2. PERSONNES OU POPULATIONS AFFECTÉES",
      victims
    );

    addSection(
      "3. CONTEXTE GÉOGRAPHIQUE ET TEMPOREL",
      [
        country ? `3.1 Pays / territoire : ${country}` : "",
        dateStart ? `3.2 Date de début : ${dateStart}` : "",
        dateEnd ? `3.3 Date de fin : ${dateEnd}` : "3.3 Date de fin : en cours"
      ].filter(Boolean).join("\n")
    );

    addSection(
      "4. AUTEURS PRÉSUMÉS",
      allegedAuthors
    );

    addSection(
      "5. VIOLATIONS ALLÉGUÉES",
      violations.length ? "• " + violations.join("\n• ") : ""
    );

    addSection(
      "6. EXPOSÉ DES FAITS",
      ""
    );

    addSection(
      "6.1 Résumé des faits",
      factsSummary
    );

    addSection(
      "6.2 Faits détaillés",
      factsDetailed
    );

    addSection(
      "7. ÉLÉMENTS DE PREUVE DISPONIBLES",
      evidence
    );

    addSection(
      "8. DEMANDES ADRESSÉES AUX MÉCANISMES INTERNATIONAUX",
      requests
    );

    addSection(
      "9. CLAUSE FINALE",
      "Ce document a été généré localement. Aucune donnée n’a été transmise ni stockée."
    );

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8).setTextColor(120);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `HFH — Page ${i}/${pageCount} — ${new Date().toLocaleDateString()}`,
        margin,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save(`HFH_signalement_${Date.now()}.pdf`);
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

    // En-tête
    sections.push(
      new Paragraph({
        text: "SIGNALEMENT HFH",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        text: "Document généré localement — Confidentiel",
        alignment: AlignmentType.CENTER,
        italics: true
      }),
      new Paragraph({ text: "" })
    );

    // ===============================
    // STRUCTURE JURIDIQUE ONU — DOCX
    // ===============================
    addSection(
      "1. IDENTIFICATION DU SIGNALEMENT",
      identityMode === "identified" && fullName
        ? `1.1 Identité déclarée : ${fullName}`
        : "1.1 Identité déclarée : Anonyme"
    );

    addSection(
      "1.2 Date de génération du document",
      new Date().toLocaleDateString()
    );

    addSection(
      "2. PERSONNES OU POPULATIONS AFFECTÉES",
      victims
    );

    addSection(
      "3. CONTEXTE GÉOGRAPHIQUE ET TEMPOREL",
      [
        country ? `3.1 Pays / territoire : ${country}` : "",
        dateStart ? `3.2 Date de début : ${dateStart}` : "",
        dateEnd ? `3.3 Date de fin : ${dateEnd}` : "3.3 Date de fin : en cours"
      ].filter(Boolean).join("\n")
    );

    addSection(
      "4. AUTEURS PRÉSUMÉS",
      allegedAuthors
    );

    addSection(
      "5. VIOLATIONS ALLÉGUÉES",
      violations.length ? "• " + violations.join("\n• ") : ""
    );

    addSection(
      "6.1 Résumé des faits",
      factsSummary
    );

    addSection(
      "6.2 Faits détaillés",
      factsDetailed
    );

    addSection(
      "7. ÉLÉMENTS DE PREUVE DISPONIBLES",
      evidence
    );

    addSection(
      "8. DEMANDES ADRESSÉES AUX MÉCANISMES INTERNATIONAUX",
      requests
    );

    addSection(
      "9. CLAUSE FINALE",
      "Ce document a été généré localement. Aucune donnée n’a été transmise ni stockée."
    );

    const doc = new Document({
      sections: [{ children: sections }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `HFH_signalement_${Date.now()}.docx`);
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
