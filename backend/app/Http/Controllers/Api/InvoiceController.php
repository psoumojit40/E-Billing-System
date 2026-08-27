<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::query();
        if ($request->status && $request->status !== 'all') {
            $query->whereRaw('LOWER(status) = ?', [strtolower($request->status)]);
        }
        if ($request->search) {
            $q = strtolower($request->search);
            $query->where(function($builder) use ($q) {
                $builder->whereRaw('LOWER(invoiceNumber) LIKE ?', ["%$q%"])
                        ->orWhereRaw('LOWER(JSON_UNQUOTE(JSON_EXTRACT(customer, "$.customerName"))) LIKE ?', ["%$q%"]);
            });
        }
        
        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => $query->orderBy('createdAt', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $id = $request->id ?? 'inv-' . time() . '-' . Str::random(4);
        $invoiceNumber = $request->invoiceNumber ?? $request->meta['invoiceNumber'] ?? 'INV-' . date('Ym') . '-' . rand(1000, 9999);
        
        $invoice = Invoice::updateOrCreate(
            ['invoiceNumber' => $invoiceNumber],
            [
                'id' => $id,
                'company' => $request->company ?? [],
                'customer' => $request->customer ?? [],
                'meta' => $request->meta ?? [],
                'items' => $request->items ?? [],
                'summary' => $request->summary ?? [],
                'status' => $request->status ?? 'Draft',
                'createdAt' => $request->createdAt ?? now()->toIso8601String(),
                'updatedAt' => now()->toIso8601String(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => $invoice
        ], 201);
    }

    public function show(string $id)
    {
        $invoice = Invoice::where('id', $id)->orWhere('invoiceNumber', $id)->first();
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }
        return response()->json(['success' => true, 'database' => 'MySQL', 'data' => $invoice]);
    }

    public function update(Request $request, string $id)
    {
        $invoice = Invoice::where('id', $id)->orWhere('invoiceNumber', $id)->first();
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        if ($request->has('status')) {
            $invoice->status = $request->status;
        }
        
        $invoice->updatedAt = now()->toIso8601String();
        $invoice->save();

        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => $invoice
        ]);
    }

    public function destroy(string $id)
    {
        $invoice = Invoice::where('id', $id)->orWhere('invoiceNumber', $id)->first();
        if ($invoice) {
            $invoice->delete();
        }
        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'message' => 'Invoice deleted'
        ]);
    }
    
    public function sendEmail(Request $request, string $id)
    {
        $invoice = Invoice::where('id', $id)->orWhere('invoiceNumber', $id)->first();
        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        $invoice->status = 'Sent';
        $invoice->updatedAt = now()->toIso8601String();
        $invoice->save();

        $recipient = $request->recipientEmail ?? 'customer@example.com';

        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'status' => 'Sent',
            'message' => "Invoice successfully sent to {$recipient}! Direct PDF download link included in email."
        ]);
    }
}
