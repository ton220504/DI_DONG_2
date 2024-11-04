<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\CheckoutController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/getAll',[ProductController::class, 'getAll']);
Route::get('/product/{id}',[ProductController::class, 'GetProductById']);
Route::post('/register', 'App\Http\Controllers\UserController@register');
Route::post('/login', 'App\Http\Controllers\UserController@login');
Route::get('/user-from-token', 'App\Http\Controllers\UserController@getUserByIdFromToken');
Route::post('/change-password', [UserController::class, 'changePassword']);
Route::put('/change-info', [UserController::class, 'updateUserByIdFromToken']);
Route::post('/checkout', 'App\Http\Controllers\CheckoutController@checkout');
Route::get('/getCheckoutByUserId', 'App\Http\Controllers\CheckoutController@getCheckoutByUserId');

Route::post('/addtocart', 'App\Http\Controllers\ShoppingCartController@addToCart');
Route::get('/getcart', 'App\Http\Controllers\ShoppingCartController@getAll');

Route::put('/putcart/{id}', 'App\Http\Controllers\ShoppingCartController@update');
Route::delete('/deletecart/{id}', 'App\Http\Controllers\ShoppingCartController@destroy');
