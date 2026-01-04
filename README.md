# VERTARA.ID - Invoice Generator & Trip Management

**Vertara.id** is a specialized invoice generation and trip management dashboard designed for open trip operators. It streamlines the process of creating manifests, tracking expenses, and generating professional PDF invoices for clients.

## Features

- **Dashboard Analytics**: Real-time overview of trip revenue, expenses, and net profit.
- **Invoice Management**: CRUD operations for client invoices with status tracking (Unpaid, DP, Paid).
- **PDF Generation**: One-click export of professional invoices using `jspdf` and `html2canvas`.
- **Expense Ledger**: Track operational costs (Logistics, Transport, Guide Fees, etc.).
- **Bulk Import**: Import participant data directly from spreadsheets via TSV (Tab Separated Values) copy-paste.
- **Trip Manifests**: Group participants by trip date and destination.
- **Supabase Integration**: Cloud persistence for all data with real-time capabilities.
- **Dark Mode**: Fully responsive UI with automated dark mode support.

## Tech Stack

- **Frontend**: React (Vite), TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Database**: Supabase (PostgreSQL)
- **Utilities**: `jspdf` (PDF), `html2canvas` (Canvas), `xlsx` (planned)

## Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or Yarn
- Supabase Project

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/anothersunrisee/vertara.id.git
    cd vertara-invoice-generator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_KEY=your_supabase_anon_key
    ```

4.  Run the Development Server:
    ```bash
    npm run dev
    ```

## Database Schema

The application requires the following tables in Supabase:

-   `invoices` (UUID id)
-   `expenses` (UUID id)
-   `settings` (Text id)

*Refer to `supabase_schema.sql` (if available) for the full DDL.*

## Deployment

Build the application for production:

```bash
npm run build
```

The output will be in the `dist` directory, ready to be deployed to Vercel, Netlify, or similar static hosts.

## License

Private / Proprietary Software.
Copyright © 2026 Vertara.id. All rights reserved.
