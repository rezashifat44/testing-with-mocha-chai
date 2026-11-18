# Mocha-Chai API tests (DMoney)

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create your local env file from the template:
   ```
   cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
   ```
3. Open `.env` and fill in the two required values:
   - `baseUrl`: API base URL (no trailing slash)
   - `X_AUTH_SECRET_KEY`: secret sent in the `X-AUTH-SECRET-KEY` header

   Ask the project owner for these values. `.env` is git-ignored and must never be committed.

## Run

```
npm test
```

The tests run in order and depend on each other (login, create users, activate, transactions).
Run the whole file; don't use `it.only` on a single test unless the values in `.env` are still fresh.

## Notes

Tokens, user IDs and phone numbers are written into `.env` automatically while the tests run
(see `utils/envUtils.js`). You don't need to set them by hand.
