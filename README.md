# Credit Union Test Automation Framework

End-to-end test automation built with **Playwright + TypeScript** for membership and loan application workflows in credit union software.

Built to handle real-world complexity such as **multi-step forms, file uploads, MFA flows, and dynamic UI validation**.

---

## About This Project

I built this framework to automate workflows that were difficult and time-consuming to validate through manual testing.

It demonstrates:

- **Page Object Model (POM)** architecture for maintainable test code
- **Multi-step workflow automation** (stateful flows, file uploads, MFA)
- **Config-driven testing** to separate test logic from test data
- **TypeScript** for type-safe, self-documenting test code

### Current Status

- ✅ Complete end-to-end flows for membership and loan applications
- ✅ Admin verification workflows
- 🚧 Actively refactoring to support additional credit union clients and banks

---

## Tech Stack

- **Playwright** – Browser automation
- **TypeScript** – Type-safe test code
- **Page Object Model** – Separation of test logic and UI interaction

---

## Project Structure

```text
tests/
├── demoCreditUnion/        # Client-specific test specs
├── pages/                 # Page Object Models
├── config/                # Client configuration
├── shared/                # Reusable helpers
├── assets/                # Test data (ID images, etc.)
└── playwright.config.ts
```

### Why this structure?

- Tests describe **user workflows**, not CSS selectors
- UI changes only require updating **page objects**
- Client variations live in **config**, not scattered through test code

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file using the example:

````bash
cp .env.example .env


### Running Tests

```bash
npm run test         # headless
npm run test:headed  # visible browser
npm run test:ui      # Playwright UI mode
npm run report       # view results
````

---

## What’s Automated

### Membership Application

- Access code entry and validation
- Multi-page form completion
- ID upload and license decoder validation
- Multi-factor authentication
- Application review and submission

### Loan Application

- Loan type and calculator flows
- Applicant information collection
- Employment and reference verification
- Due diligence questions
- Application review and e-signature

### Admin Verification

- Application search and status validation
- Decision processing workflows
- Funding setup and completion

---

## Key Features

### Config-Driven Testing

Client-specific data (access codes, expected headings, form values) lives in configuration files. Tests stay clean and readable.

### Reusable Page Objects

UI interactions are centralized. When selectors change, you update one file, not fifty tests.

### Dynamic UI Handling

Robust element selection strategies handle conditional fields, async loading, and client variations.

### No Local Dependencies

File upload tests use checked-in dummy images. Clone and run — no setup hassles.

---

## Lessons Learned

- **Config vs. Code:** When to pull data into config vs. keep it in tests
- **Selector Strategy:** When `getByRole` is more resilient than raw locators
- **Async Complexity:** Multi-step financial workflows have timing challenges that simple waits don’t solve
- **Abstraction Tradeoffs:** Balancing DRY principles with readable, debuggable test code

---

## About

I’m a QA professional who taught myself test automation to solve problems manual testing couldn’t scale to address. This framework represents real automation work — including architectural decisions, refactoring challenges, and tradeoffs between flexibility and simplicity.

This isn’t a portfolio project copied from a tutorial. It’s automation I built, maintain, and continue improving.

**For hiring managers:** The page object implementations and overall test structure demonstrate how I think about building maintainable, production-ready automation. I’m happy to discuss any design decisions.
