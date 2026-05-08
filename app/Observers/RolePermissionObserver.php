<?php

namespace App\Observers;

use App\Http\Middleware\CacheFullPage;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\PermissionRegistrar;

/**
 * Observes Role and Permission models. Spatie already clears its own permission
 * cache on save/delete, but this observer adds:
 *   1. Audit-log line so admin role mutations show up in the application log.
 *   2. Defence-in-depth call to forgetCachedPermissions() for the rare case
 *      Spatie's own hook misses (custom relations, raw DB writes).
 *   3. Full-page-cache flush — cheap, and protects against role-driven view
 *      differences leaking through cached guest pages in future code.
 */
class RolePermissionObserver
{
    public function saved($model): void
    {
        $this->invalidate('saved', $model);
    }

    public function deleted($model): void
    {
        $this->invalidate('deleted', $model);
    }

    private function invalidate(string $event, $model): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        CacheFullPage::flush();

        Log::info('Spatie permission/role mutation', [
            'event' => $event,
            'model' => class_basename($model),
            'id' => $model->getKey(),
            'name' => $model->name ?? null,
            'guard' => $model->guard_name ?? null,
        ]);
    }
}
