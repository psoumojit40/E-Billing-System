<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CompanyController;

/*
|--------------------------------------------------------------------------
| API Routes for Product Invoice Generator (Laravel API)
|--------------------------------------------------------------------------
*/

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'Laravel Invoice API']);
});

Route::post('/invoices/{id}/send-email', [InvoiceController::class, 'sendEmail']);

Route::apiResource('products', ProductController::class);
Route::apiResource('invoices', InvoiceController::class);
Route::apiResource('companies', CompanyController::class);
