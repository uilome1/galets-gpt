// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Cible le nouveau conteneur pour la grille des galets
    const galerieContainer = document.getElementById('galets-grid-container'); 
    const filtreRoche = document.getElementById('filtre-roche');

    async function chargerGalets() {
        try {
            const response = await fetch('data/galets.json');
            const galets = await response.json();
            afficherGalets(galets);
        } catch (error) {
            console.error('Erreur de chargement des galets :', error);
            galerieContainer.innerHTML = '<p>Impossible de charger la galerie de galets.</p>';
        }
    }

    function afficherGalets(galets) {
        galerieContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter les nouveaux galets
        galets.forEach(galet => {
            const ficheDiv = document.createElement('div');
            ficheDiv.className = 'fiche'; // Applique la classe .fiche

            // --- Normalisation du chemin d'image et vérification ---
            let imageUrl = '';
            if (galet.photo) {
                // Remplace les antislashs par des slashs et s'assure qu'il n'y a pas de double "assets/"
                imageUrl = galet.photo.replace(/\\/g, '/');
                if (imageUrl.startsWith('assets/images/') || imageUrl.startsWith('assets/img/')) {
                    // Chemin déjà correct
                } else if (imageUrl.startsWith('images/') || imageUrl.startsWith('img/')) {
                    // Ajoute "assets/" si manquant
                    imageUrl = 'assets/' + imageUrl;
                } else {
                    // Pour les anciens galets qui pourraient avoir "image": "images/galet001.jpg"
                    if (galet.image) {
                        imageUrl = 'assets/' + galet.image.replace(/\\/g, '/');
                    } else {
                        imageUrl = ''; // Pas de chemin valide
                    }
                }
            } else if (galet.image) { // Gère l'ancien champ 'image'
                 imageUrl = 'assets/' + galet.image.replace(/\\/g, '/');
            }

            const imageHtml = imageUrl ? `<img src="${imageUrl}" alt="Image du galet ${galet.id}">` : '<p>Pas d\'image disponible</p>';

            // --- Extraction et affichage des données avec gestion des absents ---
            const nomGalet = galet.nom || `Galet #${galet.id}`; // Utilise 'nom' s'il existe, sinon l'ID
            const lieu = galet.lieu || (galet.localisation && galet.localisation.lieu) || 'Non défini';
            const rocheType = galet.roche_type || galet.type || 'Non défini'; // Gère 'roche_type' ou 'type'
            const taille = galet.taille ? `${galet.taille} cm` : 'Non défini';
            const couleurs = galet.couleurs && Array.isArray(galet.couleurs) ? galet.couleurs.join(', ') : galet.couleurs || 'Non défini';
            const motifs = galet.motifs && Array.isArray(galet.motifs) ? galet.motifs.join(', ') : galet.motifs || 'Non défini';
            const texture = galet.texture || 'Non défini';
            const brillance = galet.brillance || 'Non défini';
            const testsEffectues = galet.tests_effectues && Array.isArray(galet.tests_effectues) && galet.tests_effectues.length > 0
                                ? galet.tests_effectues.filter(t => t).join(', ')
                                : 'Aucun';
            const motsClesGlossaire = galet.mots_cles_glossaire && Array.isArray(galet.mots_cles_glossaire) && galet.mots_cles_glossaire.length > 0
                                    ? galet.mots_cles_glossaire.join(', ')
                                    : 'Aucun';


            ficheDiv.innerHTML = `
                ${imageHtml}
                <h3>${nomGalet}</h3>
                <p><strong>Lieu :</strong> ${lieu}</p>
                <p><strong>Type de roche :</strong> ${rocheType}</p>
                <p><strong>Taille :</strong> ${taille}</p>
                <p><strong>Couleurs :</strong> ${couleurs}</p>
                <p><strong>Motifs :</strong> ${motifs}</p>
                <p><strong>Texture :</strong> ${texture}</p>
                <p><strong>Brillance :</strong> ${brillance}</p>
                <p><strong>Tests effectués :</strong> ${testsEffectues}</p>
                ${galet.description ? `<p><strong>Description :</strong> ${galet.description}</p>` : ''}
                ${galet.hypothese ? `<p><strong>Hypothèse :</strong> ${galet.hypothese}</p>` : ''}
                ${galet.origine ? `<p><strong>Origine :</strong> ${galet.origine}</p>` : ''}
                <p><strong>Mots-clés :</strong> ${motsClesGlossaire}</p>
            `;
            galerieContainer.appendChild(ficheDiv);
        });
    }

    filtreRoche.addEventListener('change', async (event) => {
        const typeSelectionne = event.target.value;
        try {
            const response = await fetch('data/galets.json');
            const galets = await response.json();
            const galetsFiltres = typeSelectionne
                ? galets.filter(galet => {
                    const typeGalet = galet.roche_type || galet.type; // Gère les deux noms de champ
                    return typeGalet && typeGalet.toLowerCase() === typeSelectionne.toLowerCase();
                })
                : galets;
            afficherGalets(galetsFiltres);
        } catch (error) {
            console.error('Erreur de filtrage des galets :', error);
        }
    });

    // Charger les galets au chargement initial de la page
    chargerGalets();
});