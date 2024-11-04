<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{

    use HasFactory; // Nên sử dụng trait HasFactory để hỗ trợ factory
    protected $fillable = ['name','price','size','image','quantity','user_id'];
}
