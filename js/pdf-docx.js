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
  const identityMode = document.getElementById("identityMode")?.value || "identified";
  const fullName = (document.getElementById("fullName")?.value || "").trim();
  const residence = (document.getElementById("residence")?.value || "").trim();
  const country = (document.getElementById("country")?.value || "").trim();
  const dateStart = document.getElementById("dateStart")?.value || "";
  const dateEnd = document.getElementById("dateEnd")?.value || "";
  const victims = (document.getElementById("victims")?.value || "").trim();
  const allegedAuthors = (document.getElementById("allegedAuthors")?.value || "").trim();
  const facts = (document.getElementById("facts")?.value || "").trim();
  const evidence = (document.getElementById("evidence")?.value || "").trim();
  const requests = (document.getElementById("requests")?.value || "").trim();

  const violations = Array.from(document.querySelectorAll(".vio:checked")).map(cb => cb.value);
  const dateNow = new Date().toISOString().split("T")[0];

  const identityBlock = identityMode === "anonymous"
    ? ["Identité : ANONYME", "Nom/Prénom : (non communiqué)"]
    : ["Identité : IDENTIFIÉ", `Nom/Prénom : ${fullName || "(à compléter)"}`];

  const residenceLine = residence ? `Résidence : ${residence}` : "Résidence : (non communiqué)";
  const periodLine = (dateStart || dateEnd)
    ? `Période : ${dateStart || "??"} → ${dateEnd || "??"}`
    : "Période : (à compléter)";

  return [
    "HFH — Dossier de signalement (modèle de forme)",
    "",
    `Date : ${dateNow}`,
    "",
    "1) Informations sur l’auteur du signalement",
    ...identityBlock,
    residenceLine,
    "",
    "2) Champ géographique et temporel",
    `Pays / territoire concerné : ${country || "(à compléter)"}`,
    periodLine,
    "",
    "3) Parties et populations affectées",
    "Victimes / populations affectées :",
    victims || "(à compléter)",
    "",
    "Auteurs présumés / responsables (si connus) :",
    allegedAuthors || "(non renseigné)",
    "",
    "4) Violations alléguées (indicatif)",
    violations.length ? ("- " + violations.join("\n- ")) : "(non sélectionné)",
    "",
    "5) Exposé des faits (chronologie)",
    facts || "(à compléter)",
    "",
    "6) Preuves / annexes",
    evidence || "(à compléter : liste de documents, liens, références, témoignages…)",
    "",
    "7) Demandes adressées au mécanisme compétent",
    requests || "(à compléter : enquête, communication, suivi, recommandations…)",
    "",
    "8) Déclaration",
    "Je déclare que les informations fournies sont données de bonne foi et au mieux de mes connaissances.",
    "",
    "9) Signature",
    identityMode === "anonymous" ? "(non signée — signalement anonyme)" : "(signature à joindre si nécessaire)"
  ].join("\n");
}

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

// Exposer les fonctions globalement (OBLIGATOIRE pour Tor / Firefox strict)
window.hfhExportPDF = hfhExportPDF;
window.hfhExportDOCX = hfhExportDOCX;
window.hfhExportPDF = hfhExportPDF;
window.hfhExportDOCX = hfhExportDOCX;
