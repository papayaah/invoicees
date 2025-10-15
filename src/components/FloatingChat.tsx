import { useState, useRef, useEffect } from 'preact/hooks';
import { ChatMessage } from '@/types/invoice';
import { IconSend, IconX, IconMessageCircle, IconHandStop, IconFlask } from '@tabler/icons-react';

interface FloatingChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  examplePromptToType?: string | null;
  onExampleTypingComplete?: () => void;
}

// Test prompts for quick testing (type 1-10)
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

export function FloatingChat({ messages, onSendMessage, isProcessing, examplePromptToType, onExampleTypingComplete }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Typewriter effect for example prompts
  useEffect(() => {
    if (examplePromptToType && isOpen) {
      let index = 0;
      const charsPerFrame = 5;
      
      const animate = () => {
        if (index < examplePromptToType.length) {
          index = Math.min(index + charsPerFrame, examplePromptToType.length);
          setInput(examplePromptToType.slice(0, index));
          requestAnimationFrame(animate);
        } else {
          // Typing complete, wait a moment then auto-submit
          setTimeout(() => {
            if (!isProcessing) {
              onSendMessage(examplePromptToType);
              setInput('');
            }
            // Notify parent to clear the example
            if (onExampleTypingComplete) {
              onExampleTypingComplete();
            }
          }, 500); // Small delay so user can see the full text before submission
        }
      };
      
      // Open chat if closed and start typing
      setIsOpen(true);
      setInput('');
      requestAnimationFrame(animate);
    }
  }, [examplePromptToType, isOpen, isProcessing, onSendMessage, onExampleTypingComplete]);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      const trimmedInput = input.trim();
      // Check if input is a test prompt number (1-10)
      const messageToSend = TEST_PROMPTS[trimmedInput] || trimmedInput;
      onSendMessage(messageToSend);
      setInput('');
    }
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '200px', // Adjusted - to the left of toolbar badge
          padding: '10px 16px',
          background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '28px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
          fontFamily: 'Inter, sans-serif',
          height: '44px',
        }}
      >
        <div style={{
          width: '24px',
          height: '24px',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
        }}>
          <IconMessageCircle size={16} />
        </div>
        <div style={{ fontWeight: '600', fontSize: '13px', color: 'white' }}>
          Chat
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '20px',
        right: '250px', // Adjusted since polaroid is peeking
        height: '200px',
        background: 'white',
        border: '2px solid #e5e7eb',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Compact Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
          color: 'white',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '10px 10px 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconMessageCircle size={18} />
          <div style={{ fontWeight: '600', fontSize: '14px' }}>AI Assistant</div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>
            {isProcessing ? 'Thinking...' : '● Online'}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
          }}
        >
          <IconX size={16} />
        </button>
      </div>

      {/* Messages - Compact, scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 16px',
          background: '#fafafa',
          minHeight: 0,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '13px',
              padding: '8px 12px',
            }}
          >
            <div style={{ 
              fontSize: '14px', 
              marginBottom: '6px', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              <IconHandStop size={16} stroke="#9ca3af" />
              Welcome! Each message creates a new invoice
            </div>
            <div style={{ 
              fontSize: '12px', 
              marginTop: '4px', 
              color: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              <IconFlask size={14} stroke="#a855f7" />
              Testing: Type 1-10 or press Cmd+1 to Cmd+0 (for 10) anywhere
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: '10px',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  padding: '8px 12px',
                  background: msg.role === 'user' ? '#a855f7' : 'white',
                  color: msg.role === 'user' ? 'white' : '#1f2937',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none',
                  borderRadius: '8px',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
            <div
              style={{
                padding: '8px 12px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#9ca3af',
              }}
            >
              <span>Thinking</span>
              <span className="loading-dots">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Compact Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '10px 16px',
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
        }}
      >
        <textarea
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          onKeyDown={(e) => {
            // Submit on Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              if (input.trim() && !isProcessing) {
                handleSubmit(e);
              }
            }
          }}
          placeholder="Type your message... (Cmd/Ctrl+Enter to send)"
          disabled={isProcessing}
          rows={2}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '13px',
            border: '1px solid #e5e7eb',
            background: '#fafafa',
            outline: 'none',
            borderRadius: '6px',
            resize: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          style={{
            background: input.trim() && !isProcessing ? '#a855f7' : '#d1d5db',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            cursor: input.trim() && !isProcessing ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            flexShrink: 0,
          }}
        >
          <IconSend size={18} />
        </button>
      </form>
    </div>
  );
}

