<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart; // Đảm bảo bạn đã import mô hình ShoppingCart

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;


class ShoppingCartController extends Controller
{

    public function addToCart(Request $request)
        {
            try {
                // Lấy thông tin từ token
                if (!$user = JWTAuth::parseToken()->authenticate()) {
                    return response()->json(['error' => 'User not found'], 404);
                }

                // Lấy thông tin từ request
                $name = $request->input('name');
                $price = $request->input('price');
                $quantity = $request->input('quantity');
                $size = $request->input('size');
                $image = $request->input('image');

                // Tìm sản phẩm trong giỏ hàng dựa trên user_id
                $existingCartItem = ShoppingCart::where('user_id', $user->id)
                                                ->where('name', $name)
                                                ->where('size', $size) // Thêm kiểm tra kích thước nếu cần
                                                ->first();

                if ($existingCartItem) {
                    // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
                    $existingCartItem->quantity += $quantity;
                    $existingCartItem->save(); // Lưu thay đổi
                    return response()->json(['message' => 'Product quantity updated in cart', 'cart' => $existingCartItem]);
                } else {
                    // Thêm sản phẩm mới vào giỏ hàng
                    $cartItem = new ShoppingCart();
                    $cartItem->user_id = $user->id; // Gán user_id từ token
                    $cartItem->name = $name;
                    $cartItem->price = $price;
                    $cartItem->quantity = $quantity;
                    $cartItem->size = $size;
                    $cartItem->image = $image;

                    // Lưu sản phẩm vào cơ sở dữ liệu
                    if ($cartItem->save()) {
                        return response()->json(['message' => 'Product added to cart', 'cart' => $cartItem]);
                    } else {
                        return response()->json(['error' => 'Could not add product to cart'], 500);
                    }
                }
            } catch (JWTException $e) {
                return response()->json(['error' => 'Token is absent or invalid'], 401);
            }
        }



    public function getAll(Request $request) {
        try {
            // Lấy user hiện tại từ token
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }

            // Lấy giỏ hàng của người dùng dựa vào ID người dùng
            $shoppingCartItems = ShoppingCart::where('user_id', $user->id)->get();

            // Trả về danh sách giỏ hàng
            return response()->json($shoppingCartItems);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is absent or invalid'], 401);
        }
    }

    public function destroy($id)
    {
        try {
            $cartItem = ShoppingCart::find($id);

            if (!$cartItem) {
                return response()->json(['error' => 'Item not found'], 404);
            }

            $cartItem->delete();

            return response()->json(['message' => 'Item deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Tìm sản phẩm trong giỏ hàng
            $cartItem = ShoppingCart::find($id);

            if (!$cartItem) {
                return response()->json(['error' => 'Item not found'], 404);
            }

            // Kiểm tra số lượng yêu cầu là hợp lệ (lớn hơn 0)
            if ($request->quantity <= 0) {
                return response()->json(['error' => 'Invalid quantity'], 400);
            }

            // Cập nhật số lượng
            $cartItem->update(['quantity' => $request->quantity]);

            return response()->json(['message' => 'Quantity updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error', 'details' => $e->getMessage()], 500);
        }
    }

}

