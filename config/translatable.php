<?php return [
    /*
     * The locales your application supports.
     *
     * If you want to use a locale different from the default Laravel locale (APP_LOCALE),
     * it must be configured here an in 'available_locales' in the app.php config file.
     *
     * Supported formats:
     * - An array of locale codes: ['en', 'nl', 'fr']
     * - An array of key-value pairs with the locale code as key and the regional variant as value:
     * ['en' => 'en_US', 'nl' => 'nl_BE', 'fr' => 'fr_CA']
     * Regional variants are only relevant for Carbon dates.
     */
    "locales" => ["en", "ar", "tr"],

    /*
     * If 'generate_localized_routes' is true, Nova routes will be generated for each locale.
     * For example, '/nova/en/resources/posts' and '/nova/nl/resources/posts'.
     * Note: this is not compatible with 'nova_route_middleware'.
     */
    "generate_localized_routes" => false,

    /*
     * If 'create_translations_for_all_locales' is true, it will loop through all the locales
     * defined in the `locales` array and create a translation for each of them.
     * If it is false, it will only create a translation for the current locale.
     */
    "create_translations_for_all_locales" => true,

    /*
     * The fallback locale determines the locale to use when the current locale
     * is not available. If this is set to `null`, the Laravel fallback locale will be used.
     */
    "fallback_locale" => null,

    /*
     * If a translation has not been set for a given locale, this locale will be used instead.
     * If this is set to `null` then the behavior of the translated attributes is unchanged.
     *
     * Beware that this configuration value is ignored when the property 'fallback_locale' is
     * filled unless 'fallback_always_load_main_locale' is set to `true`
     */
    "fallback_translation_locale" => null,

    /*
     * If this is set to `true` then the main locale is always loaded for a translatable model even if
     * the `fallback_locale` is filled. This can be useful when using a `Translatable` model as a
     * fallback for a `Translatable` model.
     */
    "fallback_always_load_main_locale" => false,

    /*
     * The locale key used by the routing system. If this is set to `null`,
     * the default Laravel locale key will be used.
     */
    "locale_key" => null,

    /*
     * The database driver used to store translations.
     *
     * Supported drivers: 'json'.
     */
    "translation_driver" => "json",

    /*
     * The class responsible for formatting the translated attributes.
     */
    "attribute_formatter" =>
        \Spatie\Translatable\DefaultAttributeFormatter::class,
];
