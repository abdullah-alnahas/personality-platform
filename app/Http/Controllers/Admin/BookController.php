<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('manage books');

        $books = Book::orderBy('display_order')->orderBy('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn(Book $book) => [
                'id'              => $book->id,
                'title'           => $book->getTranslations('title'),
                'subtitle'        => $book->getTranslations('subtitle'),
                'cover_image_url' => $book->cover_image_url,
                'category'        => $book->category,
                'is_featured'     => $book->is_featured,
                'status'          => $book->status,
                'display_order'   => $book->display_order,
            ]);

        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'can'   => [
                'create' => $request->user()->can('manage books'),
                'edit'   => $request->user()->can('manage books'),
                'delete' => $request->user()->can('manage books'),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('manage books');

        return Inertia::render('Admin/Books/Form', [
            'book'            => null,
            'activeLanguages' => config('translatable.locales'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('manage books');

        $validated = $request->validate([
            'title'           => ['required', 'array', 'max:10'],
            'title.*'         => 'nullable|string|max:500',
            'subtitle'        => ['nullable', 'array', 'max:10'],
            'subtitle.*'      => 'nullable|string|max:500',
            'description'     => ['nullable', 'array', 'max:10'],
            'description.*'   => 'nullable|string|max:65535',
            'cover_image_url' => 'nullable|url|max:2048',
            'buy_link'        => 'nullable|url|max:2048',
            'category'        => 'nullable|string|max:255',
            'display_order'   => 'integer|min:0',
            'is_featured'     => 'boolean',
            'status'          => 'required|in:published,draft',
        ]);

        Book::create($validated);

        return redirect()->route('admin.books.index')
            ->with('success', __('Book created successfully.'));
    }

    public function edit(Book $book): Response
    {
        Gate::authorize('manage books');

        return Inertia::render('Admin/Books/Form', [
            'book' => [
                'id'              => $book->id,
                'title'           => $book->getTranslations('title'),
                'subtitle'        => $book->getTranslations('subtitle'),
                'description'     => $book->getTranslations('description'),
                'cover_image_url' => $book->cover_image_url,
                'buy_link'        => $book->buy_link,
                'category'        => $book->category,
                'display_order'   => $book->display_order,
                'is_featured'     => $book->is_featured,
                'status'          => $book->status,
            ],
            'activeLanguages' => config('translatable.locales'),
        ]);
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        Gate::authorize('manage books');

        $validated = $request->validate([
            'title'           => ['required', 'array', 'max:10'],
            'title.*'         => 'nullable|string|max:500',
            'subtitle'        => ['nullable', 'array', 'max:10'],
            'subtitle.*'      => 'nullable|string|max:500',
            'description'     => ['nullable', 'array', 'max:10'],
            'description.*'   => 'nullable|string|max:65535',
            'cover_image_url' => 'nullable|url|max:2048',
            'buy_link'        => 'nullable|url|max:2048',
            'category'        => 'nullable|string|max:255',
            'display_order'   => 'integer|min:0',
            'is_featured'     => 'boolean',
            'status'          => 'required|in:published,draft',
        ]);

        $book->update($validated);

        return redirect()->route('admin.books.index')
            ->with('success', __('Book updated successfully.'));
    }

    public function destroy(Book $book): RedirectResponse
    {
        Gate::authorize('manage books');

        $book->delete();

        return redirect()->route('admin.books.index')
            ->with('success', __('Book deleted.'));
    }
}
