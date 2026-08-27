<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'company' => 'array',
            'customer' => 'array',
            'meta' => 'array',
            'items' => 'array',
            'summary' => 'array',
        ];
    }
}
