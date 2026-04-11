<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// /user route removed — Sanctum stateful middleware is not configured for this project
// and the endpoint returned 401 for all unauthenticated requests.

Route::post('/engage', [App\Http\Controllers\Api\EngagementController::class, 'store'])
    ->middleware('throttle:60,1')
    ->name('api.engage');
