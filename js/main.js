fetch('fiches.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('liste-galets');
    if (!container) return;

    data.forEach(fiche => {
      const div = document.createElement('div');
      div.className = 'fiche';

      const coord = fiche.localisation?.coordonnees;
      const coordHTML = coord ? `<p><strong>Coordonnées :</strong> ${coord.lat}, ${coord.lon}</p>` : '';

      div.innerHTML = `
        <h2>${fiche.nom}</h2>
        <img src="${fiche.photo}" alt="${fiche.nom}">
        <p><strong>Description :</strong> ${fiche.description}</p>
        <p><strong>Type de roche :</strong> ${fiche.roche_type}</p>
        <p><strong>Hypothèses :</strong> ${fiche.hypotheses?.join(', ')}</p>
        <p><strong>Minéraux probables :</strong> ${fiche.mineraux_probables?.join(', ')}</p>
        <p><strong>Origine possible :</strong> ${fiche.origine_possible}</p>
        <p><strong>Lieu :</strong> ${fiche.localisation?.lieu}</p>
        ${coordHTML}
        <p><strong>Tests effectués :</strong> ${fiche.tests_effectues?.join(', ')}</p>
      `;

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error('Erreur chargement fiches.json :', err);
  });
