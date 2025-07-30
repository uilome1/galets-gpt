<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$fichier = __DIR__ . '/../data/galets.json';
$dossierImages = __DIR__ . '/../assets/images/'; // Chemin standardisé

if (!is_dir($dossierImages)) {
    mkdir($dossierImages, 0755, true);
}

$fiches = [];

if (file_exists($fichier)) {
    $fiches = json_decode(file_get_contents($fichier), true);
}

$nomImage = null;
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $extension = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $nomImage = uniqid('galet_') . '.' . $extension;
    move_uploaded_file($_FILES['photo']['tmp_name'], $dossierImages . $nomImage);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données du formulaire
    $lieu = $_POST['lieu'] ?? '';
    $taille = floatval($_POST['taille'] ?? 0);
    $couleurs = $_POST['couleurs'] ?? '';
    $motifs = $_POST['motifs'] ?? '';
    $texture = $_POST['texture'] ?? '';
    $brillance = $_POST['brillance'] ?? '';
    $tests_effectues = $_POST['tests'] ?? [];
    $roche_type_saisie = $_POST['roche_type_saisie'] ?? ''; // Nouveau champ
    $mots_cles_additionnels_str = $_POST['mots_cles_additionnels'] ?? ''; // Nouveau champ

    // Construction du tableau mots_cles_glossaire
    $mots_cles_glossaire = [];
    if (!empty($roche_type_saisie)) {
        // Enlève "Roche " pour avoir juste "magmatique", "sédimentaire", "métamorphique"
        $mots_cles_glossaire[] = str_replace('Roche ', '', strtolower($roche_type_saisie)); 
        // Ajoute aussi la forme complète si le glossaire l'utilise
        $mots_cles_glossaire[] = strtolower($roche_type_saisie);
    }
    if (!empty($texture) && $texture !== 'autre') { // La texture peut être un mot-clé pertinent
        $mots_cles_glossaire[] = strtolower($texture);
    }
    if (!empty($brillance) && $brillance !== 'autre') { // La brillance aussi
        $mots_cles_glossaire[] = strtolower($brillance);
    }

    // Ajout des mots-clés additionnels fournis par l'utilisateur
    if (!empty($mots_cles_additionnels_str)) {
        $additionnels = array_map('trim', explode(',', $mots_cles_additionnels_str));
        foreach ($additionnels as $mot) {
            if (!empty($mot)) {
                $mots_cles_glossaire[] = strtolower($mot);
            }
        }
    }
    // Assurez-vous d'avoir des mots-clés uniques
    $mots_cles_glossaire = array_unique($mots_cles_glossaire);
    $mots_cles_glossaire = array_values($mots_cles_glossaire);


    $nouvelleFiche = [
        "id" => uniqid("galet_"),
        "photo" => "assets/images/" . $nomImage, // Chemin d'image standardisé
        "lieu" => $lieu,
        "taille" => $taille,
        "couleurs" => $couleurs,
        "motifs" => $motifs,
        "texture" => $texture,
        "brillance" => $brillance,
        "tests_effectues" => $tests_effectues,
        "roche_type" => str_replace('Roche ', '', $roche_type_saisie), // Garder le type de roche pour d'autres usages
        "mots_cles_glossaire" => $mots_cles_glossaire, // Le champ clé pour le filtrage
        "hypothese" => "", // laissé vide pour IA plus tard (ou peut être initialisé avec roche_type_saisie)
        "origine" => ""    // idem
    ];

    $fiches[] = $nouvelleFiche;

    file_put_contents($fichier, json_encode($fiches, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    header('Location: ../index.html');
    exit;
}
?>