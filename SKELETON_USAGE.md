# Skeleton Loading Animation Usage

## Overview
The invoice components now support skeleton loading animations that display animated shimmer placeholders instead of empty fields or placeholder text while content is being generated.

## How to Use

### Basic Usage

Pass the `isGenerating` prop to `InvoiceTemplate`:

```tsx
import { InvoiceTemplate } from '@/components/InvoiceTemplate';

function MyComponent() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  return (
    <InvoiceTemplate
      invoice={invoice}
      layout="minimalist"
      onUpdate={handleUpdate}
      isGenerating={isGenerating}  // 👈 Pass loading state
    />
  );
}
```

### With AI Generation

When using Chrome AI to generate invoice content:

```tsx
const generateInvoice = async () => {
  setIsGenerating(true);
  
  try {
    // Your AI generation logic
    const result = await sendMessage(session, prompt);
    updateInvoice(invoice.id, result);
  } finally {
    setIsGenerating(false);
  }
};
```

### Manual Control

You can also manually trigger skeleton state:

```tsx
// Show skeleton when invoice is empty
const isEmpty = !invoice.businessName && !invoice.clientName && invoice.items.length === 0;

<InvoiceTemplate
  invoice={invoice}
  layout="centered"
  isGenerating={isEmpty}
/>
```

## What Gets Animated

When `isGenerating={true}`:

- ✅ **Business Info** - Name, email, phone, address show shimmer lines
- ✅ **Client Info** - Name, email, phone, address show shimmer lines
- ✅ **Invoice Items** - Table shows 3 skeleton rows with animated placeholders
- ✅ **Payment Details** - Bank info and instructions show shimmer lines

## Customization

Each component accepts a `skeletonRows` prop for the items table:

```tsx
<InvoiceItemsTable
  items={invoice.items}
  isLoading={isGenerating}
  skeletonRows={5}  // Show 5 skeleton rows instead of default 3
/>
```

## Animation Details

- **Animation**: Smooth shimmer effect (1.5s loop)
- **Colors**: Light gray gradient (#f0f0f0 to #e0e0e0)
- **Width Variation**: Different widths for natural appearance
- **No Placeholders**: No text placeholders visible during loading

## All Layouts Supported

The skeleton loading works across all layouts:
- ✅ Minimalist
- ✅ Left Header
- ✅ Centered
- ✅ Compact Grid

Each maintains its unique styling while showing the loading state.

