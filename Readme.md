# BudgetShare

BudgetShare is a shared expense management application built with **React** for Web and **React Native** for Mobile.

The project uses a **Monorepo** structure so Web and Mobile applications can share common business logic, types, utilities, and API-related code.

## Project Structure

```text
budget-share/
│
├── apps/
│   ├── web/          # React Web application
│   └── mobile/       # React Native Mobile application
│
├── packages/
│   ├── shared/       # Shared types, logic and utilities
│   ├── api/          # API client / API logic
│   └── utils/        # Common utilities
│
├── .gitignore
├── package.json
└── README.md
```

## Applications

### Web

* React
* TypeScript
* Vite

### Mobile

* React Native
* TypeScript
* Expo

## Shared Code

The `packages` directory contains code that can be reused by both Web and Mobile applications.

Examples:

* Types
* Validation
* Business logic
* Utility functions
* API client

## Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd budget-share
```

Install dependencies:

```bash
npm install
```

Run Web:

```bash
npm run web
```

Run Mobile:

```bash
npm run mobile
```

## Environment Variables

Create environment files for the required applications.

```text
apps/web/.env
apps/mobile/.env
```

Do not commit `.env` files. Use `.env.example` files for required environment variables.

## Current Development

The current phase focuses on the **Frontend only**.

* Web UI
* Mobile UI
* Local state management
* Shared code between Web and Mobile
* Mock/local data

Backend API integration will be added in a future phase.

## Future Plans

* Backend API integration
* Authentication
* Database integration
* Expense management
* Group/shared expenses
* Expense settlement
* Notifications
* Production deployment
