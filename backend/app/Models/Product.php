<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ShoppingCart;

class Product extends Model
{

    use HasFactory; // Nên sử dụng trait HasFactory để hỗ trợ factory
    protected $fillable = ['name','price','description','image'];

    protected $table = 'products'; // Đảm bảo tên bảng chính xác

    // Trong mô hình Product
    public function shoppingCarts()
    {
        return $this->hasMany(ShoppingCart::class);
    }
}
