<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Image upload caps (kilobytes — Laravel `max:` rule unit)
    |--------------------------------------------------------------------------
    | `max_kb` is the canonical cap applied to all image uploads. Override
    | per-call site only when there is a clear product reason. Keep server +
    | client values in sync via the `max_bytes_human` field.
    */
    'image' => [
        'max_kb' => env('MEDIA_IMAGE_MAX_KB', 10240), // 10 MB
        'allowed_mimes' => ['jpeg', 'png', 'jpg', 'gif', 'webp'],
    ],

    /* Pre-formatted human label for UI ("max 10 MB"). */
    'max_label' => env('MEDIA_IMAGE_MAX_LABEL', '10 MB'),
];
