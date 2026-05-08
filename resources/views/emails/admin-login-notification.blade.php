<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New sign-in to your admin account</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; color: #1E2A22; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #1E2A22; border-bottom: 2px solid #C9A94E; padding-bottom: 8px;">New sign-in detected</h2>

    <p>Hi {{ $userName }},</p>

    <p>Your admin account was just signed in to. Details:</p>

    <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr><td style="padding: 6px 12px; color: #666;">Time</td><td style="padding: 6px 12px;">{{ $timestamp }}</td></tr>
        <tr><td style="padding: 6px 12px; color: #666;">IP address</td><td style="padding: 6px 12px;">{{ $ip }}</td></tr>
        <tr><td style="padding: 6px 12px; color: #666;">Device</td><td style="padding: 6px 12px;">{{ $userAgent }}</td></tr>
    </table>

    <p>If this was you, no action needed.</p>

    <p>If you don't recognise this sign-in, change your password immediately:</p>

    <p>
        <a href="{{ $resetUrl }}" style="display: inline-block; background: #1E2A22; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 4px;">
            Reset password
        </a>
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin-top: 32px;">
    <p style="color: #999; font-size: 13px;">Sent automatically by the platform. Do not reply.</p>
</body>
</html>
