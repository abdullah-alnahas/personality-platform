<?php

namespace Database\Seeders;

use App\Models\SocialAccount;
use Illuminate\Database\Seeder;

class SocialAccountsSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'platform' => 'youtube',
                'url' => 'https://www.youtube.com/@AounalKaddoumi',
                'account_name' => ['en' => 'YouTube', 'ar' => 'يوتيوب', 'tr' => 'YouTube'],
                'display_order' => 10,
            ],
            [
                'platform' => 'facebook',
                'url' => 'https://www.facebook.com/profile.php?id=100044365216438',
                'account_name' => ['en' => 'Facebook', 'ar' => 'فيسبوك', 'tr' => 'Facebook'],
                'display_order' => 20,
            ],
            [
                'platform' => 'instagram',
                'url' => 'https://www.instagram.com/awnqaddoumi',
                'account_name' => ['en' => 'Instagram', 'ar' => 'انستغرام', 'tr' => 'Instagram'],
                'display_order' => 30,
            ],
            [
                'platform' => 'x',
                'url' => 'https://x.com/awn_qaddoumi',
                'account_name' => ['en' => 'X (Twitter)', 'ar' => 'إكس', 'tr' => 'X'],
                'display_order' => 40,
            ],
            [
                'platform' => 'telegram',
                'url' => 'https://t.me/AounalKaddoumi',
                'account_name' => ['en' => 'Telegram', 'ar' => 'تيليجرام', 'tr' => 'Telegram'],
                'display_order' => 50,
            ],
            [
                'platform' => 'whatsapp',
                'url' => 'https://chat.whatsapp.com/Gwc8uWpq20c2DQ43TpTu0Y',
                'account_name' => ['en' => 'WhatsApp Channel', 'ar' => 'قناة واتساب', 'tr' => 'WhatsApp Kanalı'],
                'display_order' => 60,
            ],
            [
                'platform' => 'tiktok',
                'url' => 'https://www.tiktok.com/@awn.kaddumi',
                'account_name' => ['en' => 'TikTok', 'ar' => 'تيك توك', 'tr' => 'TikTok'],
                'display_order' => 70,
            ],
            [
                'platform' => 'linktree',
                'url' => 'https://linktr.ee/Awnqaddoumi',
                'account_name' => ['en' => 'All Links', 'ar' => 'كل الروابط', 'tr' => 'Tüm Bağlantılar'],
                'display_order' => 80,
            ],
            [
                'platform' => 'phone',
                'url' => 'tel:+962777275027',
                'account_name' => ['en' => 'Phone', 'ar' => 'هاتف', 'tr' => 'Telefon'],
                'display_order' => 90,
            ],
            [
                'platform' => 'email',
                'url' => 'mailto:awnqaddoumi@gmail.com',
                'account_name' => ['en' => 'Email', 'ar' => 'البريد الإلكتروني', 'tr' => 'E-posta'],
                'display_order' => 100,
            ],
        ];

        foreach ($accounts as $data) {
            SocialAccount::updateOrCreate(
                ['platform' => $data['platform']],
                [
                    'url' => $data['url'],
                    'account_name' => $data['account_name'],
                    'display_order' => $data['display_order'],
                    'status' => 'active',
                ]
            );
        }
    }
}
