import React from 'react';
import { Smartphone, Monitor, Moon, Sun, QrCode, Building2 } from 'lucide-react';

export default function Navbar({ deviceMode, setDeviceMode, theme, setTheme, onOpenScanner }) {
  return (
    <header className="glass-card" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '12px 24px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '8px', borderRadius: '10px', display: 'flex', color: '#fff' }}>
            <Building2 size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '800', tracking: '-0.02em', background: 'linear-gradient(90deg, #fff, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Aktiva<span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'var(--accent-primary)' }}>Pro</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
              Fixed Asset & Stock Opname System
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Quick Barcode Scanner Button */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenScanner}
            title="Scan QR/Barcode Aktiva"
            style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
          >
            <QrCode size={16} />
            <span className="hide-mobile">Scan Barcode</span>
          </button>

          {/* Device Simulator Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setDeviceMode('laptop')}
              style={{
                background: deviceMode === 'laptop' ? 'var(--accent-primary)' : 'transparent',
                color: deviceMode === 'laptop' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              title="Tampilan Versi Laptop / Desktop"
            >
              <Monitor size={15} />
              <span className="hide-mobile">Laptop</span>
            </button>

            <button
              onClick={() => setDeviceMode('mobile')}
              style={{
                background: deviceMode === 'mobile' ? 'var(--accent-primary)' : 'transparent',
                color: deviceMode === 'mobile' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              title="Simulasi Tampilan Versi HP (Handphone)"
            >
              <Smartphone size={15} />
              <span className="hide-mobile">Simulasi HP</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ padding: '8px' }}
            title="Ganti Tema"
          >
            {theme === 'dark' ? <Sun size={16} color="#f59e0b" /> : <Moon size={16} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
