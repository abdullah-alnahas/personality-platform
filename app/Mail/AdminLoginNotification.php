<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminLoginNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $ip,
        public string $userAgent,
        public string $timestamp,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New sign-in to your admin account',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-login-notification',
            with: [
                'userName' => $this->userName,
                'ip' => $this->ip,
                'userAgent' => $this->userAgent,
                'timestamp' => $this->timestamp,
                'resetUrl' => route('admin.password.request'),
            ],
        );
    }
}
