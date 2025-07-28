<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$fichier = __DIR__ . '/../data/galets.json';
$dossierImages = __DIR__ . '/../assets/images/';

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
    $nouvelleFiche = [
        "id" => uniqid("galet_"),
        "photo" => "assets/images/" . $nomImage,
        "lieu" => $_POST['lieu'] ?? '',
        "taille" => floatval($_POST['taille'] ?? 0),
        "couleurs" => $_POST['couleurs'] ?? '',
        "motifs" => $_POST['motifs'] ?? '',
        "texture" => $_POST['texture'] ?? '',
        "brillance" => $_POST['brillance'] ?? '',
        "tests_effectues" => $_POST['tests'] ?? [],
        "hypothese" => "", // laissé vide pour IA plus tard
        "origine" => ""    // idem
    ];

    $fiches[] = $nouvelleFiche;

    file_put_contents($fichier, json_encode($fiches, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    header('Location: ../index.html');
    exit;
}
