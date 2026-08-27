<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (File::exists($path)) {
        return File::get($path);
    }
    return response('Frontend not built yet. Run "npm run build".', 200);
})->where('any', '.*');
