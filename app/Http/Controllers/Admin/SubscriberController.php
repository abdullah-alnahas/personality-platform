<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubscriberController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('manage subscribers');

        $query = Subscriber::query();

        if ($status = $request->query('status')) {
            if (in_array($status, ['pending', 'confirmed', 'unsubscribed'], true)) {
                $query->where('status', $status);
            }
        }
        if ($search = trim((string) $request->query('search', ''))) {
            $query->where('email', 'like', '%' . $search . '%');
        }

        $subscribers = $query->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Subscribers/Index', [
            'subscribers' => $subscribers,
            'filters'     => [
                'status' => $status ?? '',
                'search' => $search ?? '',
            ],
            'stats' => [
                'total'        => Subscriber::count(),
                'confirmed'    => Subscriber::where('status', 'confirmed')->count(),
                'pending'      => Subscriber::where('status', 'pending')->count(),
                'unsubscribed' => Subscriber::where('status', 'unsubscribed')->count(),
            ],
            'can' => [
                'delete' => auth()->user()->can('manage subscribers'),
                'export' => auth()->user()->can('manage subscribers'),
            ],
        ]);
    }

    public function destroy(Subscriber $subscriber): RedirectResponse
    {
        $this->authorize('manage subscribers');
        $subscriber->delete();

        return back()->with('success', __('Subscriber deleted.'));
    }

    public function export(): StreamedResponse
    {
        $this->authorize('manage subscribers');

        $filename = 'subscribers-' . now()->format('Ymd-His') . '.csv';

        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['id', 'email', 'status', 'confirmed_at', 'created_at']);
            Subscriber::orderBy('id')->chunk(500, function ($rows) use ($out) {
                foreach ($rows as $row) {
                    fputcsv($out, [
                        $row->id,
                        $row->email,
                        $row->status,
                        optional($row->confirmed_at)->toIso8601String(),
                        $row->created_at?->toIso8601String(),
                    ]);
                }
            });
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
