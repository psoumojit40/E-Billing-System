<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => Product::orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric'
        ]);

        $id = $request->id ?? 'prod-' . time() . '-' . Str::random(4);
        $sku = $request->sku ?: 'PROD' . rand(100, 999);

        $product = Product::create([
            'id' => $id,
            'sku' => $sku,
            'name' => $request->name,
            'description' => $request->description ?? '',
            'price' => $request->price,
            'gstRate' => $request->gstRate ?? 18.00,
            'hsnCode' => $request->hsnCode ?? '',
            'unit' => $request->unit ?? 'Pcs',
            'stock' => $request->stock ?? 100,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => $product
        ], 201);
    }

    public function show(string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }
        return response()->json(['success' => true, 'database' => 'MySQL', 'data' => $product]);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $product->update([
            'name' => $request->name ?? $product->name,
            'sku' => $request->sku ?? $product->sku,
            'description' => $request->description ?? $product->description,
            'price' => $request->price ?? $product->price,
            'gstRate' => $request->gstRate ?? $product->gstRate,
            'hsnCode' => $request->hsnCode ?? $product->hsnCode,
            'unit' => $request->unit ?? $product->unit,
            'stock' => $request->stock ?? $product->stock,
        ]);

        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => $product
        ]);
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);
        if ($product) {
            $product->delete();
        }
        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'message' => 'Product deleted'
        ]);
    }
}
