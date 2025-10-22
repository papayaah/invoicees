# Invoicees - DevPost Submission

## Elevator Pitch
**Invoicees** is an AI-powered invoice generator that runs entirely in your browser using Chrome's built-in Gemini Nano. No servers, no sign-ups, no data ever leaving your device—just type what you need, and get a beautifully formatted, professional invoice in seconds. Perfect for freelancers and small businesses who want invoicing to be fast, private, and delightful.

---

## Inspiration

As a freelance developer, I've always found invoicing to be one of the most tedious parts of running a business. Existing tools either required subscriptions, were overly complicated, or worse—sent my client data to third-party servers. I wanted something simple: type what I need, get a beautiful invoice, done.

When Chrome announced built-in AI with Gemini Nano, I saw an opportunity to build something truly different—an invoice generator that's **completely private** (everything happens locally in your browser), **instant** (powered by on-device AI), and **delightful** to use. No servers, no logins, no compromises on privacy.

Invoicees was born from the belief that small tools can make a big difference in people's daily workflows.

---

## What it does

**Invoicees** transforms natural language into professional invoices using Chrome's built-in AI (Gemini Nano). Here's how it works:

1. **Chat with AI**: Type your invoice details conversationally—"Invoice for Acme Corp, $2,500 for website development, due in 30 days"
2. **Instant Generation**: The AI extracts business details, client info, line items, payment terms, and notes from your message
3. **Beautiful Layouts**: Choose from 4 professionally designed layouts (Minimalist, Left Header, Centered, Compact Grid)
4. **Live Editing**: All fields are editable inline—click to modify anything
5. **Export to PDF**: Print-optimized exports that fit perfectly on A4 pages
6. **100% Private**: Everything runs locally in your browser—no data ever leaves your device

**Key Features**:
- Multiple invoice layouts to match your brand
- Smart AI extraction of business info, client details, line items, payment methods, and notes
- Editable fields for fine-tuning after generation
- Local storage for saved invoices
- PDF export with custom scaling for compact, professional output
- Completely offline-capable (after initial load)

---

## How we built it

**Tech Stack**:
- **Frontend**: Preact + TypeScript + Vite for a fast, lightweight bundle
- **UI**: Mantine UI components with custom layouts
- **AI**: Chrome's built-in Prompt API (Gemini Nano) via the experimental window.ai.languageModel API
- **Storage**: Dexie.js (IndexedDB wrapper) for local invoice persistence
- **PDF Export**: Custom print-to-PDF solution using DOM cloning and inline styles
- **Analytics**: Vercel Analytics for usage insights

**Architecture**:
1. **AI Agent** (`ai-agent.ts`): Handles chat session management, prompt engineering, and structured data extraction from natural language
2. **Invoice Components**: Modular, reusable components (BusinessInfo, ClientInfo, PaymentDetails, InvoiceItemsTable, Notes) that adapt to different layouts
3. **Layout System**: Four distinct invoice layouts, each with customizable styling while sharing the same component logic
4. **PDF Engine**: Custom solution that clones rendered DOM, inlines computed styles, replaces inputs with static text, and uses native browser printing with dynamic scaling for optimal page fit

**Key Implementation Details**:
- Prompt engineering to reliably extract structured invoice data (business details, line items, payment info) from conversational text
- Skeleton loading animations for better UX during AI processing
- Conditional rendering to only show sections with actual content
- Auto-scaling PDF exports based on item count to ensure single-page layouts
- Local-first architecture with no backend dependencies

---

## Challenges we ran into

1. **Prompt Engineering**: Getting Gemini Nano to consistently return structured JSON from natural language was tricky. I had to iterate on the system prompt many times to handle edge cases like:
   - Arrays being returned as `"items": 1` instead of an array
   - Payment details scattered across different fields
   - Business/client names being returned as "Undefined"
   - Nested objects in payment methods causing `[object Object]` displays

