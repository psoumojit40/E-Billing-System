<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'id' => 'comp-1',
                'companyName' => 'Apex Enterprise Solutions Pvt. Ltd.',
                'tagline' => 'Enterprise Technology & Cloud Services',
                'companyAddress' => 'Plot 42, Tech Park Boulevard, Sector 5, Salt Lake, Kolkata, West Bengal 700091',
                'phone' => '+91 33 2948 1000',
                'email' => 'billing@apexenterprise.com',
                'gstNumber' => '19AAACA9876Q1Z2',
                'website' => 'https://apexenterprise.com',
                'companyLogo' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80',
            ],
            [
                'id' => 'comp-2',
                'companyName' => 'Tech Minimal Systems & Cloud',
                'tagline' => 'Software Development & Infrastructure SLA',
                'companyAddress' => 'Suite 804, Outer Ring Road, Devarabeesanahalli, Bengaluru, Karnataka 560103',
                'phone' => '+91 80 4122 9000',
                'email' => 'accounts@techminimal.io',
                'gstNumber' => '29AABCT5432K1Z9',
                'website' => 'https://techminimal.io',
                'companyLogo' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
            ],
            [
                'id' => 'comp-3',
                'companyName' => 'Blue Cyber Dynamics Ltd.',
                'tagline' => 'Cybersecurity & Data Center Managed Services',
                'companyAddress' => 'Tower B, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
                'phone' => '+91 22 6789 4000',
                'email' => 'finance@bluecyber.com',
                'gstNumber' => '27AAACB1234F1Z5',
                'website' => 'https://bluecyber.com',
                'companyLogo' => 'https://images.unsplash.com/photo-1614680376593-902f749f7bc9?w=200&auto=format&fit=crop&q=80',
            ],
        ];

        foreach ($companies as $company) {
            Company::firstOrCreate(['id' => $company['id']], $company);
        }
    }
}
