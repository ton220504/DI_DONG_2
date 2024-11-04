<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;



class UserController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        $token = JWTAuth::fromUser($user);
        return response()->json(compact('user', 'token'), 201);
    }

    public function login(Request $request) {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $user = JWTAuth::user();
        return response()->json(compact('user', 'token'));
    }

    public function getAuthenticatedUser() {
        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['token_absent'], 401);
        }

        return response()->json(compact('user'));
    }


    public function getUserByIdFromToken(Request $request) {
        try {
            // Lấy user hiện tại từ token
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is absent or invalid'], 401);
        }

        // Trả về thông tin tên và email của user
        return response()->json([
            'name' => $user->name,
            'email' => $user->email
        ]);
    }

    public function changePassword(Request $request) {
        // Xác nhận đầu vào của người dùng
        $validator = Validator::make($request->all(), [
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if (!$user = JWTAuth::parseToken()->authenticate()) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Lấy người dùng hiện tại từ token
        $user = JWTAuth::user();

        // Kiểm tra xem người dùng có tồn tại không
        if (!$user) {
            return response()->json(['error' => 'Người dùng không tìm thấy'], 404);
        }

        // Kiểm tra mật khẩu cũ có chính xác không
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['error' => 'Mật khẩu cũ không đúng'], 400);
        }

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Đổi mật khẩu thành công'], 200);
    }

    public function updateUserByIdFromToken(Request $request) {
        try {
            // Lấy user hiện tại từ token
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token is absent or invalid'], 401);
        }

        // Xác thực dữ liệu đầu vào
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        // Cập nhật thông tin người dùng
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];

        // Lưu thay đổi vào cơ sở dữ liệu
        if ($user->save()) {
            return response()->json([
                'message' => 'User information updated successfully',
                'name' => $user->name,
                'email' => $user->email
            ]);
        } else {
            return response()->json(['error' => 'Failed to update user information'], 500);
        }
    }


}