2. **PDF Export**: Initially tried `html2canvas` + `jspdf`, then `react-pdf/renderer`, but both had issues (cut-off content, dependency conflicts). I ended up building a custom solution that clones the actual rendered DOM, inlines all computed styles, and uses native browser printing. Getting content to fit on one page while maintaining readability required dynamic scaling logic.

3. **Chrome AI API Instability**: The Prompt API is still experimental, so I had to implement robust error handling, session recreation logic, and fallback UI for when AI isn't available. Also had to guide users to enable the right Chrome flags.

4. **Type Safety**: TypeScript errors with optional fields (like `invoice.id` being possibly `undefined`) required careful null-checking and proper type guards throughout the codebase.

5. **Responsive Layouts**: Designing 4 distinct invoice layouts that look professional, scale properly for PDF export, and work with the same underlying components took multiple iterations.

---

## Accomplishments that we're proud of

1. **100% Private AI**: Built a fully functional AI-powered app that never sends user data to a server. Everything runs locally in the browser using Chrome's built-in AI.

2. **Beautiful UX**: Created 4 professional invoice layouts with smooth skeleton loading, inline editing, and delightful interactions. The app feels polished and production-ready.

3. **Custom PDF Solution**: When existing libraries failed, I built a custom print-to-PDF engine that perfectly preserves layout, handles multi-page invoices, and auto-scales for compact output.

4. **Smart AI Extraction**: The AI reliably extracts business info, client details, line items with quantities and prices, payment methods, due dates, and notes from natural conversational text.

5. **Zero Dependencies on Backend**: No servers, no databases, no auth—just a static site that works offline. This makes it incredibly fast, private, and cost-effective to run.

6. **Production-Ready**: Full TypeScript safety, comprehensive error handling, local storage persistence, and analytics tracking make this a real tool people can use today.

---

## What we learned

1. **On-Device AI is Powerful**: Chrome's built-in Gemini Nano is surprisingly capable for structured data extraction. With good prompt engineering, you can build entire features without server-side AI.

2. **Prompt Engineering is an Art**: Getting reliable structured output from an LLM requires careful prompt design, examples, explicit constraints, and lots of iteration. Small wording changes can dramatically affect output quality.

3. **Privacy is a Feature**: Building a local-first app isn't just about privacy—it's also faster (no network calls), works offline, and gives users complete control over their data.

4. **Sometimes Custom is Better**: While libraries are great, sometimes building a custom solution (like our PDF export) gives better results and more control.

5. **Incremental Development**: Starting with a simple MVP (basic invoice generation) and iterating based on real usage helped me prioritize features that actually matter.

6. **Small Apps, Big Heart**: You don't need to build a massive SaaS platform to solve real problems. A well-crafted small tool can make a meaningful difference in someone's workflow.

---

## What's next for Invoicees

1. **Multi-Currency Support**: Add currency selection and proper formatting for international invoicing

2. **Template Customization**: Let users customize colors, fonts, and logos for each layout to match their brand

3. **Recurring Invoices**: Support for generating recurring invoices with saved templates and auto-incrementing invoice numbers

4. **Email Integration**: Direct email sending (via mailto: or Web Share API) with PDF attachments

5. **Import/Export**: Bulk invoice management—import from CSV, export to Excel/JSON for accounting software

6. **More Layouts**: Additional professional templates (e.g., modern gradient, classic serif, creative designs)

7. **AI Improvements**: 
   - Support for multi-language invoices
   - Auto-fill from previous invoices (learn client details)
   - Smart suggestions for payment terms and late fees

8. **Offline PWA**: Full Progressive Web App support with service workers for complete offline functionality

9. **Chrome Extension**: Quick invoice generation from any page with context-aware AI (e.g., generate invoice from email thread)

10. **Open Source Growth**: Build a community around the project, accept contributions, and make it the go-to private invoice generator for freelancers worldwide

---

**Built with ❤️ at [Stro Studio](https://strostudio.com) — Small apps, big heart.**

