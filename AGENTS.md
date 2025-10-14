### Tech stack
- **Preact + TypeScript + Vite**
- **Mantine UI**
- **marked** (Markdown rendering)

### Data and Utilities
- Dexie.js (IndexedDB) for local documentation/knowledge and (future) saved invoices
- html2canvas + jsPDF for PDF export
- Vercel Analytics for page views and custom events (`invoice_item_added`, `pdf_export`)

### Chrome built‑in AI (init + prompt)

**API Structure**: Uses `window.LanguageModel` (NOT `window.ai.languageModel`)

```ts
import { createChatSession, sendMessage, destroySession, checkAIAvailability } from '@/lib/chrome-ai';

// Check availability first
const isAvailable = await checkAIAvailability();
if (!isAvailable) {
  console.error('Chrome AI is not available');
  return;
}

// Create session
const session = await createChatSession({
  systemPrompt: 'You are a helpful assistant.'
});

// Send message
const reply = await sendMessage(session, 'Hello!');
console.log(reply);

// Cleanup
destroySession(session);
```


### Config (options)
- **systemPrompt**: string — initial system instruction.
- **temperature**: number — creativity; only used if you also set `topK`.
- **topK**: number — sampling; only used if you also set `temperature`.
- **expectedInputs**: array — specify input types and languages (e.g., `[{ type: 'text', languages: ['en'] }, { type: 'image' }]`).
- **expectedOutputs**: array — specify output types and languages (e.g., `[{ type: 'text', languages: ['en'] }]`).
- **Supported languages**: `en`, `es`, `ja`.

⚠️ **Important**: Always specify an output language in `expectedOutputs` to ensure optimal output quality and properly attest to output safety.

```ts
await createChatSession({
  systemPrompt: 'You are a helpful assistant.',
  temperature: 0.7,
  topK: 40
});

// The library automatically includes:
// expectedInputs: [{ type: 'text', languages: ['en'] }, { type: 'image' }]
// expectedOutputs: [{ type: 'text', languages: ['en'] }]
```

### Chrome Flags Required
Enable these Chrome flags:
- `chrome://flags/#prompt-api-for-gemini-nano` (set to Enabled)
- `chrome://flags/#prompt-api-for-gemini-nano-multimodal-input` (set to Enabled)
- `chrome://flags/#optimization-guide-on-device-model` (set to Enabled BypassPerfRequirement)

After enabling, restart Chrome and reload the page.

