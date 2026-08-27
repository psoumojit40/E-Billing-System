<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\InvoiceController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'database' => 'MySQL (Laravel)',
        'timestamp' => now()->toIso8601String()
    ]);
});

Route::apiResource('products', ProductController::class);
Route::apiResource('companies', CompanyController::class);
Route::apiResource('invoices', InvoiceController::class);
Route::post('/invoices/{invoice}/send-email', [InvoiceController::class, 'sendEmail']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
