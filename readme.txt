galets-gpt/
├── index.html               # Visualisation dynamique des galets
├── formulaire.html          # Formulaire d’ajout d’un galet
├── fiches.json              # Données principales des galets (modifiables)
├── style.css                # (optionnel) Feuille de style partagée
├── api/
│   └── completions.php      # Requête GPT (description auto)
├── assets/
│   └── images/              # (optionnel) Images uploadées (ou en base64)
├── js/
│   └── main.js              # JS pour affichage ou traitement côté client
├── .gitignore
├── README.md



-------Projet de fiches galets avec complétion IA (ChatGPT)---------

# Projet Galets-GPT

Ce projet web permet d'enregistrer, enrichir et visualiser des galets collectés sur différentes plages, avec ou sans l’aide de l’IA (GPT) pour compléter les descriptions.

## Technologies

- HTML, CSS, JavaScript (Vanilla)
- Fichier JSON comme base NoSQL locale
- API OpenAI (si besoin d'automatiser les descriptions)

1 Structure

galets-gpt/
├── index.html # Page principale de visualisation
├── formulaire.html # Saisie manuelle d'un galet
├── fiches.json # Base de données JSON des galets
├── api/completions.php # Appel GPT si activé





2 Lancer le projet en local / Installation


git clone https://github.com/votre-utilisateur/galets-gpt.git
cd galets-gpt
code .  # ou ouvrir dans votre éditeur préféré


3. Contexte
Démo perso / test local	: clé dans appel_gpt.php
Projet pack pour client	Mettre un champ vide ou commentaire, transmettre sans la clé
Projet en ligne (prod)	Backend sécurisé avec clé cachée : Jamais côté client

4. Fonctionnalités

Ajout manuel de fiches de galets

Possibilité de générer automatiquement des descriptions via GPT

Visualisation dynamique depuis fiches.json

Export et modification possible des données JSON