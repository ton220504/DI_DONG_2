<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/getAll',[ProductController::class, 'getAll']);
Route::get('/product/{id}',[ProductController::class, 'GetProductById']);
