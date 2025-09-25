# OrangeHRM Playwright & API Automation Project

## Overview

This project demonstrates advanced end-to-end (E2E) and API automation for the OrangeHRM demo application using Playwright (TypeScript) and modern best practices. It includes UI tests, API service classes, and a robust project structure suitable for enterprise-level QA automation.

## Key Features

- **Playwright E2E Tests:**
  - Modular page object model (POM) for maintainable UI tests (`e2e/pages/`)
  - Comprehensive test coverage for login, admin, and dashboard modules (`e2e/tests/`)
  - Usage of Playwright fixtures, selectors, and assertions
- **API Automation:**
  - Service classes for API endpoints (e.g., `UserApi.ts`)
  - API test specs for user search by status and role (`api/tests/userApi.spec.ts`)
- **TypeScript:**
  - Full type safety and modern ESNext features
- **Test Data Generation:**
  - Uses `@faker-js/faker` for dynamic, realistic test data
- **Code Quality:**
  - ESLint and Prettier for consistent code style
  - Scripts for linting and formatting in `package.json`
- **Reporting:**
  - Playwright's built-in HTML and trace reports
- **CI/CD Ready:**
  - Project structure and scripts are compatible with CI pipelines

## Upcoming Key Features

- **Playwright E2E Tests:**
  - Increased coverage for additional OrangeHRM modules
- **API Automation:**
  - Increased API endpoint coverage including Schema validation
- **Reporting:**
  - Enhanced reporting features using QA-Shadow-Report for one centralized report google sheet

## Project Structure

```
├── api/
│   ├── services/         # API service classes (e.g., UserApi.ts)
│   └── tests/            # API test specs
├── e2e/
│   ├── pages/            # Playwright page objects (Login, Admin, Dashboard)
│   └── tests/            # Playwright UI test specs
├── cypress/              # (Legacy) Cypress tests for reference
├── .eslintrc.json        # ESLint config
├── .prettierrc           # Prettier config
├── playwright.config.ts  # Playwright config (baseURL, etc.)
├── package.json          # Scripts and dependencies
└── README.md             # Project documentation
```

## How to Run

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run all Playwright tests:**
   ```sh
   npx playwright test
   ```
3. **Run only API tests:**
   ```sh
   npx playwright test api/tests/
   ```
4. **Run only E2E UI tests:**
   ```sh
   npx playwright test e2e/tests/
   ```
5. **Lint and format code:**
   ```sh
   npm run lint
   npm run format
   ```

## Code Contribution Guide

- All contributions are welcome! Please fork the repository and create a pull request with your changes.
- Ensure your code adheres to the project's coding standards and includes appropriate tests.
- Provide a clear description of your changes in your commit messages.
- Ensure all your changes are pushed from your issue branch before creating a pull request.

## Setup and Execution Video Link

- [Setup and Execution Video](Will be added soon)

## Notable Technologies

- [Playwright](https://playwright.dev/) (TypeScript)
- [@faker-js/faker](https://github.com/faker-js/faker) (test data)
- ESLint, Prettier (code quality)

## Why This Project Stands Out

- **Enterprise-Ready:** Clean separation of UI and API automation, scalable structure, and CI/CD compatibility.
- **Modern Practices:** Uses Playwright's latest features, TypeScript, and dynamic test data.
- **Maintainability:** Modular page objects and service classes for easy test expansion.

## Author

- Automation Engineer: Chinedu Anyika (code-pace)

---
