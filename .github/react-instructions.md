**Copilot Instructions for React Projects**

**Objective**: Provide guidelines and best practices for building React applications, focusing on internationalization (i18n) implementation and other React-specific patterns.

**File Scope**:

- Applies to files matching the patterns: `**/*.ts`, `**/*.tsx`, `**/*.jsx`

---

### **Internationalization (i18n) with i18next**

#### **File Structure**

- Store translation files in the `src/locales/` directory with language-specific JSON files (e.g., `en.json`, `ko.json`, `ja.json`).
- Organize translations in a hierarchical structure using nested objects for logical grouping by feature or component.

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

#### **Configuration**

- Use the `i18n.ts` utility file for configuration and initialization:

  ```typescript
  // src/lib/i18n.ts
  import i18n from "i18next";
  import { initReactI18next } from "react-i18next";

  // Import language resources
  import en from "../locales/en.json";
  import ko from "../locales/ko.json";
  import ja from "../locales/ja.json";

  // Initialize i18next
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

  // Utility function to get current locale
  export const getLocale = (): string => {
    return i18n.language || "en";
  };

  // Export the translation function
  export const t = i18n.t.bind(i18n);

  export default i18n;
  ```

---

### **Translation Guidelines**

#### **Using Translations**

- Import the `t` function from `lib/i18n.ts` to access translations:

  ```tsx
  import { t } from "../lib/i18n";

  function MyComponent() {
    return (
      <div>
        <h1>{t("auth.signIn.title")}</h1>
        <label>{t("auth.signIn.emailLabel")}</label>
      </div>
    );
  }
  ```

- For dynamic values, use interpolation with the `{{variable}}` syntax:

  ```tsx
  // In translation file:
  // "welcome": "Welcome, {{name}}!"

  <p>{t("welcome", { name: username })}</p>
  ```

#### **Pluralization**

- Use i18next pluralization features for count-based text:

  ```json
  // In translation file:
  {
    "items": {
      "one": "{{count}} item",
      "other": "{{count}} items"
    }
  }
  ```

  ```tsx
  <p>{t("items", { count: itemCount })}</p>
  ```

#### **Language Switching**

- Implement language switching with the `i18n.changeLanguage` function:

  ```tsx
  import i18n from "../lib/i18n";

  function LanguageSwitcher() {
    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    return (
      <div>
        <button onClick={() => changeLanguage("en")}>English</button>
        <button onClick={() => changeLanguage("ko")}>한국어</button>
        <button onClick={() => changeLanguage("ja")}>日本語</button>
      </div>
    );
  }
  ```

---

### **Best Practices**

#### **Key Structure**

- Use dot notation for hierarchical keys (e.g., `component.subcomponent.element.property`).
- Group related translations under common prefixes (e.g., all sign-in related texts under `signIn.*`).
- Keep consistent naming conventions for keys across language files.

#### **Fallback Handling**

- Always provide complete translations in the fallback language (typically English).
- Use namespaces for modular loading of translations when dealing with large applications.

#### **Development Workflow**

- Add new keys to all language files simultaneously to avoid missing translations.
- Comment complex or context-dependent translations in the default language file.
- Use the same key structure across all language files.

#### **Performance Considerations**

- Use translation key references (`t('key')`) instead of direct string access.
- For components with many translations, consider using the `useTranslation` hook from react-i18next to avoid unnecessary re-renders.
- For large applications, use namespaces to load translations on demand:

  ```tsx
  import { useTranslation } from "react-i18next";

  function MyComponent() {
    const { t } = useTranslation("namespace");
    return <h1>{t("key")}</h1>;
  }
  ```

#### **Format Handling**

- For dates, numbers, and currencies, use specialized formatting:

  ```tsx
  // Date formatting
  import { format } from "date-fns";
  import { ko, ja, enUS } from "date-fns/locale";

  const locales = { en: enUS, ko, ja };
  const currentLocale = locales[i18n.language] || enUS;

  // Format date according to current locale
  const formattedDate = format(new Date(), "PPP", { locale: currentLocale });
  ```

  ```tsx
  // Number and currency formatting
  const formatter = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "USD",
  });

  const formattedPrice = formatter.format(price);
  ```

---

### **Integration with Convex**

- Use the locale in Convex function calls when language-specific operations are needed:

  ```tsx
  import { useConvexAuth } from "convex/react";
  import { useAuthActions } from "@convex-dev/auth/react";
  import { getLocale } from "../lib/i18n";

  function SignIn() {
    const { signIn } = useAuthActions();

    // Use the appropriate provider ID based on current locale
    const locale = getLocale();
    const providerId = `resend-otp-${locale}`;

    const handleSignIn = async (email) => {
      await signIn(providerId, { email });
    };

    // Component JSX
  }
  ```

- Store user language preferences in the Convex database for persistence:

  ```typescript
  // Convex function to update user language preference
  export const updateLanguagePreference = mutation({
    args: {
      userId: v.id("users"),
      language: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
      await ctx.db.patch(args.userId, {
        languagePreference: args.language,
      });
      return null;
    },
  });
  ```

---

### **Example: Complete i18n Implementation**

**Task**: Create a sign-in form with internationalization support for English, Korean, and Japanese.

**Requirements**:

- Translation files for all supported languages.
- Language switching capability.
- Properly structured translation keys.
- Effective use of the translation utility.

**Implementation**:

```tsx
// src/components/pages/SignIn.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { t, getLocale } from "../../lib/i18n";
import { cn } from "../../lib/utils";

export default function SignIn() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Use locale-specific provider
  const locale = getLocale();
  const providerId = `resend-otp-${locale}`;

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await signIn(providerId, { email });
      setIsCodeSent(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col h-screen")}>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-md p-8 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
            {t("signIn.title")}
          </h2>

          {!isCodeSent ? (
            <form onSubmit={handleSendCode} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  {t("signIn.emailLabel")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("signIn.emailPlaceholder")}
                  className={cn(
                    "w-full px-4 py-3 rounded-md",
                    "bg-background/50 backdrop-blur-sm",
                    "border border-border/50 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-primary/50",
                    "focus-visible:border-primary/50 transition-all"
                  )}
                />
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full py-3 rounded-lg font-medium",
                  "bg-gradient-to-r from-primary to-primary/90",
                  "text-primary-foreground shadow-lg",
                  "hover:from-primary/90 hover:to-primary/80",
                  "transition-all"
                )}
              >
                {t("signIn.signInWithEmail")}
              </button>
            </form>
          ) : (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t("signIn.verifyEmailMessage")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```
