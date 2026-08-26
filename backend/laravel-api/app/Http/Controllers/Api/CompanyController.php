<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::latest()->get();
        return response()->json(['success' => true, 'data' => $companies]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'companyName' => 'required|string',
            'companyAddress' => 'required|string',
            'gstNumber' => 'required|string',
        ]);

        $company = Company::create([
            'id' => $request->id ?? ('comp-' . uniqid()),
            'company_name' => $request->companyName,
            'tagline' => $request->tagline ?? '',
            'company_address' => $request->companyAddress,
            'phone' => $request->phone ?? '',
            'email' => $request->email ?? '',
            'gst_number' => $request->gstNumber,
            'website' => $request->website ?? '',
            'company_logo' => $request->companyLogo ?? '',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Company created successfully',
            'data' => $company
        ], 201);
    }
}
