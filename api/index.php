<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
echo "DEBUG: api/index.php is reached.<br>";

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->handleRequest(Illuminate\Http\Request::capture());
