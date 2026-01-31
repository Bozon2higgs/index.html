// ============================================================================
// HFH - Export PDF/DOCX - Version corrigée pour IDs exacts
// ============================================================================

console.log('✓ pdf-docx.js chargé');

// ============================================================================
// FONCTION EXPORT PDF
// ============================================================================
function hfhExportPDF() {
    console.log('→ hfhExportPDF appelé');
    
    try {
        // Vérifier jsPDF
        if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            alert('Erreur: Bibliothèque jsPDF non disponible.');
            return;
        }
        
        const { jsPDF } = window.jspdf || window;
        
        // Récupérer les données avec les IDs EXACTS de votre HTML
        const identityMode = document.getElementById('identityMode')?.value || 'anonymous';
        const fullName = document.getElementById('fullName')?.value || '';
        const residence = document.getElementById('residence')?.value || '';
        const country = document.getElementById('country')?.value || '';
        const dateStart = document.getElementById('dateStart')?.value || '';
        const dateEnd = document.getElementById('dateEnd')?.value || '';
        const victims = document.getElementById('victims')?.value || '';
        const allegedAuthors = document.getElementById('allegedAuthors')?.value || '';
        const facts = document.getElementById('facts')?.value || '';
        const evidence = document.getElementById('evidence')?.value || '';
        const requests = document.getElementById('requests')?.value || '';
        
        // Récupérer les violations cochées
        const violations = [];
        document.querySelectorAll('.vio:checked').forEach(cb => {
            violations.push(cb.value);
        });
        
        // Créer le PDF
        const doc = new jsPDF();
        let y = 20;
        const lineHeight = 7;
        const margin = 20;
        const maxWidth = 170;
        
        // En-tête
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('SIGNALEMENT HFH', margin, y);
        y += lineHeight * 2;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Document généré localement - Confidentiel', margin, y);
        y += lineHeight * 2;
        
        // Fonction pour ajouter une section
        function addSection(title, content) {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin, y);
            y += lineHeight;
            
            if (content) {
                doc.setFontSize(10);
                doc.setFont(undefined, 'normal');
                const lines = doc.splitTextToSize(content, maxWidth);
                lines.forEach(line => {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(line, margin, y);
                    y += lineHeight;
                });
            }
            y += lineHeight;
        }
        
        // Ajouter les sections
        if (identityMode === 'identified' && fullName) {
            addSection('IDENTITÉ', fullName);
        } else {
            addSection('IDENTITÉ', 'Anonyme');
        }
        
        if (residence) addSection('LIEU DE RÉSIDENCE', residence);
        if (country) addSection('PAYS/TERRITOIRE CONCERNÉ', country);
        if (dateStart) addSection('PÉRIODE - DÉBUT', dateStart);
        if (dateEnd) addSection('PÉRIODE - FIN', dateEnd);
        if (victims) addSection('VICTIMES / POPULATIONS AFFECTÉES', victims);
        if (allegedAuthors) addSection('AUTEURS PRÉSUMÉS', allegedAuthors);
        
        if (violations.length > 0) {
            addSection('VIOLATIONS ALLÉGUÉES', violations.join('\n• '));
        }
        
        if (facts) addSection('FAITS DÉTAILLÉS', facts);
        if (evidence) addSection('PREUVES / ANNEXES', evidence);
        if (requests) addSection('DEMANDES', requests);
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128);
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                'HFH - Page ' + i + '/' + pageCount + ' - ' + new Date().toLocaleDateString(),
                margin,
                doc.internal.pageSize.getHeight() - 10
            );
        }
        
        // Télécharger
        const filename = 'HFH_plainte_ONU_' + Date.now() + '.pdf';
        doc.save(filename);
        
        console.log('✓ PDF généré:', filename);
        
    } catch (error) {
        console.error('ERREUR PDF:', error);
        alert('Erreur lors de la génération du PDF:\n' + error.message);
    }
}

