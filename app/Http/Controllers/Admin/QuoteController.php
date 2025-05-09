<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Http\Requests\Admin\StoreQuoteRequest;
use App\Http\Requests\Admin\UpdateQuoteRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    public function index(): Response
    {
        $this->authorize("manage quotes");
        $quotes = Quote::latest()->paginate(15)->withQueryString();
        return Inertia::render("Admin/Quotes/Index", [
            "quotes" => $quotes,
            "can" => [
                "create" => auth()->user()->can("manage quotes"), // Simplified, can be more granular
                "edit" => auth()->user()->can("manage quotes"),
                "delete" => auth()->user()->can("manage quotes"),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize("manage quotes");
        return Inertia::render("Admin/Quotes/Form", [
            "quote" => null,
            "activeLanguages" => config("translatable.locales"), // Pass available languages
        ]);
    }

    public function store(StoreQuoteRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        Quote::create($validatedData);
        return redirect()
            ->route("admin.quotes.index")
            ->with("success", "Quote created successfully.");
    }

    public function edit(Quote $quote): Response
    {
        $this->authorize("manage quotes");
        return Inertia::render("Admin/Quotes/Form", [
            "quote" => $quote,
            "activeLanguages" => config("translatable.locales"),
        ]);
    }

    public function update(
        UpdateQuoteRequest $request,
        Quote $quote
    ): RedirectResponse {
        $validatedData = $request->validated();
        $quote->update($validatedData);
        return redirect()
            ->route("admin.quotes.index")
            ->with("success", "Quote updated successfully.");
    }

    public function destroy(Quote $quote): RedirectResponse
    {
        $this->authorize("manage quotes");
        $quote->delete();
        return redirect()
            ->route("admin.quotes.index")
            ->with("success", "Quote deleted successfully.");
    }
}
