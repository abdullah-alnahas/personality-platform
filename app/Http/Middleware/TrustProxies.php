<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     *
     * Driven by the TRUSTED_PROXIES env var. Accepts a comma-separated list
     * of CIDR ranges (e.g. "10.0.0.0/8,192.168.1.0/24"). The literal value
     * "*" trusts every proxy and MUST NOT be used in production — it lets an
     * attacker forge X-Forwarded-For headers and bypass IP-based rate limits.
     *
     * @var array<int, string>|string|null
     */
    protected $proxies;

    public function __construct()
    {
        $configured = env('TRUSTED_PROXIES');

        if ($configured === null || $configured === '') {
            $this->proxies = null;
        } elseif ($configured === '*') {
            // Refused in production: a wildcard lets any client forge
            // X-Forwarded-For and bypass IP-based rate limiting / lockouts.
            // Operator must supply explicit CIDR ranges (Cloudflare, AWS ELB).
            if (app()->environment('production')) {
                Log::critical('TRUSTED_PROXIES="*" rejected in production; treating as none. Configure explicit CIDR ranges.');
                $this->proxies = null;
            } else {
                $this->proxies = '*';
            }
        } else {
            $this->proxies = array_values(array_filter(array_map('trim', explode(',', $configured))));
        }
    }

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB;
}
