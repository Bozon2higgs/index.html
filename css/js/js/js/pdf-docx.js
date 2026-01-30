/*
  HFH - pdf-docx.js
  Exports: PDF (jsPDF) + DOCX (docx + FileSaver)
*/

function hfhSafeFilename(name) {
  return (name || "HFH_document")
    .toString()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "");
}

function hfhGenerateText() {
  const facts = (document.getElementById("facts")?.value || "").trim();
  const date = new Date().toISOString().split("T")[0];

  return [
    "HFH — Document de signalement (modèle)",
    "",
    "Date : " + date,
    "",
    "I. Identité du déclarant",
    "Nom : Higgs",
    "Prénom : Boson",
    "Lieu : Espace-Temps Infini",
    "",
    "II. État(s) concerné(s)",
    "(À compléter dans une version avancée)",
    "",
    "III. Période concernée",
    "(Automatique ou manuelle — version avancée)",
    "",
    "IV. Exposé des faits",
    facts ? facts : "(Veuillez saisir un résumé des faits.)",
    "",
    "V. Qualification juridique (indicative)",
    "(Version avancée)",
    "",
    "VI. Preuves / Annexes",
    "(Images, vidéos, documents — version avancée)",
    "",
    "VII. Modalités de transmission",
    "(Email/formulaire selon mécanisme — version avancée)",
    "",
    "Déclaration :",
    "Les informations sont fournies de bonne foi, sous réserve d'appréciation par les mécanismes compétents.",
    "",
    "Signature :",
    "(Signature manuscrite à intégrer — version avancée)"
  ].join("\n");
}

function hfhExportPDF(filenameBase) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("jsPDF non chargé (vérifie index.html).");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const text = hfhGenerateText();
  const lines = doc.splitTextToSize(text, 180);

  doc.setFont("Times", "Normal");
  doc.setFontSize(11);
  doc.text(lines, 10, 20);

  doc.save(hfhSafeFilename(filenameBase || "HFH_plainte_ONU") + ".pdf");
}

function hfhExportDOCX(filenameBase) {
  if (!window.docx || !window.saveAs) {
    alert("docx/FileSaver non chargés (vérifie index.html).");
    return;
  }
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const lines = hfhGenerateText().split("\n");

  const doc = new Document({
    sections: [{
      children: lines.map(line => new Paragraph({
        children: [new TextRun({ text: line, size: 22 })]
      }))
    }]
  });

  Packer.toBlob(doc).then(blob => {
    window.saveAs(blob, hfhSafeFilename(filenameBase || "HFH_plainte_ONU") + ".docx");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("exportPDF")?.addEventListener("click", () => hfhExportPDF("HFH_plainte_ONU"));
  document.getElementById("exportDOCX")?.addEventListener("click", () => hfhExportDOCX("HFH_plainte_ONU"));
});
