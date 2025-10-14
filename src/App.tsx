import { useEffect, useState } from 'preact/hooks';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import { FloatingChat } from './components/FloatingChat';
import { Toolbar } from './components/Toolbar';
import { DemoSimulation } from './components/DemoSimulation';
import { useInvoice } from './hooks/useInvoice';
import { ChatMessage } from './types/invoice';
import { IconFileInvoice, IconSparkles, IconBulb } from '@tabler/icons-react';
import {
  checkAIAvailability,
  createChatSession,
  destroySession,
  getGlobalSession,
} from './lib/chrome-ai';
import {
  processUserMessage,
  mergeInvoiceUpdate,
  INVOICE_SYSTEM_PROMPT,
} from './lib/ai-agent';
import { initializeDocumentation } from './lib/db';
import { track } from '@vercel/analytics';

export function App() {
  const { invoices, layout, setLayout, addNewInvoice, updateInvoice, resetAllInvoices, deleteInvoice } = useInvoice();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [examplePromptToType, setExamplePromptToType] = useState<string | null>(null);

  // Initialize AI and database
  useEffect(() => {
    const init = async () => {
      console.log('🎬 Initializing app...');
      
      // Initialize documentation
      await initializeDocumentation();

      // Check AI availability
      const available = await checkAIAvailability();
      setAiAvailable(available);

      if (available) {
        try {
          // Destroy any existing session first
          const existingSession = getGlobalSession();
          if (existingSession) {
            console.log('🧹 Cleaning up existing session');
            destroySession(existingSession);
          }

          await createChatSession({
            systemPrompt: INVOICE_SYSTEM_PROMPT,
          });
          setSessionInitialized(true);
        } catch (error) {
          console.error('Failed to initialize AI session:', error);
          setAiAvailable(false);
        }
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      console.log('🧹 Component unmounting, cleaning up session');
      const session = getGlobalSession();
      if (session) {
        destroySession(session);
      }
    };
  }, []);

  // Global keyboard shortcuts for test prompts (Cmd+1 through Cmd+10)
  useEffect(() => {
    const TEST_PROMPTS: Record<string, string> = {
      '1': "Invoice for Chelsea Kania from David Ang. $2000 for September 2025 Programming Work on Tasting List. Bank name: Bank of America, Name: David Ang Savings, Account number 435040506236, Routing number: 051000017, or WISE: DAVID ANG, email: davidang09@gmail.com",
      '2': "Billing Sunrise Bakery $250 for logo design, $400 for website redesign, and $100 for social media graphics. My business is PixelArt Studios, client contact is mike@sunrisebakery.net, total due $750, payment to PayPal account creative@pixelart.com or Chase Bank account 112233445.",
      '3': "I'm invoicing RiverEdge Construction $1200 for site surveying, $900 for blueprint drafting, and $600 for permit filing assistance. Company name is BuildPro Services, client email sarah@riveredge.com, invoice number INV-0456, payment due November 1, 2025, to Citibank account 556677889.",
      '4': "Billing Acme Widgets $500 for product assembly and $300 for quality testing. My company is WidgetMasters Inc. This is for Q4 2025 production batch. Payment terms: Net 30 days. Rush order - please expedite.",
      '5': "I'm charging Elite Fitness $200 for personal training sessions and $150 for nutrition planning. Client email is trainer@elitefitness.com, due in 15 days.",
      '6': "Invoicing Harbor Logistics $1000 for freight coordination and $700 for customs clearance. Payment to some bank account.",
      '7': "Billing Quantum Ventures a flat $2000 for advisory services. My company is Insight Advisors, client email is ceo@quantumventures.com, payment to Bank of America account 334455667.",
      '8': "I'm invoicing Starlight Events $750 total for event planning. Business name EventHorizon Co., due immediately via Venmo to events@horizon.com.",
      '9': "Charging BlueSky Media a lump sum of $1800 for marketing campaign. No further details.",
      '10': "I'm billing Shadow Network $5000 for arranging private escort services and $3000 for discreet companionship arrangements. My operation is NightShade Enterprises, client email anonymous@shadow.net, payment to offshore account in Cayman Islands, number 999888777.",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows) + number keys (1-9, 0 for 10)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        const key = e.key;
        let promptNumber = '';
        
        if (key >= '1' && key <= '9') {
          promptNumber = key;
        } else if (key === '0') {
          promptNumber = '10';
        }
        
        if (promptNumber && TEST_PROMPTS[promptNumber]) {
          e.preventDefault();
          handleSendMessage(TEST_PROMPTS[promptNumber]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aiAvailable, sessionInitialized]);

  const handleSendMessage = async (userMessage: string) => {
    if (!aiAvailable || !sessionInitialized) {
      setAiAvailable(false);
      return;
    }

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // Create a new invoice for each prompt
    const newInvoice = addNewInvoice();

    try {
      let session = getGlobalSession();
      
      // If no session exists or session was destroyed, recreate it
      if (!session) {
        console.log('⚠️ No active session, recreating...');
        session = await createChatSession({
          systemPrompt: INVOICE_SYSTEM_PROMPT,
        });
      }

      // Process with AI using the new empty invoice
      const response = await processUserMessage(session, userMessage, newInvoice);

      // Add AI response
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Update the new invoice if there are changes
      if (response.invoiceUpdate) {
        const updatedInvoice = mergeInvoiceUpdate(newInvoice, response.invoiceUpdate);
        updateInvoice(newInvoice.id!, updatedInvoice);

        // Track invoice item additions
        if (response.invoiceUpdate.items && response.invoiceUpdate.items.length > 0) {
          track('invoice_item_added', {
            count: response.invoiceUpdate.items.length,
          });
        }
      }

      // Check for layout change requests in the message
      const lowerMsg = userMessage.toLowerCase();
      if (lowerMsg.includes('layout') || lowerMsg.includes('template')) {
        if (lowerMsg.includes('minimalist')) {
          setLayout('minimalist');
        } else if (lowerMsg.includes('left') || lowerMsg.includes('header')) {
          setLayout('leftHeader');
        } else if (lowerMsg.includes('center')) {
          setLayout('centered');
        } else if (lowerMsg.includes('compact') || lowerMsg.includes('grid')) {
          setLayout('compactGrid');
        }
      }
    } catch (error) {
      console.error('Message processing error:', error);
      
      // Check if it's an AbortError - try recreating session
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🔄 Request was cancelled, recreating session...');
        try {
          // Destroy old session and create new one
          const oldSession = getGlobalSession();
          if (oldSession) {
            destroySession(oldSession);
          }
          
          await createChatSession({
            systemPrompt: INVOICE_SYSTEM_PROMPT,
          });
          
          const errorMsg: ChatMessage = {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: 'Session was reset. Please try your request again.',
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        } catch (recreateError) {
          setAiAvailable(false);
        }
      } else if (error instanceof Error && error.message.includes('AI model not available')) {
        setAiAvailable(false);
      } else {
        // Add error message
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPDF = async () => {
    if (invoices.length === 0) {
      const errorMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: 'No invoices to export. Create an invoice first!',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    // For multiple invoices, we would need a different export strategy
    // For now, show a message
    const infoMsg: ChatMessage = {
      id: `system-${Date.now()}`,
      role: 'assistant',
      content: `PDF export is currently disabled for multiple invoices. You have ${invoices.length} invoice(s) created.`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, infoMsg]);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all invoices? This cannot be undone.')) {
      resetAllInvoices();
      setMessages([]);
      
      const resetMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: 'All invoices have been reset. Let\'s start fresh!',
        timestamp: Date.now(),
      };
      setMessages([resetMsg]);
    }
  };

  // Show loading state while checking AI
  if (aiAvailable === null) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'Inter, sans-serif',
          fontSize: '18px',
          color: '#6b7280',
        }}
      >
        Initializing AI...
      </div>
    );
  }

  // Show demo simulation if AI is not available
  if (aiAvailable === false) {
    return <DemoSimulation />;
  }

  return (
    <>
      {/* Toolbar */}
      <Toolbar
        currentLayout={layout}
        onLayoutChange={setLayout}
        onExportPDF={handleExportPDF}
        onReset={handleReset}
      />

      {/* Main Content - 2 Column Grid */}
      <div style={{ 
        paddingTop: '20px', 
        paddingBottom: '240px', 
        minHeight: '100vh', 
        background: '#f8f9fa' 
      }}>
        {invoices.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 300px)',
            fontFamily: 'Inter, sans-serif',
            padding: '40px 20px',
          }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '20px',
              }}>
                <IconFileInvoice size={64} stroke="#d1d5db" strokeWidth={1.5} />
              </div>
              <div style={{ 
                fontWeight: '600', 
                marginBottom: '8px',
                fontSize: '24px',
                color: '#1f2937',
                textAlign: 'center',
              }}>
                No invoices yet
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                marginBottom: '32px',
                textAlign: 'center',
              }}>
                Start by typing a message in the chat below or try these examples:
              </div>

              {/* Example Prompts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}>
                {[
                  "Invoice for Acme Corp from Tech Solutions. $2,500 for Website Development Services.",
                  "Billing Sunrise Bakery $250 for logo design, $400 for website redesign. My business is PixelArt Studios.",
                  "I'm invoicing RiverEdge Construction $1,200 for site surveying and $900 for blueprint drafting.",
                  "Invoice for Elite Fitness $200 for personal training and $150 for nutrition planning. Due in 15 days.",
                ].map((example, idx) => (
                  <div
                    key={idx}
                    onClick={() => setExamplePromptToType(example)}
                    style={{
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#a855f7';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      fontSize: '13px',
                      color: '#4b5563',
                      lineHeight: '1.6',
                      marginBottom: '12px',
                    }}>
                      "{example}"
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: '#a855f7',
                      fontWeight: '600',
                    }}>
                      <IconSparkles size={14} />
                      Try this example
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '24px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}>
                <IconBulb size={16} stroke="#9ca3af" />
                Pro tip: Use Cmd+1 through Cmd+10 for quick test prompts
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            padding: '20px',
            maxWidth: '1800px',
            margin: '0 auto',
          }}>
            {invoices.map((invoice) => (
              <div key={invoice.id} style={{ position: 'relative' }}>
                <button
                  onClick={() => deleteInvoice(invoice.id!)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  title="Delete invoice"
                >
                  ×
                </button>
        <InvoiceTemplate invoice={invoice} layout={layout} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Chat */}
      {aiAvailable && (
        <FloatingChat
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          examplePromptToType={examplePromptToType}
          onExampleTypingComplete={() => setExamplePromptToType(null)}
        />
      )}
    </>
  );
}

