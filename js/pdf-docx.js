// ============================================================================
// HFH - Générateur PDF/DOCX Local-First
// Compatible: Firefox, Tor Browser, GitHub Pages
// Aucune dépendance backend, exécution 100% client
// ============================================================================

console.log('✓ pdf-docx.js chargé');

// ============================================================================
// FONCTION 1: Export PDF avec jsPDF
// ============================================================================

function hfhExportPDF(filename) {
    console.log('→ hfhExportPDF appelé avec:', filename);
    
    try {
        // Vérifier que jsPDF est disponible
        if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
            alert('ERREUR: Bibliothèque jsPDF non chargée.\nVérifiez que le CDN est accessible.');
            return;
        }
        
        const { jsPDF } = window.jspdf || window;
        
        // Récupérer les valeurs du formulaire
        const identite = document.querySelector('input[name="identite"]:checked')?.value || 'anonyme';
        const nomPrenom = document.getElementById('nom-prenom')?.value || '';
        const lieu = document.getElementById('lieu')?.value || '';
        const pays = document.getElementById('pays')?.value || '';
        const dateDebut = document.getElementById('date-debut')?.value || '';
        const dateFin = document.getElementById('date-fin')?.value || '';
        const victimes = document.getElementById('victimes')?.value || '';
        const auteurs = document.getElementById('auteurs')?.value || '';
        const faits = document.getElementById('faits')?.value || '';
        const preuves = document.getElementById('preuves')?.value || '';
        const demandes = document.getElementById('demandes')?.value || '';
        const resume = document.getElementById('resume')?.value || '';
        
        // Récupérer les violations cochées
        const violations = [];
        document.querySelectorAll('input[name="violations"]:checked').forEach(cb => {
            violations.push(cb.nextElementSibling.textContent.trim());
        });
        
        // Créer le PDF
        const doc = new jsPDF();
        let yPos = 20;
        const lineHeight = 7;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxWidth = pageWidth - 2 * margin;
        
        // En-tête
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('SIGNALEMENT HFH', margin, yPos);
        yPos += lineHeight * 2;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Document généré localement - Confidentiel', margin, yPos);
        yPos += lineHeight * 2;
        
        // Fonction pour ajouter une section
        function addSection(title, content) {
            // Vérifier si on doit changer de page
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin, yPos);
            yPos += lineHeight;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            if (content) {
                const lines = doc.splitTextToSize(content, maxWidth);
                lines.forEach(line => {
                    if (yPos > 280) {
                        doc.addPage();
                        yPos = 20;
                    }
                    doc.text(line, margin, yPos);
                    yPos += lineHeight;
                });
            }
            
            yPos += lineHeight;
        }
        
        // Ajouter les sections
        if (identite === 'identifie' && nomPrenom) {
            addSection('IDENTITÉ', nomPrenom);
        } else {
            addSection('IDENTITÉ', 'Anonyme');
        }
        
        if (lieu) addSection('LIEU DE RÉSIDENCE', lieu);
        if (pays) addSection('PAYS/TERRITOIRE CONCERNÉ', pays);
        if (dateDebut) addSection('PÉRIODE - DÉBUT', dateDebut);
        if (dateFin) addSection('PÉRIODE - FIN', dateFin);
        if (victimes) addSection('VICTIMES / POPULATIONS AFFECTÉES', victimes);
        if (auteurs) addSection('AUTEURS PRÉSUMÉS', auteurs);
        
        if (violations.length > 0) {
            addSection('VIOLATIONS ALLÉGUÉES', violations.join('\n• '));
        }
        
        if (resume) addSection('EXPOSÉ DES FAITS (RÉSUMÉ)', resume);
        if (faits) addSection('FAITS DÉTAILLÉS', faits);
        if (preuves) addSection('PREUVES / ANNEXES', preuves);
        if (demandes) addSection('DEMANDES', demandes);
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128);
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `HFH - Page ${i}/${pageCount} - Généré le ${new Date().toLocaleDateString()}`,
                margin,
                doc.internal.pageSize.getHeight() - 10
            );
        }
        
        // Télécharger
        const finalFilename = filename || 'HFH_document';
        doc.save(`${finalFilename}_${Date.now()}.pdf`);
        
        console.log('✓ PDF généré avec succès');
        
    } catch (error) {
        console.error('ERREUR PDF:', error);
        alert('Erreur lors de la génération du PDF:\n' + error.message);
    }
}

// ============================================================================
// FONCTION 2: Export DOCX avec docx.js
// ============================================================================

