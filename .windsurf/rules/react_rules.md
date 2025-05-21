---
description: Guidelines and best practices for building React applications, focusing on internationalization (i18n) implementation and other React-specific patterns
globs: **/src/**/*.ts,**/src/**/*.tsx,**/src/**/*.jsx,**/src/**/*.js
---

# React Guidelines

## Internationalization (i18n) Guidelines

### File Structure
- Store translation files in the `src/locales/` directory with language-specific JSON files (e.g., `en.json`, `ko.json`, `ja.json`)
- Organize translations in a hierarchical structure using nested objects for logical grouping by feature or component:
  ```json
  {
    "common": {
      "buttons": {
        "submit": "Submit",
        "cancel": "Cancel"
      }
    },
    "auth": {
      "signIn": {
        "title": "Sign In",
        "emailLabel": "Email Address"
      }
    }
  }
  ```

### Configuration
- Use the `i18n.ts` utility file for configuration and initialization:
  ```typescript
  import i18n from "i18next";
  import { initReactI18next } from "react-i18next";
  import en from "../locales/en.json";
  import ko from "../locales/ko.json";
  import ja from "../locales/ja.json";

  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

  export const getLocale = (): string => {
    return i18n.language || "en";
  };

  export const t = i18n.t.bind(i18n);
  
  export default i18n;
  ```

### Translation Usage
- Import the `t` function to access translations
- Use interpolation with the `{{variable}}` syntax for dynamic values
- Use pluralization features for count-based text
- Implement language switching with the `i18n.changeLanguage` function

### Best Practices
- Use dot notation for hierarchical keys
- Group related translations under common prefixes
- Always provide complete translations in the fallback language
- Use the `useTranslation` hook from react-i18next for components with many translations
- Use specialized formatting for dates, numbers, and currencies

### Integration with Convex
- Use the locale in Convex function calls when needed
- Store user language preferences in the Convex database
