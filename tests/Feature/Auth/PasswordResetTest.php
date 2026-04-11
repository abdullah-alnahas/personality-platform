<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

test('admin password reset link screen can be rendered', function () {
    $response = $this->get('/admin/forgot-password');

    $response->assertStatus(200);
});

test('admin password reset link can be requested', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/admin/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class);
});

test('admin password reset screen can be rendered', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/admin/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
        $response = $this->get('/admin/reset-password/' . $notification->token);

        $response->assertStatus(200);

        return true;
    });
});

test('admin password can be reset with valid token', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/admin/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
        $response = $this->post('/admin/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'NewP@ssw0rd!23',
            'password_confirmation' => 'NewP@ssw0rd!23',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('admin.login'));

        return true;
    });
});
