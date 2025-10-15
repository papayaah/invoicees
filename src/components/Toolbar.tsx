import { useState } from 'preact/hooks';
import { InvoiceLayout } from '@/types/invoice';
import { IconFileDownload, IconRefresh, IconChevronUp, IconChevronDown, IconX, IconHeart } from '@tabler/icons-react';

interface ToolbarProps {
  currentLayout: InvoiceLayout;
  onLayoutChange: (layout: InvoiceLayout) => void;
  onExportPDF: () => void;
  onReset: () => void;
}

const layouts: { value: InvoiceLayout; label: string }[] = [
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'leftHeader', label: 'Left Header' },
  { value: 'centered', label: 'Centered' },
  { value: 'compactGrid', label: 'Compact Grid' },
];

export function Toolbar({ currentLayout, onLayoutChange, onExportPDF, onReset }: ToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [polaroidPeeking, setPolaroidPeeking] = useState(true);

  return (
    <>
      {/* About Modal */}
      {showAbout && (
        <>
          {/* Backdrop */}
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
          
          {/* About Modal */}
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
            {/* Close button */}
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
              display: 'flex',
              flexWrap: 'wrap',
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
                flexShrink: 0,
                width: '200px',
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
                  color: '#e57373',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}>
                  <IconHeart size={16} stroke="#e57373" fill="#e57373" />
                  My Inspiration
                </div>
              </div>

              {/* Right - About Content */}
              <div style={{ flex: 1, minWidth: '250px' }}>
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
                  I hope it saves you time and brings a little joy to your workflow.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toolbar UI */}
      {!isExpanded ? (
        <>
        {/* Polaroid Family Photo - Peeking from bottom-right corner */}
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
            bottom: '40px', // Fixed vertical position
            right: polaroidPeeking ? '-70px' : '0px', // Slide horizontally only, shows ~1/4 when peeking
            background: 'white',
            padding: '8px 8px 20px 8px',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 2500,
            fontFamily: 'Permanent Marker, cursive',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transform: 'rotate(-2deg)',
            transition: 'right 0.3s ease, transform 0.2s, box-shadow 0.2s',
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
            color: '#e57373',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}>
            Made with <IconHeart size={12} stroke="#e57373" fill="#e57373" />
          </div>
        </div>

        {/* Toolbar Badge */}
        <div
          onClick={() => setIsExpanded(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px', // Now at the edge since polaroid is peeking
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
            IV
          </div>
          <div style={{ fontWeight: '600', fontSize: '13px', color: 'white' }}>
            Invoicees
          </div>
          <IconChevronUp size={16} stroke="white" style={{ opacity: 0.8 }} />
        </div>
      </>
      ) : (
        <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        width: '320px',
        maxHeight: '80vh',
        overflowY: 'auto',
        zIndex: 2000,
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Header with collapse button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '2px solid #e5e7eb',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: '#a855f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '700',
            fontSize: '14px',
            borderRadius: '6px',
        }}>
            IV
        </div>
        <div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1f2937' }}>
              Invoicees
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>
              Settings
          </div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            padding: '6px',
            background: 'transparent',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#6b7280',
          }}
          title="Collapse toolbar"
        >
          <IconChevronDown size={16} />
        </button>
      </div>

      {/* Layout Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          fontSize: '11px', 
          color: '#6b7280', 
          fontWeight: '600',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px',
        }}>
          Layout
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {layouts.map((layout) => (
          <button
            key={layout.value}
            onClick={() => onLayoutChange(layout.value)}
            style={{
                padding: '12px 16px',
              fontSize: '13px',
              fontWeight: '500',
                background: currentLayout === layout.value ? '#a855f7' : '#f9fafb',
              color: currentLayout === layout.value ? 'white' : '#4b5563',
                border: currentLayout === layout.value ? 'none' : '1px solid #e5e7eb',
              cursor: 'pointer',
                borderRadius: '6px',
                textAlign: 'left',
                transition: 'all 0.2s',
            }}
          >
            {layout.label}
          </button>
        ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
      }}>
        <button
          onClick={onReset}
          style={{
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            background: '#ffffff',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '6px',
          }}
        >
          <IconRefresh size={16} />
          Reset All
        </button>
        <button
          onClick={onExportPDF}
          style={{
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '500',
            background: '#10b981',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '6px',
          }}
        >
          <IconFileDownload size={16} />
          Export PDF
        </button>
      </div>
    </div>
      )}
    </>
  );
}

