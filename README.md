# Invoicees - AI-Powered Invoice Generator

A fully AI-driven invoice generation app powered by **Google Chrome's built-in Nano AI**. Create professional invoices through natural conversation.

## Features

- 🤖 **AI-Powered**: Natural language invoice creation using Chrome's local AI
- 💬 **Conversational Interface**: Floating chat window for easy interaction
- 📄 **Multiple Layouts**: Choose from 4 professional invoice templates
  - Minimalist
  - Left Header
  - Centered
  - Compact Grid
- 🎨 **Modern Design**: Flat, pastel colors with clean aesthetics
- 📥 **PDF Export**: Download invoices as professional PDFs
- 💾 **Local Storage**: All data stored locally using IndexedDB
- 🚀 **No Backend Required**: Runs entirely in the browser

## Requirements

- **Google Chrome** (latest version)
- **Chrome's Built-in AI** must be enabled

## Tech Stack

- **Preact** + TypeScript + Vite
- **Mantine UI** for components
- **Dexie.js** for IndexedDB storage
- **html2canvas + jsPDF** for PDF export
- **Chrome Built-in AI** (Nano)
- **Vercel Analytics** for tracking

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

### Basic Commands

Start chatting with the AI to build your invoice:

**Business Information:**
- "My business name is Acme Corp"
- "My email is info@acme.com"
- "My phone is 555-0123"

**Client Information:**
- "Client name is John Smith"
- "Bill to john@example.com"
- "Client address: 123 Main St, New York, NY"

**Adding Items:**
- "Add web design service for $2500"
- "Add 10 hours of consulting at $150 per hour"
- "Add product: Widget x5 at $25 each"

**Bank Details:**
- "Bank name: Wells Fargo"
- "Account number: 12345678"
- "Account type: Checking"

**Layout Changes:**
- "Switch to minimalist layout"
- "Change to left header template"

**Export:**
- "Export to PDF"
- "Download invoice"

## Project Structure

```
invoicegenius3/
├── src/
│   ├── components/
│   │   ├── layouts/          # Invoice templates
│   │   ├── FloatingChat.tsx  # Chat interface
│   │   ├── Toolbar.tsx       # Top toolbar
│   │   └── ...
│   ├── lib/
│   │   ├── chrome-ai.ts      # Chrome AI integration
│   │   ├── ai-agent.ts       # AI agent logic
│   │   ├── db.ts             # IndexedDB storage
│   │   └── pdf-export.ts     # PDF generation
│   ├── hooks/
│   │   └── useInvoice.ts     # Invoice state management
│   ├── types/
│   │   └── invoice.ts        # TypeScript types
│   ├── App.tsx               # Main app component
│   └── main.tsx              # Entry point
├── AGENTS.md                 # AI behavior guide
└── package.json
```

## AI Behavior

The AI agent follows strict rules defined in `AGENTS.md`:

- Only accepts invoice-related topics
- Rejects unrelated or inappropriate requests
- Outputs structured JSON responses
- Maintains conversational tone
- Validates and parses user input

## Design Philosophy

- **Flat Design**: No rounded corners, shadows, or gradients
- **Pastel Colors**: Soft, modern color palette
- **Minimal UI**: Clean and distraction-free
- **Responsive**: Works on various screen sizes

## License

MIT

## Support

For issues related to Chrome's Built-in AI, visit:
https://developer.chrome.com/docs/ai/built-in

