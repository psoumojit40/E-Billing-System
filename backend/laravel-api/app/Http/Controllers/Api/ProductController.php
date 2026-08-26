<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Product::all()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'sku' => 'nullable|string|unique:products,sku',
            'gstRate' => 'nullable|numeric',
        ]);

        $product = Product::create([
            'sku' => $request->sku ?? 'PROD' . str_pad(Product::count() + 1, 3, '0', STR_PAD_LEFT),
            'name' => $request->name,
            'description' => $request->description ?? '',
            'price' => $request->price,
            'gst_rate' => $request->gstRate ?? 18,
            'hsn_code' => $request->hsnCode ?? '',
            'unit' => $request->unit ?? 'Pcs',
            'stock' => $request->stock ?? 100,
        ]);

        return response()->json(['success' => true, 'data' => $product], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update([
            'sku' => $request->sku ?? $product->sku,
            'name' => $request->name ?? $product->name,
            'description' => $request->description ?? $product->description,
            'price' => $request->price ?? $product->price,
            'gst_rate' => $request->gstRate ?? $product->gst_rate,
            'hsn_code' => $request->hsnCode ?? $product->hsn_code,
            'unit' => $request->unit ?? $product->unit,
            'stock' => $request->stock ?? $product->stock,
        ]);

        return response()->json(['success' => true, 'data' => $product]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['success' => true, 'message' => 'Product deleted successfully']);
    }
}
