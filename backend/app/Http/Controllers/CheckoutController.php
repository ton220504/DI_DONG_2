<?php

namespace App\Http\Controllers;
use App\Models\Checkout;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;



class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        try {
            // Lấy thông tin từ token
            $user = JWTAuth::parseToken()->authenticate();

            // Validate dữ liệu đầu vào
            $request->validate([
                'items' => 'required|array',
                'items.*.name' => 'required|string|max:255',
                'items.*.price' => 'required|numeric|min:0',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.size' => 'required|string|max:255',
                'items.*.image' => 'required|string|max:255',
                'name' => 'required|string|max:255',
                'total' => 'required|integer',
                'provinces' => 'required|string|max:255',
                'districts' => 'required|string|max:255',
                'wards' => 'required|string|max:255',
                'address' => 'required|string|max:255',
            ]);

            // Ghi log dữ liệu nhận được
            \Log::info('Checkout request data:', $request->all());

            // Tạo một đối tượng Abate mới
            $checkout = new Checkout();
            $checkout->user_id = $user->id; // Gán user_id từ token
            $checkout->name = $request->name; // Lưu tên người nhận
            $checkout->total = $request->total;
            $checkout->items = json_encode($request->items);
            $checkout->provinces = $request->provinces;
            $checkout->districts = $request->districts;
            $checkout->wards = $request->wards;
            $checkout->address = $request->address;

            // Chuyển mảng items thành JSON để lưu
            $checkout->items = json_encode($request->items); // Chuyển đổi mảng items thành JSON

            // Lưu đơn hàng
            $checkout->save();

            return response()->json(['message' => 'Checkout successful', 'items' => $request->items], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is absent or invalid'], 401);
        } catch (\Exception $e) {
            // Ghi lại lỗi và trả về phản hồi lỗi 500
            \Log::error('Error processing checkout: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing checkout', 'error' => $e->getMessage()], 500);
        }
    }

    public function getCheckoutByUserId(Request $request)
    {
        try {
            // Lấy thông tin người dùng từ token
            $user = JWTAuth::parseToken()->authenticate();

            // Tìm đơn hàng gần nhất của người dùng
            $checkout = Checkout::where('user_id', $user->id)->latest()->first();

            // Kiểm tra nếu không tìm thấy đơn hàng
            if (!$checkout) {
                return response()->json(['message' => 'No checkout found for this user'], 404);
            }

            // Giải mã các mục items từ JSON
            $items = json_decode($checkout->items, true);

            // Trả về thông tin checkout chi tiết
            return response()->json([
                'id' => $checkout->id,
                'name' => $checkout->name,
                'total' => $checkout->total,
                'items' => $items,
                'provinces' => $checkout->provinces,
                'districts' => $checkout->districts,
                'wards' => $checkout->wards,
                'address' => $checkout->address,
                'created_at' => $checkout->created_at,
            ], 200);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is absent or invalid'], 401);
        } catch (\Exception $e) {
            // Ghi lại lỗi và trả về phản hồi lỗi 500
            \Log::error('Error fetching checkout data: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching checkout data', 'error' => $e->getMessage()], 500);
        }
    }




}