// ============================================================================
// FONCTION EXPORT DOCX
// ============================================================================
function hfhExportDOCX() {
    console.log('→ hfhExportDOCX appelé');
    
    try {
        // Vérifier les bibliothèques
        if (typeof docx === 'undefined') {
            alert('Erreur: Bibliothèque docx non disponible.');
            return;
        }
        
        if (typeof saveAs === 'undefined') {
            alert('Erreur: Bibliothèque FileSaver non disponible.');
            return;
        }
        
        const { Document, Paragraph, HeadingLevel, AlignmentType, Packer } = docx;
        
        // Récupérer les données avec les IDs EXACTS de votre HTML
        const identityMode = document.getElementById('identityMode')?.value || 'anonymous';
        const fullName = document.getElementById('fullName')?.value || '';
        const residence = document.getElementById('residence')?.value || '';
        const country = document.getElementById('country')?.value || '';
        const dateStart = document.getElementById('dateStart')?.value || '';
        const dateEnd = document.getElementById('dateEnd')?.value || '';
        const victims = document.getElementById('victims')?.value || '';
        const allegedAuthors = document.getElementById('allegedAuthors')?.value || '';
        const facts = document.getElementById('facts')?.value || '';
        const evidence = document.getElementById('evidence')?.value || '';
        const requests = document.getElementById('requests')?.value || '';
        
        // Récupérer les violations
        const violations = [];
        document.querySelectorAll('.vio:checked').forEach(cb => {
            violations.push(cb.value);
        });
        
        // Construire le document
        const sections = [];
        
        // En-tête
        sections.push(
            new Paragraph({
                text: 'SIGNALEMENT HFH',
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: '' }),
            new Paragraph({
                text: 'Document généré localement - Confidentiel',
                alignment: AlignmentType.CENTER,
                italics: true,
            }),
            new Paragraph({ text: '' })
        );
        
        // Fonction pour ajouter une section
        function addSection(title, content) {
            if (content) {
                sections.push(
                    new Paragraph({
                        text: title,
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({ text: content }),
                    new Paragraph({ text: '' })
                );
            }
        }
        
        // Ajouter les sections
        if (identityMode === 'identified' && fullName) {
            addSection('IDENTITÉ', fullName);
        } else {
            addSection('IDENTITÉ', 'Anonyme');
        }
        
        if (residence) addSection('LIEU DE RÉSIDENCE', residence);
        if (country) addSection('PAYS/TERRITOIRE CONCERNÉ', country);
        if (dateStart) addSection('PÉRIODE - DÉBUT', dateStart);
        if (dateEnd) addSection('PÉRIODE - FIN', dateEnd);
        if (victims) addSection('VICTIMES / POPULATIONS AFFECTÉES', victims);
        if (allegedAuthors) addSection('AUTEURS PRÉSUMÉS', allegedAuthors);
        
        if (violations.length > 0) {
            addSection('VIOLATIONS ALLÉGUÉES', violations.join('\n• '));
        }
        
        if (facts) addSection('FAITS DÉTAILLÉS', facts);
        if (evidence) addSection('PREUVES / ANNEXES', evidence);
        if (requests) addSection('DEMANDES', requests);
        
        // Footer
        sections.push(
            new Paragraph({ text: '' }),
            new Paragraph({
                text: 'HFH - Généré le ' + new Date().toLocaleString(),
                alignment: AlignmentType.CENTER,
                italics: true,
            })
        );
        
        // Créer le document
        const doc = new Document({
            sections: [{
                properties: {},
                children: sections,
            }],
        });
        
        // Générer et télécharger
        Packer.toBlob(doc).then(function(blob) {
            const filename = 'HFH_plainte_ONU_' + Date.now() + '.docx';
            saveAs(blob, filename);
            console.log('✓ DOCX généré:', filename);
        }).catch(function(error) {
            console.error('ERREUR DOCX:', error);
            alert('Erreur lors de la génération du DOCX:\n' + error.message);
        });
        
    } catch (error) {
        console.error('ERREUR DOCX:', error);
        alert('Erreur lors de la génération du DOCX:\n' + error.message);
    }
}

// ============================================================================
// EXPOSITION GLOBALE
// ============================================================================
window.hfhExportPDF = hfhExportPDF;
window.hfhExportDOCX = hfhExportDOCX;

// ============================================================================
// ATTACHER LES EVENT LISTENERS AUX BOUTONS
// ============================================================================
function initExportButtons() {
    console.log('→ Initialisation des boutons d\'export');
    
    const btnPDF = document.getElementById('btn-export-pdf');
    const btnDOCX = document.getElementById('btn-export-docx');
    
    if (btnPDF) {
        btnPDF.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('→ Clic sur bouton PDF');
            hfhExportPDF();
        });
        console.log('✓ Event listener PDF attaché');
    } else {
        console.error('✗ Bouton PDF non trouvé (id: btn-export-pdf)');
    }
    
    if (btnDOCX) {
        btnDOCX.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('→ Clic sur bouton DOCX');
            hfhExportDOCX();
        });
        console.log('✓ Event listener DOCX attaché');
    } else {
        console.error('✗ Bouton DOCX non trouvé (id: btn-export-docx)');
    }
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExportButtons);
} else {
    initExportButtons();
}

// Vérification
setTimeout(function() {
    if (typeof window.hfhExportPDF === 'function' && typeof window.hfhExportDOCX === 'function') {
        console.log('✓✓✓ Système HFH opérationnel ✓✓✓');
    } else {
        console.error('✗ Erreur: fonctions d\'export non disponibles');
    }
}, 200);
