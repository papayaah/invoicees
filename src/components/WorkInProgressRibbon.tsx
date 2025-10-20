import { useState, useEffect } from 'preact/hooks';

export function WorkInProgressRibbon() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show ribbon after a short delay to avoid flash
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        zIndex: 50, 
        pointerEvents: 'none',
        width: '120px', 
        height: '120px', 
        overflow: 'visible' 
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Main Ribbon */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '8px 32px',
            position: 'absolute',
            transform: 'rotate(45deg)',
            transformOrigin: 'center',
            top: '20px',
            right: '-35px',
            width: '150px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'none',
            borderRadius: 0,
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              whiteSpace: 'nowrap' 
            }}
          >
            <span style={{ fontSize: '14px', lineHeight: '1.2', fontWeight: 'bold' }}>
              ALPHA<span style={{ fontSize: '10px', fontWeight: '400', marginLeft: '2px' }}>v0.1</span>
            </span>
            <span style={{ fontSize: '10px', lineHeight: '1.2', fontWeight: '500' }}>
              Still Making It Better
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

