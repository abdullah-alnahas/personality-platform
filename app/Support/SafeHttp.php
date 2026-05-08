<?php

namespace App\Support;

use InvalidArgumentException;

/**
 * SSRF guard for outbound HTTP requests whose target URL contains user input.
 *
 * Rejects:
 *   - non-http(s) schemes (file://, gopher://, dict://, ftp://, phar://, …)
 *   - hosts resolving to private / loopback / link-local IPv4 + IPv6
 *   - cloud metadata endpoints (169.254.169.254, fd00:ec2::254)
 *   - bracketed IPv6 literals targeting private ranges
 *
 * Usage:
 *   $url = SafeHttp::assertPublic($userSuppliedUrl);
 *   Http::get($url);  // safe to fetch
 */
final class SafeHttp
{
    private const BANNED_IPV4_CIDRS = [
        '0.0.0.0/8',          // current network
        '10.0.0.0/8',         // RFC1918
        '127.0.0.0/8',        // loopback
        '169.254.0.0/16',     // link-local + AWS metadata
        '172.16.0.0/12',      // RFC1918
        '192.168.0.0/16',     // RFC1918
        '100.64.0.0/10',      // CGN
        '224.0.0.0/4',        // multicast
        '240.0.0.0/4',        // reserved
        '255.255.255.255/32', // broadcast
    ];

    /**
     * Returns the URL unchanged if safe, or throws.
     */
    public static function assertPublic(string $url): string
    {
        $parts = parse_url($url);
        if ($parts === false || empty($parts['scheme']) || empty($parts['host'])) {
            throw new InvalidArgumentException('Malformed URL.');
        }

        $scheme = strtolower($parts['scheme']);
        if (!in_array($scheme, ['http', 'https'], true)) {
            throw new InvalidArgumentException("Scheme {$scheme} not allowed.");
        }

        $host = trim($parts['host'], '[]');

        // Hostname literal — resolve all A/AAAA records and check each one.
        // A single private record is enough to reject (DNS rebinding defence).
        $records = @dns_get_record($host, DNS_A | DNS_AAAA);
        $ips = [];
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            $ips[] = $host;
        } elseif (is_array($records)) {
            foreach ($records as $r) {
                if (!empty($r['ip'])) {
                    $ips[] = $r['ip'];
                }
                if (!empty($r['ipv6'])) {
                    $ips[] = $r['ipv6'];
                }
            }
        }

        if (empty($ips)) {
            throw new InvalidArgumentException('Host does not resolve.');
        }

        foreach ($ips as $ip) {
            if (self::isPrivateIp($ip)) {
                throw new InvalidArgumentException('Host resolves to a private / loopback / link-local address.');
            }
        }

        return $url;
    }

    private static function isPrivateIp(string $ip): bool
    {
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            foreach (self::BANNED_IPV4_CIDRS as $cidr) {
                if (self::ipv4InCidr($ip, $cidr)) {
                    return true;
                }
            }
            // PHP's built-in private + reserved range check as belt-and-braces.
            return !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            // IPv6: ::1 (loopback), fc00::/7 (ULA), fe80::/10 (link-local), ::ffff:0:0/96 (IPv4-mapped)
            $bin = inet_pton($ip);
            if ($bin === false) {
                return true;
            }
            // ::1 (loopback)
            if ($bin === inet_pton('::1')) {
                return true;
            }
            $prefix = ord($bin[0]);
            // fc00::/7 ULA: first byte 0xfc or 0xfd
            if ($prefix === 0xfc || $prefix === 0xfd) {
                return true;
            }
            // fe80::/10 link-local: first byte 0xfe, second byte 0x80-0xbf
            if ($prefix === 0xfe && (ord($bin[1]) & 0xc0) === 0x80) {
                return true;
            }
            // IPv4-mapped ::ffff:0:0/96 — re-check as IPv4
            if (str_starts_with(bin2hex($bin), '00000000000000000000ffff')) {
                $mapped = long2ip(unpack('N', substr($bin, 12))[1]);
                return self::isPrivateIp($mapped);
            }
            return false;
        }

        return true;
    }

    private static function ipv4InCidr(string $ip, string $cidr): bool
    {
        [$subnet, $bits] = explode('/', $cidr);
        $bits = (int) $bits;
        if ($bits === 0) {
            return true;
        }
        $mask = -1 << (32 - $bits);
        $ipLong = ip2long($ip);
        $subnetLong = ip2long($subnet);
        if ($ipLong === false || $subnetLong === false) {
            return false;
        }
        return ($ipLong & $mask) === ($subnetLong & $mask);
    }
}
