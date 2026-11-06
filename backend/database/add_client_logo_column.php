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
            
            // Check if column exists in clients
            $cols = $pdo->query("PRAGMA table_info(clients)")->fetchAll(PDO::FETCH_ASSOC);
            $colNames = array_column($cols, 'name');
            if (!in_array('logo_url', $colNames)) {
                $pdo->exec("ALTER TABLE clients ADD COLUMN logo_url TEXT NULL");
                echo "Added logo_url to clients in: $path\n";
            } else {
                echo "logo_url already exists in clients in: $path\n";
            }
        } catch (Exception $e) {
            echo "Error for $path: " . $e->getMessage() . "\n";
        }
    }
}

