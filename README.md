# Personality Platform

A web platform built with Laravel, Inertia.js, and React (using MUI and Tailwind CSS) for managing and displaying content.

## Core Technologies

* **Backend:** Laravel 10, PHP 8.1+
* **Frontend:** React, Vite, Inertia.js, MUI, Tailwind CSS
* **Database:** MySQL (Default, configurable)
* **Key Packages:** Spatie (Permissions, MediaLibrary, Translatable, Sluggable), Breeze

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd personality-platform
    ```

2.  **Install Dependencies:**
    ```bash
    composer install
    npm install
    ```

3.  **Environment Setup:**
    ```bash
    cp .env.example .env
    ```
    * Update database credentials (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) and other environment variables in the `.env` file.

4.  **Generate Application Key:**
    ```bash
    php artisan key:generate
    ```

5.  **Database Migration & Seeding:**
    ```bash
    php artisan migrate --seed
    ```
    * This will create database tables and seed initial data, including a default admin user (`admin@example.com` / `password`).

6.  **Build Frontend Assets:**
    * For development: `npm run dev`
    * For production: `npm run build`

7.  **Run the Development Server (Optional):**
    ```bash
    php artisan serve
    ```
    * Access the application at the URL provided (usually `http://127.0.0.1:8000`). Configure a proper web server (like Nginx or Apache) for production.

## Key Features

* Public content display (categories, items)
* User Authentication (Login, Register, Profile)
* Admin Panel (CRUD for Content, Navigation, Settings, Social Links)
* Translatable Content & Settings
* Media Management (Featured Images)
* Subscription Form
* Search Functionality

## License

This project is licensed under the MIT License - see the `composer.json` file for details (implied).
