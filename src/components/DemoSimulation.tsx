import { useState, useEffect, useRef } from 'preact/hooks';
import { IconSparkles, IconX, IconAlertCircle, IconCircleCheck, IconSend } from '@tabler/icons-react';

interface DemoSimulationProps {
  onComplete?: () => void;
}

export function DemoSimulation(_props: DemoSimulationProps) {
  const [step, setStep] = useState<'welcome' | 'typing' | 'sent' | 'generating' | 'complete'>('welcome');
  const [typedText, setTypedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  const [polaroidPeeking, setPolaroidPeeking] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const demoPrompt = "Invoice for Acme Corp from Tech Solutions Inc. $2500 for Website Development Services. Bank name: Chase Bank, Account: 123456789, Routing: 021000021";
  
  const demoInvoice = {
    businessName: "Tech Solutions Inc.",
    clientName: "Acme Corp",
    items: [
      { description: "Website Development Services", unitPrice: 2500, quantity: 1 }
    ],
    bankName: "Chase Bank",
    bankAccountNumber: "123456789"
  };

  // Helper to format currency
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Typewriter effect - smooth and visible
  useEffect(() => {
    if (step === 'typing') {
      let index = 0;
      const charsPerFrame = 2; // Add 2 characters per frame for nice visible speed
      
      const animate = () => {
        if (index < demoPrompt.length) {
          // Add multiple characters at once
          index = Math.min(index + charsPerFrame, demoPrompt.length);
          setTypedText(demoPrompt.slice(0, index));
          requestAnimationFrame(animate);
        } else {
          setTypingComplete(true);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [step]);

  // Auto-scroll to bottom when messages appear
  useEffect(() => {
    if (step === 'sent' || step === 'complete') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  const handleStart = () => {
    setStep('typing');
    setTypedText('');
    setTypingComplete(false);
    setSentMessage('');
  };

  const handleSendMessage = () => {
    // Move typed text to sent message
    setSentMessage(typedText);
    setStep('sent');
    
    // Show AI response and generate invoice
    setTimeout(() => {
      setStep('generating');
      setTimeout(() => {
        setStep('complete');
      }, 1500);
    }, 800);
  };

  if (step === 'welcome') {
    return (
      <div style={{
        padding: '40px 20px',
        fontFamily: 'Inter, sans-serif',
        minHeight: '80vh',
        background: '#f8f9fa',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Alert Banner */}
          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '40px',
            fontSize: '15px',
            color: '#92400e',
            textAlign: 'center',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <IconAlertCircle size={20} stroke="#92400e" />
            Chrome Built-in AI is not available. Try the demo or enable it to use Invoicees!
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '40px',
          }}>
            {/* Left Column - Demo */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                borderRadius: '50%',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IconSparkles size={30} stroke="white" />
              </div>

              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                Try the Demo
              </h2>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#6b7280',
                marginBottom: '24px',
                textAlign: 'center',
              }}>
                See how Invoicees creates professional invoices through natural conversation.
                Watch the AI in action!
              </p>

              <button
                onClick={handleStart}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                }}
              >
                <IconSparkles size={20} />
                Start Interactive Demo
              </button>
            </div>

            {/* Right Column - Setup Instructions */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '16px',
              }}>
                Enable Chrome AI
              </h2>

              <p style={{
                fontSize: '15px',
                lineHeight: '1.7',
                color: '#6b7280',
                marginBottom: '24px',
              }}>
                To use the real AI-powered features, enable these 3 Chrome flags:
              </p>

              {/* Flag Instructions */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#a855f7',
                    marginBottom: '8px',
                  }}>
                    STEP 1 - Enable Gemini Nano
                  </div>
                  <code style={{
                    fontSize: '12px',
                    color: '#1f2937',
                    background: '#f3f4f6',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    display: 'block',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}>
                    chrome://flags/#prompt-api-for-gemini-nano
                  </code>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    Set to: <strong>Enabled</strong>
                  </div>
                </div>

                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#a855f7',
                    marginBottom: '8px',
                  }}>
                    STEP 2 - Enable Multimodal Input
                  </div>
                  <code style={{
                    fontSize: '12px',
                    color: '#1f2937',
                    background: '#f3f4f6',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    display: 'block',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}>
                    chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
                  </code>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    Set to: <strong>Enabled</strong>
                  </div>
                </div>

                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#a855f7',
                    marginBottom: '8px',
                  }}>
                    STEP 3 - Enable On-Device Model
                  </div>
                  <code style={{
                    fontSize: '12px',
                    color: '#1f2937',
                    background: '#f3f4f6',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    display: 'block',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}>
                    chrome://flags/#optimization-guide-on-device-model
                  </code>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                    Set to: <strong>Enabled BypassPerfRequirement</strong>
                  </div>
                </div>

              </div>

              <div style={{
                background: '#f3f4f6',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '13px',
                color: '#4b5563',
                marginTop: '16px',
                fontWeight: '500',
              }}>
                After enabling these flags, restart Chrome and reload this page.
              </div>

              <a
                href="https://developer.chrome.com/docs/ai/built-in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: '16px',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#a855f7',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
              >
                Open full guide in new window →
              </a>
            </div>
          </div>
        </div>

        {/* Floating Elements at bottom right - same as real app */}
        {/* Polaroid Photo - Peeking from bottom-right corner */}
        <div
          onClick={() => {
            if (polaroidPeeking) {
              setPolaroidPeeking(false);
            } else {
              setShowAbout(true);
            }
          }}
          onMouseEnter={() => setPolaroidPeeking(false)}
          onMouseLeave={() => setPolaroidPeeking(true)}
          style={{
            position: 'fixed',
            bottom: polaroidPeeking ? '-60px' : '20px', // Slide up/down
            right: polaroidPeeking ? '-40px' : '20px', // Slide in/out
            background: 'white',
            padding: '8px 8px 20px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 100,
            fontFamily: 'Permanent Marker, cursive',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transform: 'rotate(-2deg)',
            transition: 'right 0.3s ease, bottom 0.3s ease, transform 0.2s, box-shadow 0.2s',
          }}
          title="About Invoicees"
        >
          <img 
            src="/family.jpg" 
            alt="Family" 
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              display: 'block',
              marginBottom: '8px',
            }}
          />
          <div style={{
            fontSize: '10px',
            textAlign: 'center',
            color: '#4b5563',
          }}>
            Made with ❤️
          </div>
        </div>

        {/* About Modal */}
        {showAbout && (
          <>
            <div
              onClick={() => setShowAbout(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                backdropFilter: 'blur(4px)',
              }}
            />
            
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '700px',
                width: '90%',
                zIndex: 10000,
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              <button
                onClick={() => setShowAbout(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280',
                  borderRadius: '6px',
                }}
              >
                <IconX size={20} />
              </button>

              {/* Left/Right Layout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '32px',
                alignItems: 'center',
              }}>
                {/* Left - Polaroid Photo */}
                <div style={{
                  background: 'white',
                  padding: '12px 12px 32px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transform: 'rotate(-2deg)',
                }}>
                  <img 
                    src="/family.jpg" 
                    alt="Family" 
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    fontFamily: 'Permanent Marker, cursive',
                    fontSize: '14px',
                    textAlign: 'center',
                    color: '#4b5563',
                    marginTop: '12px',
                  }}>
                    My Family ❤️
                  </div>
                </div>

                {/* Right - About Content */}
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '16px',
                  }}>
                    About Invoicees
                  </h2>
                  
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#4b5563',
                    marginBottom: '16px',
                  }}>
                    I built Invoicees because I wanted to make invoicing simple and delightful. 
                    As a developer and freelancer, I know how tedious it can be to create professional invoices. 
                    So I created this tool powered by Chrome's built-in AI to help you generate beautiful invoices 
                    in seconds, right in your browser—no servers, no logins, completely private.
                  </p>

                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#4b5563',
                  }}>
                    Thank you so much for using Invoicees. It truly means the world to me! 
                    I hope it saves you time and brings a little joy to your workflow. 💜
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (step === 'typing' || step === 'sent' || step === 'generating' || step === 'complete') {
    return (
      <>
        {/* Polaroid - Peeking from bottom-right corner (same as toolbar) */}
        <div
          onClick={() => {
            if (polaroidPeeking) {
              setPolaroidPeeking(false);
            } else {
              setShowAbout(true);
            }
          }}
          onMouseEnter={() => setPolaroidPeeking(false)}
          onMouseLeave={() => setPolaroidPeeking(true)}
          style={{
            position: 'fixed',
            bottom: polaroidPeeking ? '-60px' : '20px', // Slide up/down
            right: polaroidPeeking ? '-40px' : '20px', // Slide in/out
            background: 'white',
            padding: '8px 8px 20px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 100,
            fontFamily: 'Permanent Marker, cursive',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transform: 'rotate(-2deg)',
            transition: 'right 0.3s ease, bottom 0.3s ease, transform 0.2s, box-shadow 0.2s',
          }}
          title="About Invoicees"
        >
          <img 
            src="/family.jpg" 
            alt="Family" 
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              display: 'block',
              marginBottom: '8px',
            }}
          />
          <div style={{
            fontSize: '10px',
            textAlign: 'center',
            color: '#4b5563',
          }}>
            Made with ❤️
          </div>
        </div>

        <div
          onClick={() => {
            setStep('welcome');
            setTypedText('');
            setTypingComplete(false);
            setSentMessage('');
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px', // Now at the rightmost since polaroid is peeking
            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
            padding: '10px 16px',
            borderRadius: '28px',
            cursor: 'pointer',
            zIndex: 100,
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
            fontWeight: '700',
            fontSize: '12px',
            borderRadius: '50%',
          }}>
            ←
          </div>
          <div style={{ fontWeight: '600', fontSize: '13px', color: 'white' }}>
            Back to Setup
          </div>
        </div>

        {/* About Modal */}
        {showAbout && (
          <>
            <div
              onClick={() => setShowAbout(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                backdropFilter: 'blur(4px)',
              }}
            />
            
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                maxWidth: '700px',
                width: '90%',
                zIndex: 10000,
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              <button
                onClick={() => setShowAbout(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280',
                  borderRadius: '6px',
                }}
              >
                <IconX size={20} />
              </button>

              {/* Left/Right Layout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '32px',
                alignItems: 'center',
              }}>
                {/* Left - Polaroid Photo */}
                <div style={{
                  background: 'white',
                  padding: '12px 12px 32px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transform: 'rotate(-2deg)',
                }}>
                  <img 
                    src="/family.jpg" 
                    alt="Family" 
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    fontFamily: 'Permanent Marker, cursive',
                    fontSize: '14px',
                    textAlign: 'center',
                    color: '#4b5563',
                    marginTop: '12px',
                  }}>
                    My Family ❤️
                  </div>
                </div>

                {/* Right - About Content */}
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '16px',
                  }}>
                    About Invoicees
                  </h2>
                  
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#4b5563',
                    marginBottom: '16px',
                  }}>
                    I built Invoicees because I wanted to make invoicing simple and delightful. 
                    As a developer and freelancer, I know how tedious it can be to create professional invoices. 
                    So I created this tool powered by Chrome's built-in AI to help you generate beautiful invoices 
                    in seconds, right in your browser—no servers, no logins, completely private.
                  </p>

                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: '#4b5563',
                  }}>
                    Thank you so much for using Invoicees. It truly means the world to me! 
                    I hope it saves you time and brings a little joy to your workflow. 💜
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Invoice Preview Section - Shows at top like real app */}
        <div style={{
          paddingTop: '20px',
          paddingBottom: '240px',
          minHeight: '100vh',
          background: '#f8f9fa',
        }}>
          {(step === 'generating' || step === 'complete') ? (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: '20px',
            }}>
              <div style={{
                background: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                opacity: step === 'generating' ? 0.5 : 1,
                transition: 'opacity 0.5s',
              }}>

                {/* Minimalist Invoice Preview */}
                <div style={{
                  padding: '60px',
                }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '300',
                  margin: '0 0 8px 0',
                  color: '#1a202c',
                }}>INVOICE</h1>
                <div style={{ fontSize: '13px', color: '#718096', marginBottom: '40px' }}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '32px',
                  marginBottom: '40px',
                }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#a0aec0', marginBottom: '8px' }}>FROM</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                      {demoInvoice.businessName}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#a0aec0', marginBottom: '8px' }}>TO</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                      {demoInvoice.clientName}
                    </div>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '10px', color: '#a0aec0' }}>DESCRIPTION</th>
                      <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '10px', color: '#a0aec0' }}>QTY</th>
                      <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '10px', color: '#a0aec0' }}>PRICE</th>
                      <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '10px', color: '#a0aec0' }}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoInvoice.items.map((item, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f7fafc' }}>
                        <td style={{ padding: '14px 0', color: '#2d3748', fontSize: '13px' }}>{item.description}</td>
                        <td style={{ textAlign: 'right', padding: '14px 0', color: '#718096', fontSize: '13px' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right', padding: '14px 0', color: '#718096', fontSize: '13px' }}>${formatCurrency(item.unitPrice)}</td>
                        <td style={{ textAlign: 'right', padding: '14px 0', color: '#2d3748', fontWeight: '600', fontSize: '13px' }}>
                          ${formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    borderTop: '2px solid #2d3748',
                    paddingTop: '12px',
                    minWidth: '180px',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a202c',
                    }}>
                      <span>TOTAL</span>
                      <span>${formatCurrency(demoInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))}</span>
                    </div>
                  </div>
                </div>

                {demoInvoice.bankName && (
                  <div style={{ marginTop: '32px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#a0aec0', marginBottom: '8px' }}>PAYMENT DETAILS</div>
                    <div style={{ fontSize: '13px', color: '#718096' }}>
                      Bank: {demoInvoice.bankName}<br />
                      Account: {demoInvoice.bankAccountNumber}
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'calc(100vh - 240px)',
              color: '#9ca3af',
              fontSize: '16px',
            }}>
              Type a message to see the invoice appear...
            </div>
          )}
        </div>

        {/* Chat Component - Fixed at bottom left to avoid covering nav */}
        <div style={{
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
        }}>
          {/* Compact Header */}
          <div style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '10px 10px 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconSparkles size={18} />
              <div style={{ fontWeight: '600', fontSize: '14px' }}>AI Assistant</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>
                {step === 'typing' && !typingComplete ? '● Typing...' : 
                 step === 'typing' && typingComplete ? '● Ready' :
                 step === 'sent' || step === 'generating' ? '● Processing...' :
                 '● Demo'}
              </div>
            </div>
            <div style={{
              fontSize: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 8px',
              borderRadius: '12px',
              fontWeight: '600',
            }}>
              DEMO MODE
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '12px 16px',
            background: '#fafafa',
            minHeight: 0,
          }}>
            {/* Show user message only after it's sent */}
            {(step === 'sent' || step === 'generating' || step === 'complete') && sentMessage && (
              <div style={{
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <div style={{
                  maxWidth: '75%',
                  padding: '8px 12px',
                  background: '#a855f7',
                  color: 'white',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  borderRadius: '8px',
                }}>
                  {sentMessage}
                </div>
              </div>
            )}

            {/* AI Response after sending */}
            {step === 'sent' && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '10px',
              }}>
                <div style={{
                  padding: '8px 12px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#1f2937',
                }}>
                  Great! I've extracted the invoice details. Generating your invoice now...
                </div>
              </div>
            )}

            {step === 'complete' && sentMessage && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '10px',
              }}>
                <div style={{
                  padding: '8px 12px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <IconCircleCheck size={16} stroke="#10b981" />
                  Invoice created successfully! This is how Invoicees works with Chrome's Built-in AI.
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area with Send Button */}
          <div style={{
            padding: '10px 16px',
            background: 'white',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
          }}>
            <textarea
              value={step === 'typing' ? typedText : (step === 'complete' ? '' : '')}
              disabled
              placeholder={step === 'complete' ? 'Demo completed!' : 'Type your message...'}
              rows={2}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px',
                border: '1px solid #e5e7eb',
                background: '#fafafa',
                outline: 'none',
                borderRadius: '6px',
                color: '#1f2937',
                resize: 'none',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!typingComplete || step !== 'typing'}
              style={{
                background: (typingComplete && step === 'typing') ? '#a855f7' : '#d1d5db',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                cursor: (typingComplete && step === 'typing') ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                flexShrink: 0,
              }}
            >
              <IconSend size={18} />
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}

