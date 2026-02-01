function v(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

/* ========= PDF ========= */
document.getElementById("exportPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let y = 20;

  pdf.setFontSize(16);
  pdf.text("Human For Human", 20, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.text(
    "Outil local et indépendant pour structurer des faits.\n" +
    "Aucune donnée n’est stockée ou transmise.",
    20,
    y
  );
  y += 15;

  [
    ["Identité", v("identity")],
    ["Nom / Prénom", v("fullname")],
    ["Pays / Territoire", v("country")],
    ["Victimes / populations affectées", v("victims")],
    ["Résumé des faits", v("factsSummary")],
    ["Description détaillée des faits", v("factsDetailed")]
  ].forEach(([t, c]) => {
    if (!c) return;
    if (y > 260) { pdf.addPage(); y = 20; }
    pdf.setFont(undefined, "bold");
    pdf.text(t, 20, y);
    y += 6;
    pdf.setFont(undefined, "normal");
    const txt = pdf.splitTextToSize(c, 170);
    pdf.text(txt, 20, y);
    y += txt.length * 6 + 6;
  });

  pdf.save("HFH_document.pdf");
});

/* ========= DOCX ========= */
document.getElementById("exportDOCX").addEventListener("click", () => {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = window.docx;

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: "Human For Human",
          heading: HeadingLevel.TITLE
        }),
        new Paragraph({
          children: [
            new TextRun({
              text:
                "Outil local et indépendant pour structurer des faits.\n" +
                "Aucune donnée n’est stockée ou transmise.",
              size: 22
            })
          ]
        }),
        ...sec("Identité", v("identity")),
        ...sec("Nom / Prénom", v("fullname")),
        ...sec("Pays / Territoire", v("country")),
        ...sec("Victimes / populations affectées", v("victims")),
        ...sec("Résumé des faits", v("factsSummary")),
        ...sec("Description détaillée des faits", v("factsDetailed"))
      ]
    }]
  });

  Packer.toBlob(doc).then(b => saveAs(b, "HFH_document.docx"));
});

function sec(title, content) {
  if (!content) return [];
  return [
    new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ children: [new TextRun({ text: content, size: 22 })] })
  ];
}