function hfhExportDOCX(filename) {
    console.log('→ hfhExportDOCX appelé avec:', filename);
    
    try {
        // Vérifier que les bibliothèques sont disponibles
        if (typeof docx === 'undefined') {
            alert('ERREUR: Bibliothèque docx non chargée.\nVérifiez que le CDN est accessible.');
            return;
        }
        
        if (typeof saveAs === 'undefined') {
            alert('ERREUR: Bibliothèque FileSaver non chargée.\nVérifiez que le CDN est accessible.');
            return;
        }
        
        const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } = docx;
        
        // Récupérer les valeurs du formulaire
        const identite = document.querySelector('input[name="identite"]:checked')?.value || 'anonyme';
        const nomPrenom = document.getElementById('nom-prenom')?.value || '';
        const lieu = document.getElementById('lieu')?.value || '';
        const pays = document.getElementById('pays')?.value || '';
        const dateDebut = document.getElementById('date-debut')?.value || '';
        const dateFin = document.getElementById('date-fin')?.value || '';
        const victimes = document.getElementById('victimes')?.value || '';
        const auteurs = document.getElementById('auteurs')?.value || '';
        const faits = document.getElementById('faits')?.value || '';
        const preuves = document.getElementById('preuves')?.value || '';
        const demandes = document.getElementById('demandes')?.value || '';
        const resume = document.getElementById('resume')?.value || '';
        
        // Récupérer les violations
        const violations = [];
        document.querySelectorAll('input[name="violations"]:checked').forEach(cb => {
            violations.push(cb.nextElementSibling.textContent.trim());
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
            new Paragraph({ text: '' }),
            new Paragraph({ text: '' })
        );
        
        // Fonction pour ajouter une section
        function addDocSection(title, content) {
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
        if (identite === 'identifie' && nomPrenom) {
            addDocSection('IDENTITÉ', nomPrenom);
        } else {
            addDocSection('IDENTITÉ', 'Anonyme');
        }
        
        if (lieu) addDocSection('LIEU DE RÉSIDENCE', lieu);
        if (pays) addDocSection('PAYS/TERRITOIRE CONCERNÉ', pays);
        if (dateDebut) addDocSection('PÉRIODE - DÉBUT', dateDebut);
        if (dateFin) addDocSection('PÉRIODE - FIN', dateFin);
        if (victimes) addDocSection('VICTIMES / POPULATIONS AFFECTÉES', victimes);
        if (auteurs) addDocSection('AUTEURS PRÉSUMÉS', auteurs);
        
        if (violations.length > 0) {
            addDocSection('VIOLATIONS ALLÉGUÉES', violations.join('\n• '));
        }
        
        if (resume) addDocSection('EXPOSÉ DES FAITS (RÉSUMÉ)', resume);
        if (faits) addDocSection('FAITS DÉTAILLÉS', faits);
        if (preuves) addDocSection('PREUVES / ANNEXES', preuves);
        if (demandes) addDocSection('DEMANDES', demandes);
        
        // Footer
        sections.push(
            new Paragraph({ text: '' }),
            new Paragraph({
                text: `HFH - Généré le ${new Date().toLocaleString()}`,
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
        Packer.toBlob(doc).then(blob => {
            const finalFilename = filename || 'HFH_document';
            saveAs(blob, `${finalFilename}_${Date.now()}.docx`);
            console.log('✓ DOCX généré avec succès');
        }).catch(error => {
            console.error('ERREUR DOCX:', error);
            alert('Erreur lors de la génération du DOCX:\n' + error.message);
        });
        
    } catch (error) {
        console.error('ERREUR DOCX:', error);
        alert('Erreur lors de la génération du DOCX:\n' + error.message);
    }
}

// ============================================================================
// EXPOSITION GLOBALE FORCÉE - MULTIPLE MÉTHODES
// ============================================================================

// Méthode 1: Assignation directe
window.hfhExportPDF = hfhExportPDF;
window.hfhExportDOCX = hfhExportDOCX;

// Méthode 2: Via Object.defineProperty (protection contre écrasement)
try {
    Object.defineProperty(window, 'hfhExportPDF', {
        value: hfhExportPDF,
        writable: false,
        configurable: false
    });
    Object.defineProperty(window, 'hfhExportDOCX', {
        value: hfhExportDOCX,
        writable: false,
        configurable: false
    });
} catch (e) {
    // Déjà défini, on ignore
}

// Méthode 3: Test de disponibilité
setTimeout(() => {
    if (typeof window.hfhExportPDF === 'function') {
        console.log('✓ hfhExportPDF est accessible globalement');
    } else {
        console.error('✗ hfhExportPDF N\'EST PAS accessible globalement');
    }
    
    if (typeof window.hfhExportDOCX === 'function') {
        console.log('✓ hfhExportDOCX est accessible globalement');
    } else {
        console.error('✗ hfhExportDOCX N\'EST PAS accessible globalement');
    }
}, 100);

// ============================================================================
// EVENT LISTENERS (méthode alternative aux onclick)
// ============================================================================

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
} else {
    initEventListeners();
}

function initEventListeners() {
    console.log('→ Initialisation des event listeners');
    
    // Chercher les boutons par leur texte (méthode robuste)
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        
        if (text.includes('pdf')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('→ Clic sur bouton PDF détecté');
                hfhExportPDF('HFH_plainte_ONU');
            });
            console.log('✓ Event listener PDF attaché');
        }
        
        if (text.includes('docx')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('→ Clic sur bouton DOCX détecté');
                hfhExportDOCX('HFH_plainte_ONU');
            });
            console.log('✓ Event listener DOCX attaché');
        }
    });
}

console.log('✓ pdf-docx.js complètement chargé');
