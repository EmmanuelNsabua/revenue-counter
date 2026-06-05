<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
echo "DEBUG: api/index.php is reached.<br>";
echo "DEBUG: PHP Version: " . phpversion() . "<br>";
echo "DEBUG: __DIR__ is: " . __DIR__ . "<br>";

$autoloadPath = __DIR__.'/../vendor/autoload.php';
echo "DEBUG: vendor/autoload.php exists? " . (file_exists($autoloadPath) ? 'YES' : 'NO') . "<br>";

$appPath = __DIR__.'/../bootstrap/app.php';
echo "DEBUG: bootstrap/app.php exists? " . (file_exists($appPath) ? 'YES' : 'NO') . "<br>";

if (!file_exists($autoloadPath)) {
    die("FATAL: Cannot find vendor/autoload.php. Composer dependencies were not installed!");
}

try {
    require $autoloadPath;
    echo "DEBUG: Autoload required successfully.<br>";

    $app = require_once $appPath;
    echo "DEBUG: App bootstrapped successfully.<br>";

    // Force JSON so Laravel doesn't try to render an HTML view for the error
    $_SERVER['HTTP_ACCEPT'] = 'application/json';

    $app->handleRequest(Illuminate\Http\Request::capture());
} catch (\Throwable $e) {
    echo "<h2>FATAL ERROR CAUGHT:</h2>";
    echo "<pre>";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " on line " . $e->getLine() . "\n";
    echo "Trace:\n" . $e->getTraceAsString();
    echo "</pre>";
}
