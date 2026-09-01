---
name: auth-e2e
description: Verify Cross-Platform Korea email OTP and GitHub authentication, redirect behavior, and verified-email account linking without exposing credentials or identities. Use for login regressions, provider changes, OTP email changes, or account-merge verification.
---

# Authentication E2E

Test the complete flow appropriate to the change while keeping structural and
live-provider evidence distinct.

## Invariants

- A signed-in visitor opening `/sign-in` returns to a safe requested path or
  home; it does not see an "already signed in" dead end.
- External `returnTo` values, protocol-relative paths, and recursive sign-in
  destinations are rejected.
- Email OTPs are eight digits, expire after fifteen minutes, and are never
  logged, committed, quoted, or captured in screenshots.
- GitHub uses the provider issuer `https://github.com/login/oauth`.
- OTP and GitHub identities link only when the provider supplies the same unique
  verified email. Never merge by an unverified email, display name, or guess.

## Safe verification

Read `convex/auth.ts`, `convex/ResendOTP.ts`, the sign-in UI, and the installed
Convex Auth account-linking implementation. Run lint, TypeScript, and the web
build. Verify redirect and form states locally without sending an email.

## Live provider lane

Sending an OTP, authorizing GitHub, signing out, or changing a production user
is live account activity. Run only the lane the user authorized. The user enters
credentials and OTPs directly; never inspect browser storage or copy them into
tools.

For account linking, compare redacted before/after counts in the exact target
deployment. A pass requires one canonical user and two provider accounts for the
same verified email, with existing profile/content ownership preserved. If the
test cannot prove the exact deployment or unique verified email, report it as
blocked rather than passed.
