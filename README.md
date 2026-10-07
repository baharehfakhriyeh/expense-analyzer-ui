# Expense Analyzer UI

A standalone browser application for viewing and managing expenses through the REST API provided by the **Expense Analyzer** Java/Spring Boot project. This UI has its own dependencies, configuration, documentation, and Git repository.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- The Expense Analyzer API running and reachable from this machine

## Run locally

From this project directory:

```shell
npm install
npm run dev
```

Open the address printed by Vite. The default UI address is `http://127.0.0.1:5173`.

## Configuration

Copy `.env.example` to `.env` and adjust these values as needed:

| Variable | Purpose | Default |
|---|---|---|
| `UI_HOST` | Address Vite binds to | `127.0.0.1` |
| `UI_PORT` | Vite development server port | `5173` |
| `API_HOST` | Hostname or IP address of the Expense Analyzer API | `localhost` |
| `API_PORT` | Port of the Expense Analyzer API | `8087` |

Vite proxies `/api` requests to the configured API address. The API documentation link also uses that address. Do not commit `.env`; `.env.example` contains safe defaults.

## Features

- Paginated expense list with date, category, payer, and amount sorting controls
- Create, edit, and delete expense records
- Currency selection limited to AMD, USD, EUR, and IRR
- Payer selection for User1 (ID 1) and User2 (ID 2)
- Date inputs that support calendar selection and typing
- Category counts and per-currency totals for the current page

The category and payer options are currently client-side choices. The API remains the source of truth for validation and persistence.

## API contract

The UI uses the Expense Analyzer API's `/api/v1/expenses` endpoints for listing and filtering, creating, replacing, and deleting expense records. It expects the Spring Data page response and the documented `ExpenseResponse` fields. Start the Expense Analyzer API before using the UI; its Swagger UI is available at `http://localhost:8087/swagger-ui.html` with the default API settings.

## Production build

```shell
npm run build
npm run preview
```

The development proxy is a Vite dev-server feature. A production deployment must configure its web server or gateway to route `/api` requests to the API, or provide an equivalent same-origin API arrangement.
## Source structure

    src/
    ├── app/                 Application entry, page composition, and shared layouts
    ├── features/
    │   ├── dashboard/       Dashboard-specific presentation and metrics
    │   └── expenses/        Expense API, state, components, types, options, and formatters
    ├── shared/              Cross-feature API helpers, runtime config, and feedback components
    └── styles/              Global Tailwind and application styles

Add future domains as feature folders under src/features/, for example src/features/categories/ with its own api/, components/, hooks/, types/, and utils/ folders. Keep domain-specific code inside its feature; put code in src/shared/ only when multiple features reuse it. Keep page-level composition in src/app/pages/ and application-wide layout in src/app/layouts/.