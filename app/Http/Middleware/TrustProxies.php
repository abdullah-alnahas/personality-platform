<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

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
            // Discouraged but supported for single-host setups behind a known LB.
            $this->proxies = '*';
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
