fetch('fiches.json')
  .then(response => response.json())
  .then(data => {
    const galerie = document.getElementById('galerie');
    data.forEach(galet => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h2>${galet.nom}</h2>
        <img src="${galet.image}" alt="${galet.nom}" width="150">
        <p><strong>Couleur :</strong> ${galet.couleur}</p>
        <p><strong>Description :</strong> ${galet.description}</p>
      `;
      galerie.appendChild(div);
    });
  });