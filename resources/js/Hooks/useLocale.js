import { usePage } from "@inertiajs/react";

/**
 * @typedef {object} LocaleInfo
 * @property {string} code - e.g., 'en', 'ar'
 * @property {string} name - e.g., 'English', 'Arabic'
 * @property {string} native_name - e.g., 'English', 'العربية'
 * @property {boolean} is_rtl - True if the language is right-to-left
 */

/**
 * Custom hook for accessing localization information and utilities.
 *
 * @returns {{
 *  currentLocale: string,
 *  currentLang: LocaleInfo | undefined,
 *  availableLocales: LocaleInfo[],
 *  getTranslatedField: (fieldObject: any, fieldLocale?: string, fallback?: string) => string,
 *  isRTL: boolean
 * }}
 */
export function useLocale() {
    const { props } = usePage();
    const {
        current_locale: currentLocaleCode = "en", // Default to 'en' if not provided
        available_locales: availableLocales = [],
    } = props;

    const currentLang = availableLocales.find(
        (lang) => lang.code === currentLocaleCode,
    );
    const isRTL = currentLang?.is_rtl || false;

    /**
     * Retrieves a translated field from a translatable object.
     *
     * @param {object|string|null} fieldObject - The object containing translations (e.g., {en: 'Hello', ar: 'مرحبا'}) or a simple string.
     * @param {string} [fieldLocale=currentLocaleCode] - The desired locale. Defaults to the current application locale.
     * @param {string} [fallback=''] - The fallback string if the translation is not found.
     * @returns {string} The translated string or the fallback.
     */
    const getTranslatedField = (
        fieldObject,
        fieldLocale = currentLocaleCode,
        fallback = "",
    ) => {
        if (fieldObject === null || fieldObject === undefined) {
            return fallback;
        }
        if (typeof fieldObject !== "object") {
            return String(fieldObject) || fallback;
        }

        // Try requested locale, then current app locale, then first available translation in object, then fallback
        return (
            fieldObject[fieldLocale] ||
            fieldObject[currentLocaleCode] ||
            Object.values(fieldObject)[0] ||
            fallback
        );
    };

    return {
        currentLocale: currentLocaleCode,
        currentLang,
        availableLocales,
        getTranslatedField,
        isRTL,
    };
}
