/* ==================================================
   HFH — Export PDF & DOCX (FIXED)
   ================================================== */

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/* ===============================
   PDF
================================ */
document.getElementById("exportPDF")?.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(16);
  doc.text("Human For Human", 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.text(
    "Outil local et indépendant pour structurer des faits.\n" +
    "Aucune donnée n’est stockée ou transmise.",
    20,
    y
  );
  y += 12;

  doc.setFontSize(11);

  const fields = [
    ["Identité", val("identity")],
    ["Nom / Prénom", val("fullname")],
    ["Pays / Territoire", val("country")],
    ["Victimes / populations affectées", val("victims")],
    ["Résumé des faits", val("factsSummary")],
    ["Description détaillée des faits", val("factsDetailed")]
  ];

  fields.forEach(([title, content]) => {
    if (!content) return;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont(undefined, "bold");
    doc.text(title, 20, y);
    y += 6;
    doc.setFont(undefined, "normal");
    const txt = doc.splitTextToSize(content, 170);
    doc.text(txt, 20, y);
    y += txt.length * 6 + 4;
  });

  doc.save("HFH_document.pdf");
});

/* ===============================
   DOCX
================================ */
document.getElementById("exportDOCX")?.addEventListener("click", () => {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: "Human For Human",
          heading: HeadingLevel.TITLE
        }),

        new Paragraph({
          children: [new TextRun({
            text: "Outil local et indépendant pour structurer des faits.\nAucune donnée n’est stockée ou transmise.",
            size: 22
          })]
        }),

        ...build("Identité", val("identity")),
        ...build("Nom / Prénom", val("fullname")),
        ...build("Pays / Territoire", val("country")),
        ...build("Victimes / populations affectées", val("victims")),
        ...build("Résumé des faits", val("factsSummary")),
        ...build("Description détaillée des faits", val("factsDetailed"))
      ]
    }]
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, "HFH_document.docx");
  });
});

function build(title, content) {
  if (!content) return [];
  return [
    new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ children: [new TextRun({ text: content, size: 22 })] })
  ];
}
