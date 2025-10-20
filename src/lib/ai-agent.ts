import { AIResponse, InvoiceData } from '@/types/invoice';
import { sendMessage } from './chrome-ai';
import { searchDocumentation } from './db';

/**
 * System prompt for the invoice AI agent
 */
export const INVOICE_SYSTEM_PROMPT = `You are an AI invoice assistant.
Your job is to extract and structure invoicing information from natural language.

When the user provides details, identify only what is explicitly stated and return it in this exact JSON format:

{
  "message": "short summary of what was understood or done",
  "invoiceUpdate": {
    "businessName": "company name if mentioned",
    "clientName": "client name if mentioned",
    "items": [{"description": "item", "unitPrice": number, "quantity": 1}],
    "paymentInstructions": "all payment details in one field (bank info, due dates, payment methods, etc.)",
    "notes": "any extra details that don't fit standard fields"
  }
}

CRITICAL RULES:
- ALWAYS use the exact field names: "businessName", "clientName", "items", "paymentInstructions", "notes"
- NEVER use "business", "client", "total" - these are wrong field names
- "items" must ALWAYS be an array of objects, never a number
- Only include fields that the user mentioned or changed
- Never invent names, prices, or quantities
- Place all unrecognized or unrelated information in "notes"
- Keep responses conversational but concise — you're part of a chat experience
- If the user's message isn't about an invoice, politely redirect them back to invoice-related tasks`;

/**
 * Parse AI response and extract JSON
 */
