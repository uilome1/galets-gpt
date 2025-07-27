<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$fichier = '../fiches.json';
$fiches = [];
$nomImage = null;

// 1. Gestion de l’image
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $dossier = '../img/';
    if (!is_dir($dossier)) {
        mkdir($dossier, 0755, true);
    }

    $extension = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $nomImage = uniqid('galet_') . '.' . $extension;
    move_uploaded_file($_FILES['photo']['tmp_name'], $dossier . $nomImage);
}

// 2. Charger les fiches existantes
if (file_exists($fichier)) {
    $json = file_get_contents($fichier);
    $fiches = json_decode($json, true);
}

// 3. Créer la nouvelle fiche
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nouvelleFiche = [
        'id' => uniqid('galet_'),
        'photo' => $nomImage ? 'img/' . $nomImage : '',
        'nom' => $_POST['nom'] ?? '',
        'description' => $_POST['description'] ?? '',
        'roche_type' => $_POST['roche_type'] ?? '',
        'hypotheses' => array_map('trim', explode(',', $_POST['hypotheses'] ?? '')),
        'mineraux_probables' => array_map('trim', explode(',', $_POST['mineraux_probables'] ?? '')),
        'origine_possible' => $_POST['origine_possible'] ?? '',
        'localisation' => [
            'lieu' => $_POST['lieu'] ?? '',
            'coordonnees' => [
                'lat' => floatval($_POST['lat'] ?? 0),
                'lon' => floatval($_POST['lon'] ?? 0)
            ]
        ],
        'tests_effectues' => array_map('trim', explode(',', $_POST['tests_effectues'] ?? ''))
    ];

    $fiches[] = $nouvelleFiche;

    file_put_contents($fichier, json_encode($fiches, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    header('Location: ../index.html');
    exit;
}
?>
