/* ==================================================
   HFH — Human For Human
   Export PDF & DOCX (local-only)
   ================================================== */

/* -------------------------------
   Utilitaires
-------------------------------- */
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function section(title, content) {
  if (!content) return null;
  return { title, content };
}

/* ==================================================
   EXPORT PDF
================================================== */
document.getElementById("exportPDF")?.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  // Titre
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
  y += 14;

  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(11);

  const sections = [
    section("Identité", getValue("identity")),
    section("Nom / Prénom", getValue("fullname")),
    section("Pays / Territoire", getValue("country")),
    section("Victimes / populations affectées", getValue("victims")),
    section("Résumé des faits", getValue("factsSummary")),
    section("Description détaillée des faits", getValue("factsDetailed"))
  ];

  sections.forEach(sec => {
    if (!sec) return;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont(undefined, "bold");
    doc.text(sec.title, 20, y);
    y += 6;

    doc.setFont(undefined, "normal");
    const text = doc.splitTextToSize(sec.content, 170);
    doc.text(text, 20, y);
    y += text.length * 6 + 6;
  });

  // Pied de page
  doc.setFontSize(8);
  doc.text(
    "Document généré localement avec HFH — Human For Human.\n" +
    "HFH ne collecte, ne stocke et ne transmet aucune donnée.",
    20,
    285
  );

  doc.save("HFH_document.pdf");
});

/* ==================================================
   EXPORT DOCX
================================================== */
document.getElementById("exportDOCX")?.addEventListener("click", () => {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel
  } = window.docx;

  const doc = new Document({
    sections: [
      {
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

          new Paragraph({ text: "" }),

          ...buildDocxSection("Identité", getValue("identity")),
          ...buildDocxSection("Nom / Prénom", getValue("fullname")),
          ...buildDocxSection("Pays / Territoire", getValue("country")),
          ...buildDocxSection(
            "Victimes / populations affectées",
            getValue("victims")
          ),
          ...buildDocxSection(
            "Résumé des faits",
            getValue("factsSummary")
          ),
          ...buildDocxSection(
            "Description détaillée des faits",
            getValue("factsDetailed")
          ),

          new Paragraph({ text: "" }),

          new Paragraph({
            children: [
              new TextRun({
                text:
                  "Document généré localement avec HFH — Human For Human.\n" +
                  "HFH ne collecte, ne stocke et ne transmet aucune donnée.",
                italics: true,
                size: 18
              })
            ]
          })
        ]
      }
    ]
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, "HFH_document.docx");
  });
});

/* -------------------------------
   Helper DOCX
-------------------------------- */
function buildDocxSection(title, content) {
  if (!content) return [];

  return [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_2
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: content,
          size: 22
        })
      ]
    }),
    new Paragraph({ text: "" })
  ];
}
