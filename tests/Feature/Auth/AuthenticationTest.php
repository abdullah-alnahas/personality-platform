<?php

use App\Models\User;
use App\Providers\RouteServiceProvider;

test('admin login screen can be rendered', function () {
    $response = $this->get('/admin/login');

    $response->assertStatus(200);
});

test('admin users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'password',
        '_confirm_email' => '', // honeypot field — must be empty
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(RouteServiceProvider::HOME);
});

test('admin users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/admin/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
        '_confirm_email' => '',
    ]);

    $this->assertGuest();
});

test('admin users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/admin/logout');

    $this->assertGuest();
    $response->assertRedirect(route('admin.login'));
});
