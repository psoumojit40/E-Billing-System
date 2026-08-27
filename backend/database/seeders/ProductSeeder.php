<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'id' => 'prod-1',
                'sku' => 'PROD001',
                'name' => 'Product A',
                'description' => 'Premium product with enterprise level quality and SLA support',
                'price' => 500,
                'gstRate' => 18,
                'hsnCode' => '8471',
                'unit' => 'Pcs',
                'stock' => 120
            ],
            [
                'id' => 'prod-2',
                'sku' => 'PROD002',
                'name' => 'Product B',
                'description' => 'Standard product engineered for daily workflow and business reliability',
                'price' => 750,
                'gstRate' => 18,
                'hsnCode' => '8473',
                'unit' => 'Pcs',
                'stock' => 85
            ],
            [
                'id' => 'prod-3',
                'sku' => 'PROD003',
                'name' => 'Product C',
                'description' => 'Economy product providing cost-effective performance for general operations',
                'price' => 300,
                'gstRate' => 12,
                'hsnCode' => '8472',
                'unit' => 'Pcs',
                'stock' => 240
            ],
            [
                'id' => 'prod-4',
                'sku' => 'PROD004',
                'name' => 'Enterprise Cloud Suite',
                'description' => 'Annual multi-tier cloud management license and server backup utilities',
                'price' => 2400,
                'gstRate' => 18,
                'hsnCode' => '998313',
                'unit' => 'Lic',
                'stock' => 999
            ],
            [
                'id' => 'prod-5',
                'sku' => 'PROD005',
                'name' => 'Annual Maintenance Support (AMC)',
                'description' => '24/7 dedicated engineering support contract and quarterly hardware audits',
                'price' => 1200,
                'gstRate' => 18,
                'hsnCode' => '998717',
                'unit' => 'Yr',
                'stock' => 500
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['id' => $product['id']], $product);
        }
    }
}
