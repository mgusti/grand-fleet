<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('landing');
});

Route::get('/play', function () {
    return view('play');
});
