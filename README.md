# Mocha-Chai API Tests for DMoney

An automated REST API test suite for **DMoney**, a mobile-money style wallet service. It checks the main money flows end to end: admin login, user creation, activation, OTP login, deposits, send money, withdraw and merchant payment. It is written in JavaScript with **Mocha** (test runner) and **Chai** (assertions), and uses **Axios** for the HTTP calls.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [What are Mocha and Chai?](#what-are-mocha-and-chai)
3. [What this project tests](#what-this-project-tests)
4. [Project structure](#project-structure)
5. [How it works](#how-it-works)
6. [Prerequisites](#prerequisites)
7. [Setup](#setup)
8. [Running the tests](#running-the-tests)
9. [Configuration reference](#configuration-reference)
10. [Troubleshooting](#troubleshooting)
11. [Security notes](#security-notes)

---

## Tech stack

| Tool | Purpose |
| --- | --- |
| [Node.js](https://nodejs.org/) | JavaScript runtime. The project uses ES Modules (`"type": "module"`), so use a current LTS version. |
| [Mocha](https://mochajs.org/) | Test runner. It provides `describe` and `it`, runs the tests in order and prints the report. |
| [Chai](https://www.chaijs.com/) | Assertion library. It provides `expect(...).to.equal(...)` style checks. |
| [Axios](https://axios-http.com/) | HTTP client used to call the DMoney API. |
| [@faker-js/faker](https://fakerjs.dev/) | Generates realistic random data, such as user names. |
| [dotenv](https://github.com/motdotla/dotenv) | Loads configuration and secrets from a `.env` file. |

---

## What are Mocha and Chai?

**Mocha** is a test framework for Node.js. You group tests with `describe()` and write each test with `it()`. Mocha runs them one after another, supports `async/await`, and reports which ones passed or failed.

```js
describe("Admin login", () => {
  it("logs in with valid credentials", async () => {
    // test body
  });
});
```

**Chai** is an assertion library. Mocha runs the tests, but it doesn't say what counts as correct. Chai does that. It reads like plain English:

```js
expect(response.status).to.equal(200);
expect(response.data.message).to.contains("Payment successful");
```

If an assertion fails, Chai throws an error and Mocha marks that test as failed.

**Together:** Mocha organises and runs the tests, and Chai decides whether each one passes.

---

## What this project tests

The suite is a single file, [tests/dmoney.spec.js](tests/dmoney.spec.js). It follows the real lifecycle of the system, in this order:

| # | Group | What is verified |
| --- | --- | --- |
| 1 | **Admin login** | Login fails with wrong credentials (`401`). Login succeeds with valid credentials (`200`) and the token is saved. |
| 2 | **Admin create users** | The admin can create 2 Customers, 1 Agent and 1 Merchant (`201`). Creating a user with a phone number that already exists is rejected (`208`). |
| 3 | **Admin activate users** | The admin activates all four new users (`200`). |
| 4 | **Other users login** | Customers and the Agent log in with phone number and password, then verify with OTP. The SYSTEM user logs in. Tokens are saved. |
| 5 | **Transaction money** | SYSTEM deposits 5000 to the Agent. A deposit with no token is rejected (`401`). The Agent deposits 2000 to Customer 1 and earns a 2.5% commission (50). Customer 1 sends 1000 to Customer 2 with a fee of 5. Sending money from another user's account is blocked (`403`). Customer 2 withdraws 500 from the Agent with a fee of 1% (minimum 5). Customer 2 pays a Merchant 400 with a fee of 1% (minimum 5). |

Roles covered: **Admin, SYSTEM, Customer, Agent, Merchant**.

Endpoints exercised:

- `POST /user/login`
- `POST /user/create`
- `PATCH /user/update/:id`
- `POST /user/verify-otp`
- `POST /transaction/deposit`
- `POST /transaction/sendmoney`
- `POST /transaction/withdraw`
- `POST /transaction/payment`

---

## Project structure

```
Mocha-Chai/
├── tests/
│   └── dmoney.spec.js        # The whole test suite (all describe/it blocks)
├── utils/
│   ├── envUtils.js           # getEnvValue / setEnvValue: read and write values in .env
│   └── randomNumUtils.js     # randomNum(min, max): random integer for unique emails and phones
├── .env                      # Your local secrets and runtime values (git-ignored)
├── .env.example              # Template for .env
├── .gitignore                # Ignores node_modules/ and .env
├── package.json              # Dependencies and the `npm test` script
├── package-lock.json         # Locked dependency versions
└── README.md                 # This file
```

---

## How it works

**Tests depend on each other.** Each group builds on the one before it. Login produces a token, the token is used to create users, the users are activated, they log in, and then they make transactions. Because of this, the tests must run in order and as a whole file.

**Runtime values are saved to `.env`.** When a test produces a value that later tests need, it writes it with `setEnvValue()`. This covers tokens, user IDs and phone numbers:

```
adminAccessToken, customer1Id, customer1PhoneNumber, customer1AccessToken,
customer2Id, customer2PhoneNumber, customer2AccessToken,
agentId, agentPhoneNumber, agentAccessToken,
merchantId, merchantPhoneNumber, systemAccessToken
```

Later tests read them back with `getEnvValue()`. You never set these by hand. They are created and overwritten on every run.

**Test data is random.** Names come from Faker. Emails and phone numbers use `randomNum()`, so each run creates fresh users and doesn't collide with the previous run.

**Error cases are handled on purpose.** Axios throws on non-2xx responses. For negative tests (wrong password, no token, forbidden action) the code catches the error and uses `error.response`, so it can assert on the expected `401`, `403` or `208`.

**OTP login in the dev environment.** The OTP step calls `/user/verify-otp?env=dev` with the fixed OTP `0000`, which the dev environment accepts.

---

## Prerequisites

- **Node.js** (current LTS) and **npm**
- Access to the DMoney API, which means a base URL and a secret key. Ask the project owner for both.

Check your Node version:

```bash
node -v
```

---

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create your `.env` file from the template**

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env

   # Windows PowerShell
   Copy-Item .env.example .env
   ```

3. **Fill in the two required values in `.env`**

   ```env
   baseUrl = "https://<your-api-host>"
   X_AUTH_SECRET_KEY = "<your-secret-key>"
   ```

   - `baseUrl` has no trailing slash.
   - `X_AUTH_SECRET_KEY` is sent in the `X-AUTH-SECRET-KEY` header.

---

## Running the tests

```bash
npm test
```

This runs `npx mocha ./tests/dmoney.spec.js`.

Mocha prints each group and each test with a pass or fail mark, then a summary at the end.

Useful options:

```bash
# Run only tests whose name matches a pattern (see the warning below)
npx mocha ./tests/dmoney.spec.js --grep "Admin login"

# Increase the timeout if the API is slow (milliseconds)
npx mocha ./tests/dmoney.spec.js --timeout 20000
```

> **Warning:** Because the tests depend on each other, don't run a single test in isolation (`it.only`, `--grep`) unless the values it needs are already in `.env` from an earlier full run. Otherwise it fails with `undefined` values or `401` errors.

---

## Configuration reference

| Variable | Set by | Description |
| --- | --- | --- |
| `baseUrl` | **You** | API base URL, no trailing slash |
| `X_AUTH_SECRET_KEY` | **You** | Secret sent as the `X-AUTH-SECRET-KEY` header |
| `adminAccessToken`, `systemAccessToken` | Tests | Tokens from the admin and SYSTEM logins |
| `customer1*`, `customer2*`, `agent*`, `merchant*` | Tests | IDs, phone numbers and access tokens for the created users |

---

## Troubleshooting

| Problem | Likely cause and fix |
| --- | --- |
| `Cannot read properties of undefined` or requests going to `undefined/user/login` | `.env` is missing or `baseUrl` is not set. Repeat the setup steps. |
| `401 Unauthorized` on steps that should pass | `X_AUTH_SECRET_KEY` is wrong, or a token is stale. Run the full suite again from the start. |
| Many tests fail after the first failure | Expected. Later groups depend on values from earlier ones. Fix the first failing test and re-run everything. |
| Timeout errors | The API is slow or unreachable. Check your connection and the `baseUrl`, or raise `--timeout`. |
| `ERR_MODULE_NOT_FOUND` or `Cannot use import statement` | You are on an old Node version, or `"type": "module"` was removed from `package.json`. |

---

## Security notes

- `.env` holds secrets and live tokens. It is listed in [.gitignore](.gitignore) and must **never** be committed.
- Commit only `.env.example`, with placeholder values.
- The `X_AUTH_SECRET_KEY` is shared on a need-to-know basis. Don't paste it in chats, issues or screenshots.
