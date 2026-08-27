<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CompanyController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => Company::orderBy('companyName', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'companyName' => 'required|string',
            'companyAddress' => 'required|string',
            'gstNumber' => 'required|string'
        ]);

        $id = $request->id ?? 'comp-' . time() . '-' . Str::random(4);

        $company = Company::create([
            'id' => $id,
            'companyName' => $request->companyName,
            'tagline' => $request->tagline ?? '',
            'companyAddress' => $request->companyAddress,
            'phone' => $request->phone ?? '',
            'email' => $request->email ?? '',
            'gstNumber' => $request->gstNumber,
            'website' => $request->website ?? '',
            'companyLogo' => $request->companyLogo ?? '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => $company
        ], 201);
    }

    public function show(string $id)
    {
        $company = Company::find($id);
        if (!$company) {
            return response()->json(['success' => false, 'message' => 'Company not found'], 404);
        }
        return response()->json(['success' => true, 'database' => 'MySQL', 'data' => $company]);
    }

    public function update(Request $request, string $id)
    {
        $company = Company::find($id);
        if (!$company) {
            return response()->json(['success' => false, 'message' => 'Company not found'], 404);
        }

        $company->update([
            'companyName' => $request->companyName ?? $company->companyName,
            'tagline' => $request->tagline ?? $company->tagline,
            'companyAddress' => $request->companyAddress ?? $company->companyAddress,
            'phone' => $request->phone ?? $company->phone,
            'email' => $request->email ?? $company->email,
            'gstNumber' => $request->gstNumber ?? $company->gstNumber,
            'website' => $request->website ?? $company->website,
            'companyLogo' => $request->companyLogo ?? $company->companyLogo,
        ]);

        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'data' => $company
        ]);
    }

    public function destroy(string $id)
    {
        $company = Company::find($id);
        if ($company) {
            $company->delete();
        }
        return response()->json([
            'success' => true,
            'database' => 'MySQL',
            'message' => 'Company deleted'
        ]);
    }
}
