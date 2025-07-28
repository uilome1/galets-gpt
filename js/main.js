fetch('data/galets.json')
  .then(response => response.json())
  .then(data => {
    afficherGalets(data);
    genererGlossaire(data); // à ajouter plus tard
  });

function afficherGalets(donnees) {
  const liste = document.getElementById('galerie');
  liste.innerHTML = '';

  donnees.forEach(galet => {
    const div = document.createElement('div');
    div.className = 'carte-galet';

    const imageSrc = galet.photo;
    const lieu = galet.lieu || (galet.localisation?.lieu ?? 'Lieu inconnu');
    const description = galet.description || '';
    const roche = galet.roche_type || '';
    const texture = galet.texture || '';
    const brillance = galet.brillance || '';
    const couleurs = galet.couleurs || '';
    const motifs = galet.motifs || '';
    const taille = galet.taille ? `${galet.taille} cm` : '';
    const tests = Array.isArray(galet.tests_effectues) ? galet.tests_effectues.join(', ') : '';
    const hypothese = galet.hypothese || (Array.isArray(galet.hypotheses) ? galet.hypotheses.join(', ') : '');
    const origine = galet.origine || galet.origine_possible || '';

    div.innerHTML = `
      <img src="${imageSrc}" alt="Photo du galet" />
      <p><strong>Lieu :</strong> ${lieu}</p>
      ${taille ? `<p><strong>Taille :</strong> ${taille}</p>` : ''}
      ${description ? `<p><strong>Description :</strong> ${description}</p>` : ''}
      ${roche ? `<p><strong>Type de roche :</strong> ${roche}</p>` : ''}
      ${texture ? `<p><strong>Texture :</strong> ${texture}</p>` : ''}
      ${brillance ? `<p><strong>Brillance :</strong> ${brillance}</p>` : ''}
      ${couleurs ? `<p><strong>Couleurs :</strong> ${couleurs}</p>` : ''}
      ${motifs ? `<p><strong>Motifs :</strong> ${motifs}</p>` : ''}
      ${tests ? `<p><strong>Tests effectués :</strong> ${tests}</p>` : ''}
      ${hypothese ? `<p class="ia-hypothese"><strong>Hypothèse :</strong> ${hypothese}</p>` : ''}
      ${origine ? `<p class="ia-origine"><strong>Origine :</strong> ${origine}</p>` : ''}
    `;

    const boutonIA = document.createElement('button');
    boutonIA.textContent = '✨ Générer par IA';
    boutonIA.className = 'generer-ia';
    boutonIA.onclick = () => {
      boutonIA.textContent = '⏳ IA en cours...';
      fetch('api/completions.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: galet.id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success')  {
            
            
          // Ajout ou mise à jour des paragraphes IA
          let pHypothese = div.querySelector('.ia-hypothese');
          let pOrigine = div.querySelector('.ia-origine');

          if (!pHypothese) {
            pHypothese = document.createElement('p');
            pHypothese.className = 'ia-hypothese';
            div.appendChild(pHypothese);
          }

          if (!pOrigine) {
            pOrigine = document.createElement('p');
            pOrigine.className = 'ia-origine';
            div.appendChild(pOrigine);
          }

          pHypothese.innerHTML = `<strong>Hypothèse IA :</strong> ${data.data.hypothese}`;
    pOrigine.innerHTML = `<strong>Origine IA :</strong> ${data.data.origine}`;
    boutonIA.textContent = '✅ Complété !';
        } else {
          alert('Erreur IA : ' + data.message);
          boutonIA.textContent = '✨ Générer par IA';
        }
      })
      .catch(err => {
        console.error(err);
        alert('Erreur de réseau ou de script');
        boutonIA.textContent = '✨ Générer par IA';
      });
    };

    div.appendChild(boutonIA);
    liste.appendChild(div);
  });
}



