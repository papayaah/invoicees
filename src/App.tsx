import { useEffect, useState } from 'preact/hooks';
import Router, { route } from 'preact-router';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import { FloatingChat } from './components/FloatingChat';
import { Toolbar } from './components/Toolbar';
import { WorkInProgressRibbon } from './components/WorkInProgressRibbon';
import { IconDownload, IconTrash, IconBookmark, IconBookmarkOff } from '@tabler/icons-react';
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
  const { invoices, layout, setLayout, addNewInvoice, updateInvoice, resetAllInvoices, deleteInvoice, saveInvoiceToDB, unsaveInvoice, isInvoiceSaved } = useInvoice();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(null);
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
          route('/setup');
        }
      } else {
        // Redirect to setup page if AI is not available
        route('/setup');
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
    setGeneratingInvoiceId(newInvoice.id || null);

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

      // Clear skeleton animation only after successful processing
      setIsProcessing(false);
      setGeneratingInvoiceId(null);
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
        // Clear skeleton on error
        setIsProcessing(false);
        setGeneratingInvoiceId(null);
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
      
      // Clear skeleton on error
      setIsProcessing(false);
      setGeneratingInvoiceId(null);
    } finally {
      // Only clear processing state if not already cleared in success path
      // (This handles error cases where skeleton should still be cleared)
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

    try {
      // Use our own print-to-PDF export (no external PDF libs)
      const { exportInvoices } = await import('./lib/pdf-export');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = invoices.length === 1 ? `invoice-${timestamp}.pdf` : `invoices-${timestamp}.pdf`;
      await exportInvoices(invoices, filename);
      
      const successMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: `Successfully exported ${invoices.length} invoice${invoices.length > 1 ? 's' : ''} to PDF!`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, successMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: 'Failed to export PDF. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
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

  const handleExportSingle = async (invoice: typeof invoices[number]) => {
    try {
      const { exportInvoices } = await import('./lib/pdf-export');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${invoice.businessName?.trim() || 'invoice'}-${timestamp}.pdf`;
      await exportInvoices([invoice], filename);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: 'Failed to export this invoice. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Loading component
  const LoadingScreen = ({ path: _path }: { path?: string }) => (
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

  // Main invoice app component
  const InvoiceApp = ({ path: _path }: { path?: string }) => (
    <>
      {/* PDF Export Styles */}
      <style>{`
        .pdf-export {
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .pdf-export * {
          font-family: inherit !important;
        }
      `}</style>
      
      {/* Work In Progress Ribbon */}
      <WorkInProgressRibbon />
      
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
                {/* Action buttons */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 10,
                }}>
                  {/* Save/Unsave button */}
                  <button
                    onClick={() => isInvoiceSaved(invoice.id!) ? unsaveInvoice(invoice.id!) : saveInvoiceToDB(invoice.id!)}
                    style={{
                      background: isInvoiceSaved(invoice.id!) ? '#10b981' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease',
                    }}
                    title={isInvoiceSaved(invoice.id!) ? "Unsave invoice" : "Save invoice"}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {isInvoiceSaved(invoice.id!) ? <IconBookmark size={16} /> : <IconBookmarkOff size={16} />}
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteInvoice(invoice.id!)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease',
                    }}
                    title="Delete invoice"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <IconTrash size={16} />
                  </button>

                  {/* Export single invoice */}
                  <button
                    onClick={() => handleExportSingle(invoice)}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease',
                    }}
                    title="Export this invoice"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <IconDownload size={16} />
                  </button>
                </div>
        <InvoiceTemplate invoice={invoice} layout={layout} isGenerating={generatingInvoiceId === invoice.id} />
              </div>
            ))}
          </div>
        )}

        {/* Saved Invoices Section */}
        {invoices.filter(inv => isInvoiceSaved(inv.id!)).length > 0 && (
          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <IconBookmark size={20} />
              Saved Invoices ({invoices.filter(inv => isInvoiceSaved(inv.id!)).length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {invoices.filter(inv => isInvoiceSaved(inv.id!)).map((invoice) => (
                <div key={`saved-${invoice.id}`} style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1e293b',
                    }}>
                      {invoice.businessName || 'Untitled Invoice'}
                    </h4>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => unsaveInvoice(invoice.id!)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                        title="Unsave"
                      >
                        <IconBookmarkOff size={14} />
                      </button>
                      <button
                        onClick={() => deleteInvoice(invoice.id!)}
                        style={{
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                        title="Delete"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    <div>Client: {invoice.clientName || 'Not specified'}</div>
                    <div>Items: {invoice.items.length}</div>
                    <div>Total: ${invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat */}
      <FloatingChat
        messages={messages}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        examplePromptToType={examplePromptToType}
        onExampleTypingComplete={() => setExamplePromptToType(null)}
      />
    </>
  );

  return (
    <Router>
      {aiAvailable === null ? (
        <LoadingScreen path="/" />
      ) : aiAvailable === true ? (
        <InvoiceApp path="/" />
      ) : (
        <DemoSimulation path="/" />
      )}
      <DemoSimulation path="/setup" />
    </Router>
  );
}

