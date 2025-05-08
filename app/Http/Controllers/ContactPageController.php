<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactSubmissionRequest;
use App\Models\ContactSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
// Optional: Mail facade and Mailable if sending notifications
// use Illuminate\Support\Facades\Mail;
// use App\Mail\ContactFormSubmitted;

class ContactPageController extends Controller
{
    /**
     * Display the contact page.
     */
    public function show(Request $request): Response
    {
        // You could fetch contact details from settings here if needed
        // $contactEmail = Setting::where('key', 'contact_email')->first()?->value;
        return Inertia::render('Contact', [
            // 'contactEmail' => $contactEmail,
        ]);
    }

    /**
     * Handle storing the contact form submission.
     */
    public function store(StoreContactSubmissionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        ContactSubmission::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
            'status' => 'new', // Default status
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Optional: Send notification email to admin
        // Mail::to(config('mail.admin_address'))->send(new ContactFormSubmitted($validated));

        return back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }
}
