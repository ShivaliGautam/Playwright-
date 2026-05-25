# QA Automation Framework
### Playwright · TypeScript · BDD (Cucumber) · Allure Reports

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Browser automation + API request context |
| [TypeScript](https://www.typescriptlang.org) | Strict type safety (`noImplicitAny: true`) |
| [Cucumber.js](https://cucumber.io) | BDD Gherkin feature files & step definitions |
| [@faker-js/faker](https://fakerjs.dev) | Dynamic test data generation |
| [Allure](https://allurereport.org) | Rich HTML reporting with screenshots & traces |

---

## Project Structure

```
qa-automation-framework/
├── .github/workflows/       # GitHub Actions CI pipeline
├── config/
│   └── environments.ts      # Base URLs, timeouts, env config
├── src/
│   ├── features/
│   │   ├── ui/              # UI Gherkin feature files
│   │   │   ├── home.feature         (UI-001, UI-002)
│   │   │   ├── auth.feature         (UI-003 → UI-007)
│   │   │   ├── products.feature     (UI-008 → UI-012)
│   │   │   ├── cart.feature         (UI-013, UI-014)
│   │   │   ├── contact.feature      (UI-015)
│   │   │   └── advanced.feature     (UI-016, UI-017)
│   │   └── api/             # API Gherkin feature files
│   │       ├── products-api.feature (API-001, 002, 005, 006)
│   │       ├── brands-api.feature   (API-003, API-004)
│   │       └── user-lifecycle-api.feature (API-007, API-008)
│   ├── steps/
│   │   ├── ui/              # UI step definition files
│   │   └── api/             # API step definition files
│   ├── pages/               # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── LoginPage.ts
│   │   ├── RegisterPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── ProductDetailPage.ts
│   │   ├── CartPage.ts
│   │   └── ContactPage.ts
│   ├── api/
│   │   ├── ApiClient.ts          # Base HTTP client (form-urlencoded)
│   │   ├── types/                # TypeScript interfaces for all payloads
│   │   └── endpoints/            # Per-resource API wrappers
│   ├── hooks/
│   │   └── hooks.ts              # Before/After + screenshot/trace capture
│   └── utils/
│       ├── world.ts              # Cucumber CustomWorld (browser + API contexts)
│       ├── dataGenerator.ts      # Faker-based dynamic data
│       └── logger.ts             # File + console logger
├── allure-results/          # Auto-generated raw Allure JSON
├── cucumber.js              # Cucumber runner configuration
├── tsconfig.json            # Strict TypeScript config
└── package.json             # Scripts and dependencies
```

---

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browser
npx playwright install chromium

# Run all regression tests
npm run test:regression

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run smoke suite
npm run test:smoke

# Generate and open Allure report
npm run report
```

---

## Tag Strategy

| Tag | Scope |
|-----|-------|
| `@ui` | All UI test scenarios |
| `@api` | All API test scenarios |
| `@smoke` | Critical paths: UI-005, UI-016, API-001, API-007 |
| `@regression` | Full test suite |

---

## Architectural Guardrails

- ✅ `noImplicitAny: true` — **no `any` types anywhere**
- ✅ Zero hardcoded `waitForTimeout` / `setTimeout` — all sync via `expect(locator).toBeVisible()`
- ✅ Locators use `getByRole`, `getByText`, `getByPlaceholder`, `data-qa` attributes
- ✅ All test data generated dynamically via `@faker-js/faker` + timestamps
- ✅ All API POST/PUT payloads sent as `application/x-www-form-urlencoded`
- ✅ Screenshots and trace zips auto-attached to Allure on failure

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://www.automationexercise.com` | Web UI base URL |
| `API_BASE_URL` | `https://www.automationexercise.com/api` | API base URL |
| `HEADLESS` | `true` | Run browsers headlessly |
| `DEFAULT_TIMEOUT` | `30000` | Global timeout in ms |
