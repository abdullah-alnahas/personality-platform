<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactSubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('manage contact submissions');

        $query = ContactSubmission::query();

        if ($status = $request->query('status')) {
            if (in_array($status, ['new', 'read', 'archived'], true)) {
                $query->where('status', $status);
            }
        }

        // PII columns are encrypted; can't filter by email/name in SQL.
        $rows = $query->latest('id')->paginate(20)->withQueryString();

        return Inertia::render('Admin/ContactSubmissions/Index', [
            'submissions' => $rows,
            'filters' => [
                'status' => $status ?? '',
            ],
            'stats' => [
                'total'    => ContactSubmission::count(),
                'new'      => ContactSubmission::where('status', 'new')->count(),
                'read'     => ContactSubmission::where('status', 'read')->count(),
                'archived' => ContactSubmission::where('status', 'archived')->count(),
            ],
            'can' => [
                'view'   => auth()->user()->can('manage contact submissions'),
                'update' => auth()->user()->can('manage contact submissions'),
                'delete' => auth()->user()->can('manage contact submissions'),
                'export' => auth()->user()->can('manage contact submissions'),
            ],
        ]);
    }

    public function show(ContactSubmission $submission): Response
    {
        $this->authorize('manage contact submissions');

        if ($submission->status === 'new') {
            $submission->update(['status' => 'read']);
        }

        return Inertia::render('Admin/ContactSubmissions/Show', [
            'submission' => [
                'id'         => $submission->id,
                'name'       => $submission->name,
                'email'      => $submission->email,
                'message'    => $submission->message,
                'status'     => $submission->status,
                'ip_address' => $submission->ip_address,
                'user_agent' => $submission->user_agent,
                'created_at' => $submission->created_at?->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, ContactSubmission $submission): RedirectResponse
    {
        $this->authorize('manage contact submissions');

        $data = $request->validate([
            'status' => ['required', Rule::in(['new', 'read', 'archived'])],
        ]);

        $submission->update($data);

        return back()->with('success', __('Submission updated.'));
    }

    public function destroy(ContactSubmission $submission): RedirectResponse
    {
        $this->authorize('manage contact submissions');
        $submission->delete();

        return redirect()
            ->route('admin.contact-submissions.index')
            ->with('success', __('Submission deleted.'));
    }

    public function export(): StreamedResponse
    {
        $this->authorize('manage contact submissions');

        $filename = 'contact-submissions-' . now()->format('Ymd-His') . '.csv';

        return response()->streamDownload(function () {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, ['id', 'name', 'email', 'message', 'status', 'ip_address', 'created_at']);
            ContactSubmission::orderBy('id')->chunk(200, function ($rows) use ($out) {
                foreach ($rows as $row) {
                    fputcsv($out, [
                        $row->id,
                        $row->name,
                        $row->email,
                        $row->message,
                        $row->status,
                        $row->ip_address,
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
