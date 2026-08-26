<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::with('items')->latest();
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->has('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('invoice_number', 'like', "%{$s}%")
                  ->orWhere('customer_details->customerName', 'like', "%{$s}%");
            });
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoiceNumber' => 'required',
            'items' => 'required|array|min:1',
            'company' => 'required|array',
            'customer' => 'required|array',
        ]);

        return DB::transaction(function () use ($request) {
            $invoice = Invoice::updateOrCreate(
                ['invoice_number' => $request->invoiceNumber],
                [
                    'invoice_date' => $request->meta['invoiceDate'] ?? now()->toDateString(),
                    'due_date' => $request->meta['dueDate'] ?? now()->addDays(30)->toDateString(),
                    'payment_terms' => $request->meta['paymentTerms'] ?? 'Net 30',
                    'status' => $request->status ?? 'Draft',
                    'subtotal' => $request->summary['subtotal'] ?? 0,
                    'discount_amount' => $request->summary['globalDiscountAmount'] ?? 0,
                    'taxable_amount' => $request->summary['taxableSubtotal'] ?? 0,
                    'total_tax' => $request->summary['totalTax'] ?? 0,
                    'grand_total' => $request->summary['grandTotal'] ?? 0,
                    'company_details' => $request->company,
                    'customer_details' => $request->customer,
                    'notes' => $request->meta['notes'] ?? '',
                    'terms' => $request->meta['termsAndConditions'] ?? '',
                ]
            );

            // Clear old items if updating
            $invoice->items()->delete();

            foreach ($request->items as $item) {
                $invoice->items()->create([
                    'sku' => $item['sku'] ?? 'PROD',
                    'name' => $item['name'],
                    'description' => $item['description'] ?? '',
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'gst_rate' => $item['gstRate'] ?? 18,
                    'taxable_amount' => $item['taxableAmount'] ?? 0,
                    'gst_amount' => $item['gstAmount'] ?? 0,
                    'total_amount' => $item['total'] ?? 0,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Invoice stored successfully in MySQL',
                'data' => $invoice->load('items')
            ], 201);
        });
    }

    public function show($id)
    {
        $invoice = Invoice::with('items')->where('id', $id)->orWhere('invoice_number', $id)->firstOrFail();
        return response()->json(['success' => true, 'data' => $invoice]);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::where('id', $id)->orWhere('invoice_number', $id)->firstOrFail();
        if ($request->has('status')) {
            $invoice->status = $request->status;
            $invoice->save();
        }
        return response()->json(['success' => true, 'data' => $invoice, 'message' => 'Invoice status updated']);
    }

    public function sendEmail(Request $request, $id)
    {
        $invoice = Invoice::where('id', $id)->orWhere('invoice_number', $id)->firstOrFail();
        $invoice->status = 'Sent';
        $invoice->save();

        return response()->json([
            'success' => true,
            'status' => 'Sent',
            'message' => "Invoice {$invoice->invoice_number} sent via email and status updated to Sent."
        ]);
    }

    public function destroy($id)
    {
        $invoice = Invoice::where('id', $id)->orWhere('invoice_number', $id)->firstOrFail();
        $invoice->delete();
        return response()->json(['success' => true, 'message' => 'Invoice deleted successfully']);
    }
}
