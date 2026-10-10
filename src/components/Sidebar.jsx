import React from 'react';
import { LayoutDashboard, Layers, ScanLine, Calculator, FileSpreadsheet, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, onAddNewAsset }) {
  const { hasPermission } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Analitik', icon: LayoutDashboard },
    { id: 'assets', label: 'Master Data Aktiva', icon: Layers },
    { id: 'opname', label: 'Stock Opname Audit', icon: ScanLine, highlight: true },
    { id: 'depreciation', label: 'Kalkulator Depresiasi', icon: Calculator },
  ];

  return (
    <aside style={{ width: '250px', flexShrink: 0, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      
      {hasPermission('all') && (
        <button
          className="btn btn-primary"
          onClick={onAddNewAsset}
          style={{ width: '100%', marginBottom: '16px', padding: '12px', justifyContent: 'center' }}
        >
          <PlusCircle size={18} />
          Tambah Aktiva Baru
        </button>
      )}

      <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-subtle)', padding: '0 8px 8px', letterSpacing: '0.05em' }}>
        Menu Utama
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isActive 
                ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2), rgba(99, 102, 241, 0.05))' 
                : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
              fontWeight: isActive ? '700' : '500',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <Icon size={18} color={isActive ? 'var(--accent-primary)' : item.highlight ? 'var(--accent-secondary)' : 'currentColor'} />
            {item.label}
            {item.highlight && (
              <span className="badge badge-info" style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '2px 6px' }}>
                HOT
              </span>
            )}
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
        AktivaPro v1.2 &bull; Multi-User & Stock Opname
      </div>
    </aside>
  );
}
