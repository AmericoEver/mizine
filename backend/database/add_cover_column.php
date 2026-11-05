<?php

$dbPaths = [
    __DIR__ . '/database.sqlite',
    dirname(__DIR__, 2) . '/deploy/public_html/api/database/database.sqlite'
];

foreach ($dbPaths as $path) {
    if (file_exists($path)) {
        try {
            $pdo = new PDO('sqlite:' . $path);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Check if column exists
            $cols = $pdo->query("PRAGMA table_info(hero_settings)")->fetchAll(PDO::FETCH_ASSOC);
            $colNames = array_column($cols, 'name');
            if (!in_array('cover_image_url', $colNames)) {
                $pdo->exec("ALTER TABLE hero_settings ADD COLUMN cover_image_url TEXT NULL");
                echo "Added cover_image_url to: $path\n";
            } else {
                echo "Column already exists in: $path\n";
            }

            // Set default cover image
            $pdo->exec("UPDATE hero_settings SET cover_image_url = '/media/projects/proj-1.jpg' WHERE id = 1");
            echo "Updated default cover in: $path\n";
        } catch (Exception $e) {
            echo "Error for $path: " . $e->getMessage() . "\n";
        }
    }
}
