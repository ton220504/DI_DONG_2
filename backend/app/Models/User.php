<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject; // Import interface JWTSubject

class User extends Authenticatable implements JWTSubject // Implement interface
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Phương thức trả về ID của người dùng
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Trả về ID của người dùng
    }

    // Phương thức trả về claims tùy chỉnh cho token
    public function getJWTCustomClaims()
    {
        return []; // Có thể trả về các claims tùy chỉnh nếu cần
    }
}
