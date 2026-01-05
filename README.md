# VERTARA.ID - Adventure OS & Invoice Generator

![Vertara Banner](https://img.shields.io/badge/VERTARA.ID-Adventure%20OS-059669?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=react)

**Vertara.id (Adventure OS)** is a premium, specialized dashboard designed for Open Trip Operators and Adventure Travel Agencies. It unifies invoice generation, trip manifest management, and financial tracking into a single, cohesive "Operating System" for adventure tourism.

Built with a focus on **aesthetics**, **speed**, and **reliability**, it allows operators to generate stunning, branded invoices in seconds while keeping track of the bottom line.

---

## 🚀 Key Features

### 📊 **Smart Dashboard & Analytics**
- **Real-time Financials**: Instant view of Gross Revenue, Total Expenses, and Net Profit.
- **Trip Metrics**: Visual indicators for trip profitability and participant counts.
- **Responsive Charts**: (Planned) visual representations of monthly performance.

### 📝 **Advanced Invoice Management**
- **CRUD Operations**: Create, Read, Update, and Delete client invoices with ease.
- **Status Tracking**: Visual indicators for `UNPAID`, `DP` (Down Payment), and `PAID`.
- **Bulk Import**: Rapidly import participant data from Excel/Spreadsheets using a smart Copy-Paste TSV importer.

### 🖨️ **Professional Export Engine**
- **A4 Standard PDF**: Generates pixel-perfect A4 (794x1123px) invoices ready for print or digital distribution.
- **High-Res PNG**: Export invoices as high-quality images for WhatsApp sharing.
- **No Cropping**: Optimized canvas rendering ensures 100% data visibility.

### 🏔️ **Trip Manifest System**
- **Group Management**: Automatically groups participants by `Trip Date` and `Destination`.
- **Capacity Planning**: Quickly see how many pax are joining a specific expedition.
- **Printable Manifests**: (Coming Soon) One-click export of trip participant lists for field guides.

### 💰 **Expense Ledger**
- **Operational Cost Tracking**: Record every expense from Logistics to Guide Fees.
- **Category Management**: Organize costs by type (Transport, Permit, Food, etc.).
- **Net Profit Calculation**: Automatically deducts expenses from invoice revenue.

### 🎨 **Brand Center**
- **Custom Branding**: Upload your logo and set contact details (WhatsApp, Instagram, Email).
- **Themes**: Built-in support for Light and Dark modes with a premium glassmorphism aesthetic.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Blazing fast UI rendering and build tooling. |
| **Language** | TypeScript | Type-safe code for reliability and maintainability. |
| **Styling** | Tailwind CSS | Utility-first CSS for bespoke, responsive designs. |
| **Icons** | Lucide React | Clean, consistent, and lightweight icons. |
| **Database** | Supabase | PostgreSQL-based backend for real-time data persistence. |
| **Export** | html2canvas + jsPDF | Robust engine for DOM-to-Image and PDF conversion. |

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A user account on [Supabase](https://supabase.com)

### 1. Clone the Repository
```bash
git clone https://github.com/anothersunrisee/vertara.id.git
cd vertara-invoice-generator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
```

### 4. Run Development Server
```bash
npm run dev
```
The app will launch at `http://localhost:3000`.

---

## 🗄️ Database Schema (Supabase)

The application relies on three core tables in your Supabase project (public schema):

### 1. `invoices`
Stores participant bookings and revenue data.
- `id` (uuid, pk)
- `invoiceNo` (text)
- `namaLengkap` (text)
- `gunung` (text) - *Destination*
- `total` (numeric)
- `status` (text) - *'PAID', 'DP', 'UNPAID'*
- *(...and other participant details)*

### 2. `expenses`
Stores operational costs.
- `id` (uuid, pk)
- `item` (text)
- `amount` (numeric)
- `category` (text)
- `date` (date)

### 3. `settings`
Stores singleton app configuration.
- `id` (text, pk)
- `logo` (text) - *Base64 or URL*
- `bankName`, `accountNo`, `accountName` (text)
- `footerNote` (text)

---

## 📦 Deployment

This project is optimized for deployment on platforms like **Vercel**, **Netlify**, or **Cloudflare Pages**.

1. **Build for Production**:
   ```bash
   npm run build
   ```
2. **Preview Build**:
   ```bash
   npm run preview
   ```
3. **Deploy**:
   Connect your GitHub repository to Vercel/Netlify. Ensure the **Build Command** is `npm run build` and **Output Directory** is `dist`. Don't forget to add your Environment Variables in the deployment dashboard.

---

## 🤝 Contributing

This is a private project for Vertara.id. However, suggestions and improvements are welcome from the internal team.

1. Create a feature branch (`git checkout -b feature/AmazingFeature`).
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3. Push to the branch (`git push origin feature/AmazingFeature`).
4. Open a Pull Request.

---

## 📄 License

**Proprietary Software**. Copyright © 2026 Vertara.id.
All rights reserved. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

---
