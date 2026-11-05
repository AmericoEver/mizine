<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContentController;

// Rotas públicas
Route::get('/content', [ContentController::class, 'getContent']);
Route::post('/contact', [ContentController::class, 'submitContact']);

// Rotas de Administração
Route::post('/admin/login', [ContentController::class, 'login']);
Route::put('/admin/content', [ContentController::class, 'updateFullContent']);
Route::post('/admin/upload', [ContentController::class, 'uploadFile']);
Route::post('/upload', [ContentController::class, 'uploadFile']);
Route::get('/admin/messages', [ContentController::class, 'getMessages']);
Route::delete('/admin/messages/{id}', [ContentController::class, 'deleteMessage']);

