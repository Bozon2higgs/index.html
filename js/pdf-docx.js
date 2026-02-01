// ============================================================================
// HFH — Export PDF / DOCX (local-first, sécurisé, stable)
// ============================================================================

/**
 * Vérification minimale des bibliothèques (signal développeur uniquement)
 */
(function checkLibs() {
  if (!window.jspdf) {
    console.error("HFH: bibliothèque jsPDF manquante");
  }
  if (typeof docx === "undefined") {
    console.error("HFH: bibliothèque docx manquante");
  }
  if (typeof saveAs !== "function") {
    console.error("HFH: bibliothèque FileSaver manquante");
  }
})();

// ============================================================================
// UTILITAIRE — récupération sécurisée des faits
// ============================================================================
function getFactsCombined() {
  const factsSummary =
    document.getElementById("factsSummary")?.value?.trim() || "";

  const factsDetailed =
    document.getElementById("factsDetailed")?.value?.trim() || "";

  return [factsSummary, factsDetailed].filter(Boolean).join("\n\n");
}

// ============================================================================
// EXPORT PDF
// ============================================================================
function hfhExportPDF() {
  try {
    if (!window.jspdf) {
      console.error("HFH PDF: jsPDF indisponible");
      return;
    }

    const { jsPDF } = window.jspdf;

    // Données formulaire
    const identityMode = document.getElementById("identityMode")?.value || "anonymous";
    const fullName = document.getElementById("fullName")?.value || "";
    const residence = document.getElementById("residence")?.value || "";
    const country = document.getElementById("country")?.value || "";
    const dateStart = document.getElementById("dateStart")?.value || "";
    const dateEnd = document.getElementById("dateEnd")?.value || "";
    const victims = document.getElementById("victims")?.value || "";
    const allegedAuthors = document.getElementById("allegedAuthors")?.value || "";
    const evidence = document.getElementById("evidence")?.value || "";
    const requests = document.getElementById("requests")?.value || "";
    const facts = getFactsCombined();

    const violations = [];
    document.querySelectorAll(".vio:checked").forEach(cb =>
      violations.push(cb.value)
    );

    // Création PDF
    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = 170;

    function addSection(title, content) {
      if (!content) return;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12).setFont(undefined, "bold");
      doc.text(title, margin, y);
      y += lineHeight;

      doc.setFontSize(10).setFont(undefined, "normal");
      const lines = doc.splitTextToSize(content, maxWidth);

      lines.forEach(line => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      y += lineHeight;
    }

    // En-tête
    doc.setFontSize(18).setFont(undefined, "bold");
    doc.text("SIGNALEMENT HFH", margin, y);
    y += lineHeight * 2;

    doc.setFontSize(10).setFont(undefined, "normal");
    doc.text("Document généré localement — Confidentiel", margin, y);
    y += lineHeight * 2;

    // Sections
    addSection("IDENTITÉ", identityMode === "identified" && fullName ? fullName : "Anonyme");
    addSection("LIEU DE RÉSIDENCE", residence);
    addSection("PAYS / TERRITOIRE CONCERNÉ", country);
    addSection("PÉRIODE — DÉBUT", dateStart);
    addSection("PÉRIODE — FIN", dateEnd);
    addSection("VICTIMES / POPULATIONS AFFECTÉES", victims);
    addSection("AUTEURS PRÉSUMÉS", allegedAuthors);
    addSection("VIOLATIONS ALLÉGUÉES", violations.length ? "• " + violations.join("\n• ") : "");
    addSection("FAITS", facts);
    addSection("PREUVES / ANNEXES", evidence);
    addSection("DEMANDES", requests);

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

    doc.save(`HFH_plainte_ONU_${Date.now()}.pdf`);
  } catch (err) {
    console.error("HFH PDF:", err);
  }
}

// ============================================================================
// EXPORT DOCX
// ============================================================================
function hfhExportDOCX() {
  try {
    if (typeof docx === "undefined" || typeof saveAs !== "function") {
      console.error("HFH DOCX: bibliothèques manquantes");
      return;
    }

    const { Document, Paragraph, HeadingLevel, AlignmentType, Packer } = docx;

    const identityMode = document.getElementById("identityMode")?.value || "anonymous";
    const fullName = document.getElementById("fullName")?.value || "";
    const residence = document.getElementById("residence")?.value || "";
    const country = document.getElementById("country")?.value || "";
    const dateStart = document.getElementById("dateStart")?.value || "";
    const dateEnd = document.getElementById("dateEnd")?.value || "";
    const victims = document.getElementById("victims")?.value || "";
    const allegedAuthors = document.getElementById("allegedAuthors")?.value || "";
    const evidence = document.getElementById("evidence")?.value || "";
    const requests = document.getElementById("requests")?.value || "";
    const facts = getFactsCombined();

    const violations = [];
    document.querySelectorAll(".vio:checked").forEach(cb =>
      violations.push(cb.value)
    );

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

    addSection("IDENTITÉ", identityMode === "identified" && fullName ? fullName : "Anonyme");
    addSection("LIEU DE RÉSIDENCE", residence);
    addSection("PAYS / TERRITOIRE CONCERNÉ", country);
    addSection("PÉRIODE — DÉBUT", dateStart);
    addSection("PÉRIODE — FIN", dateEnd);
    addSection("VICTIMES / POPULATIONS AFFECTÉES", victims);
    addSection("AUTEURS PRÉSUMÉS", allegedAuthors);
    addSection("VIOLATIONS ALLÉGUÉES", violations.length ? "• " + violations.join("\n• ") : "");
    addSection("FAITS", facts);
    addSection("PREUVES / ANNEXES", evidence);
    addSection("DEMANDES", requests);

    sections.push(
      new Paragraph({
        text: `HFH — Généré le ${new Date().toLocaleString()}`,
        alignment: AlignmentType.CENTER,
        italics: true
      })
    );

    const doc = new Document({
      sections: [{ children: sections }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `HFH_plainte_ONU_${Date.now()}.docx`);
    });
  } catch (err) {
    console.error("HFH DOCX:", err);
  }
}

// ============================================================================
// EXPOSITION & LISTENERS
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

