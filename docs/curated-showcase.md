# CPK curated showcase

The Showcase page has two separate collections: CPK editorial adoption examples
and member-owned community submissions. The initial editorial collection has
100 entries (35 React Native, 40 Flutter, 25 Kotlin Multiplatform). It is an
educational selection, not a popularity ranking or an endorsement by the brands.

## Evidence and maintenance

The source of truth is
`apps/web/src/components/pages/showcase/catalog-data.ts`. Each entry records its
publisher, product description, implementation scope, public evidence URL and
evidence review date. Korean and English descriptions are written for CPK;
Japanese navigation currently uses explicitly labelled English entry copy.

Sources are first-party framework showcases, Expo customer stories, engineering
team publications and the Bluesky source repository. Where an engineering blog
blocks automated access, the Kotlin official case-study gallery supplies the
publicly stated scope. The review date records when the evidence was read; it
does not assert the latest released application still has the same architecture.
No download counts, adoption percentages or popularity ranks are inferred.

When adding or changing an entry:

1. Read its first-party evidence and distinguish an entire app, selected features,
   shared logic and an official listing with unspecified implementation scope.
2. Name the actual product. For example, k.ride is not Kakao T, Wolt Merchant is
   not the consumer Wolt app, and Netflix Studio apps are not the streaming app.
3. Write concise Korean and English descriptions. Preserve historical naming or
   limited product scope in the adoption text. Check rebrands and retired apps.
4. Validate HTTPS evidence and optional product links. Omit dead or unverified
   product links instead of inventing replacements. A successful HTTP response
   containing an access challenge is not evidence of working content.
5. Use a verified app icon and record its public listing in `imageSourceUrl`.
   Match the product and publisher, not a similarly named app or company logo.
   Prefer App Store / Google Play artwork or official download-page icons; web
   products may use their official home-screen touch icon. Do not download or
   republish artwork. Render the image edge to edge with rounded corners and no
   padding. Keep the fixed-size text fallback only for network failures.
6. Update the evidence review date only after rereading the supporting source.
7. Run `bun run test`, `bun run lint`, `bun run tsc`, `bun run build:web` and
   `git diff --check`. Verify search, combined filters, load more, mobile layout,
   source links and the separate community submission flow in a browser.

The catalog is independent of Convex. Do not seed member records, assign an
invented author, attach fake engagement, or change ownership checks to add an
editorial example. Member submissions continue through the authenticated form.
Catalog search/filter state is carried in URL query parameters so sign-in retains
the visitor's destination.

## Initial research (2026-09-06)

- React Native: https://reactnative.dev/showcase
- Expo customer stories: https://expo.dev/customers
- Toss engineering: https://toss.tech/article/react-native-2024
- Bluesky implementation: https://github.com/bluesky-social/social-app
- Flutter: https://flutter.dev/showcase (individual case links on every card)
- Kotlin: https://kotlinlang.org/case-studies/ (individual articles where available)

Product links were checked separately. Unavailable Wix, Wolt, Sony, Omnissa and
other product URLs were omitted; their verified adoption evidence remains linked.

## Icon audit (2026-09-06)

All 100 entries have remote icons and separate image provenance. Most use store
artwork; Rows and Better use official home-screen icons, Rive its desktop download
icon, and Office the React Native showcase app icon. Prodicle and Baidu Wonder
use archived app-listing icons because current public listings are unavailable.
Compra Certa retains its historical Apple artwork. These archival icons do not
assert that retired apps are available for download today. Icon sources are
independent of the framework-adoption evidence and do not change its scope.
