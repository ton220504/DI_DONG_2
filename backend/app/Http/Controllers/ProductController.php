<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ShoppingCart;

class ProductController extends Controller
{
    public function GetAll(){
        return Product::all();
    }

    public function GetProductById($id) {
        // Tìm sản phẩm theo id, nếu không tồn tại trả về lỗi 404
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    // ProductController.php




}