export function parseAIResponse(rawResponse: string): AIResponse {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 parseAIResponse CALLED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Raw response length:', rawResponse.length);
    console.log('Raw response preview:', rawResponse.substring(0, 200));
    
    // Try to extract JSON from code blocks or plain text
    const jsonMatch = rawResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                     rawResponse.match(/(\{[\s\S]*\})/);
    
    if (jsonMatch) {
      console.log('✅ Found JSON in response');
      const parsed = JSON.parse(jsonMatch[1]);
      
      console.log('📊 Parsed object has message?', !!parsed.message);
      console.log('📊 Parsed object has invoiceUpdate?', !!parsed.invoiceUpdate);
      if (parsed.invoiceUpdate) {
        console.log('📊 invoiceUpdate keys:', Object.keys(parsed.invoiceUpdate));
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 FULL PARSED RESULT:');
      console.log(JSON.stringify(parsed, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // If it's valid JSON, return it even if structure is weird - mergeInvoiceUpdate will handle it
      return {
        message: parsed.message || 'Invoice updated',
        invoiceUpdate: parsed.invoiceUpdate || parsed, // Use the whole object if no invoiceUpdate wrapper
      };
    } else {
      console.error('❌ No JSON found in AI response - trying to extract from text');
    }
    
    console.warn('⚠️ JSON parsing failed - using raw text as message');
    
    // Fallback: treat entire response as message
    return {
      message: rawResponse,
    };
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error);
    console.log('Error details:', error);
    return {
      message: rawResponse,
    };
  }
}

/**
 * Check if user query is invoice-related
 */
export function isInvoiceRelated(query: string): boolean {
  const invoiceKeywords = [
    'invoice', 'bill', 'client', 'customer', 'business', 'company',
    'item', 'product', 'service', 'price', 'cost', 'amount',
    'bank', 'account', 'payment', 'address', 'email', 'phone',
    'add', 'set', 'change', 'update', 'create', 'export', 'pdf',
    'layout', 'template', 'help', 'how', 'what', 'my', 'name',
  ];
  
  const lowerQuery = query.toLowerCase();
  return invoiceKeywords.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Process user message with AI agent
 */
export async function processUserMessage(
  session: any,
  userMessage: string,
  currentInvoice: InvoiceData
): Promise<AIResponse> {
  console.log('🎯 Processing user message:', userMessage);
  
  // Check if query is invoice-related
  if (!isInvoiceRelated(userMessage)) {
    console.log('⚠️ Query not invoice-related, checking documentation');
    // Try to find documentation
    const docs = await searchDocumentation(userMessage);
    
    if (docs.length > 0) {
      return {
        message: `Here's what I found in the documentation:\n\n${docs[0].content}`,
      };
    }
    
    return {
      message: 'This app is focused on invoice generation. Please refer to the documentation for available commands.',
    };
  }

  // Build context about current invoice
  const context = `Current invoice state:
- Business: ${currentInvoice.businessName || 'Not set'}
- Client: ${currentInvoice.clientName || 'Not set'}
- Items: ${currentInvoice.items.length} item(s)
- Total: $${calculateTotal(currentInvoice.items).toFixed(2)}

User request: ${userMessage}

Respond in JSON: {"message": "text", "invoiceUpdate": {...}}`;

  try {
    const response = await sendMessage(session, context);
    const parsed = parseAIResponse(response);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ FINAL PARSED RESULT:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Message:', parsed.message);
    console.log('Invoice Update:', JSON.stringify(parsed.invoiceUpdate, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return parsed;
  } catch (error) {
    throw new Error('AI model not available — this feature requires active local AI processing.');
  }
}

/**
 * Calculate invoice total
 */
export function calculateTotal(items: Array<{ unitPrice?: number; quantity?: number }>): number {
  return items.reduce((sum, item) => {
    const unitPrice = item.unitPrice || 0;
    const quantity = item.quantity || 0;
    return sum + (unitPrice * quantity);
  }, 0);
}

/**
 * Format currency with commas and 2 decimal places
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Merge invoice updates into current invoice
 */
export function mergeInvoiceUpdate(
  current: InvoiceData,
  update: Partial<InvoiceData> | any
): InvoiceData {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 mergeInvoiceUpdate CALLED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const merged = { ...current };

  // Log what AI returned
  console.log('🔄 Raw update received:', JSON.stringify(update, null, 2));
  console.log('Keys in update:', Object.keys(update));
  console.log('Update is empty?', Object.keys(update).length === 0);
  
  // Safety check: if update is empty or undefined, bail out early
  if (!update || Object.keys(update).length === 0) {
    console.error('❌ Update object is empty or undefined - nothing to merge');
    return merged;
  }
  
  // Check for common mistakes and auto-correct them
  if (update.business && !update.businessName) {
    console.warn('⚠️ AI used "business" instead of "businessName" - auto-correcting');
    update.businessName = update.business;
  }
  if (update.client && !update.clientName) {
    console.warn('⚠️ AI used "client" instead of "clientName" - auto-correcting');
    update.clientName = update.client;
  }
  
  // Filter out "Undefined" values
  if (update.businessName === 'Undefined' || update.businessName === 'undefined') {
    console.warn('⚠️ AI returned "Undefined" for businessName - ignoring');
    delete update.businessName;
  }
  
  if (update.clientName === 'Undefined' || update.clientName === 'undefined') {
    console.warn('⚠️ AI returned "Undefined" for clientName - ignoring');
    delete update.clientName;
  }
  
  // Handle items field - AI sometimes returns number instead of array
  if (typeof update.items === 'number') {
    console.warn('⚠️ AI returned items as number instead of array - trying to extract from invoiceDetails');
    
    // Try to extract items from invoiceDetails if it exists
    if (update.invoiceDetails && update.invoiceDetails.description) {
      const description = update.invoiceDetails.description;
      console.log('🔍 Extracting item from invoiceDetails.description:', description);
      
      // Create a single item from the description
      update.items = [{
        description: description,
        quantity: 1,
        price: update.total || 0
      }];
      
      console.log('✅ Created item from invoiceDetails.description:', update.items);
    } else if (update.description) {
      // Try to extract from root level description field
      const description = update.description;
      console.log('🔍 Extracting item from root description:', description);
      
      // Create a single item from the description
      update.items = [{
        description: description,
        quantity: 1,
        price: update.total || 0
      }];
      
      console.log('✅ Created item from root description:', update.items);
    } else {
      console.warn('⚠️ No description found in invoiceDetails or root level, ignoring items');
      delete update.items;
    }
  }
  
  // Handle total field - we calculate this ourselves
  if (update.total !== undefined) {
    console.warn('⚠️ AI returned total field - ignoring (we calculate this)');
    delete update.total;
  }
  
  // Handle nested payment instructions in invoiceDetails
  if (update.invoiceDetails && update.invoiceDetails.paymentInstructions && !update.paymentInstructions) {
    const paymentInfo = update.invoiceDetails.paymentInstructions;
    console.log('🔍 Extracting payment instructions from invoiceDetails:', paymentInfo);
    
    // Convert object to readable string
    if (typeof paymentInfo === 'object') {
      const paymentFields: string[] = [];
      Object.entries(paymentInfo).forEach(([key, value]) => {
        if (value) {
          const formattedKey = key.replace(/[_-]/g, ' ').replace(/([A-Z])/g, ' $1').trim();
          const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
          paymentFields.push(`${capitalizedKey}: ${value}`);
        }
      });
      update.paymentInstructions = paymentFields.join('\n');
    } else {
      update.paymentInstructions = String(paymentInfo);
    }
    
    console.log('✅ Created payment instructions:', update.paymentInstructions);
  }
  
  // Handle paymentInfo field (AI sometimes uses this instead of paymentInstructions)
  if (update.paymentInfo && !update.paymentInstructions) {
    const paymentInfo = update.paymentInfo;
    console.log('🔍 Extracting payment instructions from paymentInfo:', paymentInfo);
    
    // Convert object to readable string
    if (typeof paymentInfo === 'object') {
      const paymentFields: string[] = [];
      Object.entries(paymentInfo).forEach(([key, value]) => {
        if (value) {
          const formattedKey = key.replace(/[_-]/g, ' ').replace(/([A-Z])/g, ' $1').trim();
          const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
          paymentFields.push(`${capitalizedKey}: ${value}`);
        }
      });
      update.paymentInstructions = paymentFields.join('\n');
    } else {
      update.paymentInstructions = String(paymentInfo);
    }
    
    console.log('✅ Created payment instructions from paymentInfo:', update.paymentInstructions);
  }
  
  // Handle paymentDetails field (AI sometimes uses this instead of paymentInstructions)
  if (update.paymentDetails && !update.paymentInstructions) {
    const paymentInfo = update.paymentDetails;
    console.log('🔍 Extracting payment instructions from paymentDetails:', paymentInfo);
    
    // Convert object to readable string
    if (typeof paymentInfo === 'object') {
      const paymentFields: string[] = [];
      Object.entries(paymentInfo).forEach(([key, value]) => {
        if (value) {
          const formattedKey = key.replace(/[_-]/g, ' ').replace(/([A-Z])/g, ' $1').trim();
          const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
          paymentFields.push(`${capitalizedKey}: ${value}`);
        }
      });
      update.paymentInstructions = paymentFields.join('\n');
    } else {
      update.paymentInstructions = String(paymentInfo);
    }
    
    console.log('✅ Created payment instructions from paymentDetails:', update.paymentInstructions);
  }

  // Handle paymentOptions field (nested shape often returned by AI)
  if (update.paymentOptions && !update.paymentInstructions) {
    const paymentInfo = update.paymentOptions;
    console.log('🔍 Extracting payment instructions from paymentOptions:', paymentInfo);

    const paymentLines: string[] = [];
    const pushEntry = (key: string, value: any) => {
      if (value === undefined || value === null || String(value).trim() === '') return;
      const formattedKey = key.replace(/[_-]/g, ' ').replace(/([A-Z])/g, ' $1').trim();
      const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
      paymentLines.push(`${capitalizedKey}: ${value}`);
    };

    if (typeof paymentInfo === 'object') {
      Object.entries(paymentInfo).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value as Record<string, unknown>).forEach(([k, v]) => pushEntry(k, v));
        } else {
          pushEntry(key, value);
        }
      });
      if (paymentLines.length > 0) {
        update.paymentInstructions = paymentLines.join('\n');
      }
    }

    console.log('✅ Created payment instructions from paymentOptions:', update.paymentInstructions);
  }
  
  // Do not inject dueDate into paymentInstructions automatically; keep them separate

  // Handle payment fields - construct paymentInstructions if AI didn't provide it
  if (!update.paymentInstructions) {
    const paymentFields: string[] = [];

    const pushKV = (k: string, v: any) => {
      if (v === undefined || v === null || String(v).trim() === '') return;
      const formattedKey = k.replace(/[_-]/g, ' ').replace(/([A-Z])/g, ' $1').trim();
      const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
      paymentFields.push(`${capitalizedKey}: ${v}`);
    };

    // Search for ANY field that might contain payment info
    Object.keys(update).forEach(key => {
      const lowerKey = key.toLowerCase();
      const value = update[key];
      
      // Skip known non-payment fields
      if (['businessname', 'business', 'clientname', 'client', 'clientemail', 'businessemail', 
           'items', 'notes', 'message', 'description', 'duedate'].includes(lowerKey)) {
        return;
      }
      
      // Check for payment-related keywords
      const isPaymentField = 
        lowerKey.includes('payment') || lowerKey.includes('pay') || 
        lowerKey.includes('wallet') || lowerKey.includes('bitcoin') || 
        lowerKey.includes('crypto') || lowerKey.includes('venmo') ||
        lowerKey.includes('paypal') || lowerKey.includes('bank') ||
        lowerKey.includes('account') || lowerKey.includes('routing') ||
        lowerKey.includes('iban') || lowerKey.includes('swift') || lowerKey.includes('wise');
      
      if (!isPaymentField) return;

      if (Array.isArray(value)) {
        // Arrays: render each item on its own lines without index labels
        value.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([k, v]) => pushKV(k, v));
          } else {
            pushKV(key, item);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        // Single object - flatten it
        Object.entries(value).forEach(([k, v]) => pushKV(k, v));
      } else if (value) {
        // Simple value
        pushKV(key, value);
      }
    });

    if (paymentFields.length > 0) {
      update.paymentInstructions = paymentFields.join('\n');
    }
  }
  
  // Handle bank account fields separately
  if (!update.bankAccountNumber && (update.account_number || update.accountNumber)) {
    console.warn('⚠️ AI used alternate field for bank account - auto-correcting');
    update.bankAccountNumber = update.account_number || update.accountNumber;
  }
  if (!update.bankName && (update.bank || update.bank_name)) {
    console.warn('⚠️ AI used alternate field for bank name - auto-correcting');
    update.bankName = update.bank || update.bank_name;
  }
  
  if (update.items && !Array.isArray(update.items)) {
    console.error('❌ ERROR: AI returned items as', typeof update.items, 'instead of array - cannot fix');
  }
  
  const normalizedUpdate = {
    businessName: update.businessName,
    businessEmail: update.businessEmail,
    businessAddress: update.businessAddress,
    businessPhone: update.businessPhone,
    clientName: update.clientName,
    clientEmail: update.clientEmail,
    clientAddress: update.clientAddress,
    clientPhone: update.clientPhone,
    bankName: update.bankName,
    bankAccountNumber: update.bankAccountNumber,
    bankAccountType: update.bankAccountType,
    bankBranch: update.bankBranch,
    paymentInstructions: update.paymentInstructions,
    notes: update.notes,
    items: update.items,
  };
  
  console.log('✅ Fields extracted from AI response:');
  console.log('  businessName:', normalizedUpdate.businessName);
  console.log('  clientName:', normalizedUpdate.clientName);
  console.log('  clientEmail:', normalizedUpdate.clientEmail);
  console.log('  items (is array?):', Array.isArray(normalizedUpdate.items), 'length:', normalizedUpdate.items?.length);
  console.log('  paymentInstructions:', normalizedUpdate.paymentInstructions);
  console.log('  bankName:', normalizedUpdate.bankName);
  console.log('  bankAccountNumber:', normalizedUpdate.bankAccountNumber);
  
  // Show ALL keys that AI returned
  console.log('\n🔍 ALL fields AI returned:', Object.keys(update).filter(k => update[k] !== undefined));

  // Update scalar fields
  if (normalizedUpdate.businessName !== undefined) merged.businessName = normalizedUpdate.businessName;
  if (normalizedUpdate.businessEmail !== undefined) merged.businessEmail = normalizedUpdate.businessEmail;
  if (normalizedUpdate.businessAddress !== undefined) merged.businessAddress = normalizedUpdate.businessAddress;
  if (normalizedUpdate.businessPhone !== undefined) merged.businessPhone = normalizedUpdate.businessPhone;
  if (normalizedUpdate.clientName !== undefined) merged.clientName = normalizedUpdate.clientName;
  if (normalizedUpdate.clientEmail !== undefined) merged.clientEmail = normalizedUpdate.clientEmail;
  if (normalizedUpdate.clientAddress !== undefined) merged.clientAddress = normalizedUpdate.clientAddress;
  if (normalizedUpdate.clientPhone !== undefined) merged.clientPhone = normalizedUpdate.clientPhone;
  if (normalizedUpdate.bankName !== undefined) merged.bankName = normalizedUpdate.bankName;
  if (normalizedUpdate.bankAccountNumber !== undefined) merged.bankAccountNumber = normalizedUpdate.bankAccountNumber;
  if (normalizedUpdate.bankAccountType !== undefined) merged.bankAccountType = normalizedUpdate.bankAccountType;
  if (normalizedUpdate.bankBranch !== undefined) merged.bankBranch = normalizedUpdate.bankBranch;
  if (normalizedUpdate.paymentInstructions !== undefined) merged.paymentInstructions = normalizedUpdate.paymentInstructions;
  if (normalizedUpdate.notes !== undefined) merged.notes = normalizedUpdate.notes;

  // Add items (append to existing)
  if (update.items && Array.isArray(update.items) && update.items.length > 0) {
    console.log('━━━ PROCESSING ITEMS ━━━');
    console.log('Number of items:', update.items.length);
    
    // Normalize items - handle various field name patterns
    const normalizedItems = update.items.map((item: any, index: number) => {
      console.log(`\nItem ${index + 1}:`, JSON.stringify(item));
      
      // Try multiple field names for price
      let unitPrice = item.unitPrice ?? item.price ?? item.rate ?? item.amount ?? item.cost;
      
      // If still no price found, search for ANY numeric field
      if (!unitPrice) {
        console.error(`  ❌ No standard price field found! Searching all fields...`);
        console.error(`  Item keys:`, Object.keys(item));
        console.error(`  Item values:`, Object.values(item));
        
        // Try to find ANY number that could be a price
        for (const [key, value] of Object.entries(item)) {
          if (typeof value === 'number' && value > 0) {
            console.warn(`  💡 Found numeric field "${key}": ${value} - using as price`);
            unitPrice = value;
            break;
          }
        }
      }
      
      // Log which field was used
      if (item.unitPrice) {
        console.log(`  ✅ Using unitPrice: ${item.unitPrice}`);
      } else if (item.price) {
        console.warn(`  ⚠️ AI used "price" (correcting to unitPrice): ${item.price}`);
      } else if (item.rate) {
        console.warn(`  ⚠️ AI used "rate" (correcting to unitPrice): ${item.rate}`);
      } else if (item.amount) {
        console.warn(`  ⚠️ AI used "amount" (correcting to unitPrice): ${item.amount}`);
      } else if (item.cost) {
        console.warn(`  ⚠️ AI used "cost" (correcting to unitPrice): ${item.cost}`);
      } else if (unitPrice) {
        console.warn(`  ⚠️ Found price in unexpected field: ${unitPrice}`);
      } else {
        console.error(`  ❌❌❌ CRITICAL: NO PRICE FOUND IN ITEM! ❌❌❌`);
      }
      
      unitPrice = unitPrice ?? 0;
      
      const normalized = {
        description: item.description || 'Untitled item',
        unitPrice: Number(unitPrice),
        quantity: Number(item.quantity || item.qty || 1),
      };
      
      console.log(`  → Normalized:`, normalized);
      
      return normalized;
    });
    
    merged.items = [...merged.items, ...normalizedItems];
    console.log(`\n✅ Added ${normalizedItems.length} item(s) to invoice`);
  } else if (update.items !== undefined) {
    console.warn('⚠️ AI returned invalid items format. Expected array, got:', typeof update.items, update.items);
    console.warn('⚠️ Ignoring invalid items field - invoice will keep existing items');
  }

  console.log('🎉 Final merged invoice:', JSON.stringify(merged, null, 2));

  return merged;
}

