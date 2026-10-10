import React, { useState } from 'react';
import { calculateStraightLine, formatRupiah } from '../utils/depreciation';
import { Search, Filter, QrCode, ChevronRight, MapPin, User, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AssetListMobile({ assets, onAddNew, onSelectAsset, onOpenScanner }) {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'IT Hardware', 'Kendaraan', 'Mesin & Peralatan', 'Furnitur Kantor'];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategoryFilter === 'ALL' || asset.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      {/* Mobile Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-control"
          placeholder="Cari aktiva di HP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '36px', borderRadius: '12px', fontSize: '0.85rem' }}
        />
      </div>

      {/* Horizontal Scroll Filter Pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeCategoryFilter === cat ? 'var(--accent-primary)' : 'var(--border-color)',
              background: activeCategoryFilter === cat ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: activeCategoryFilter === cat ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {cat === 'ALL' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {/* Mobile Asset Cards Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          Menampilkan {filteredAssets.length} Aktiva
        </span>

        {hasPermission('all') && (
          <button className="btn btn-primary btn-sm" onClick={onAddNew} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            <Plus size={14} /> Tambah
          </button>
        )}
      </div>

      {/* Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredAssets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Aktiva tidak ditemukan.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const calc = calculateStraightLine(asset.cost, asset.salvageValue, asset.lifeYears, asset.purchaseDate);

            return (
              <div
                key={asset.id}
                className="glass-card"
                onClick={() => onSelectAsset(asset)}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  position: 'relative'
                }}
              >
                {/* Card Top Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    {asset.code}
                  </span>

                  <span className={`badge ${asset.condition === 'Baik' ? 'badge-success' : asset.condition === 'Perlu Perbaikan' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.7rem' }}>
                    {asset.condition}
                  </span>
                </div>

                {/* Card Title & Value */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                    {asset.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nilai Buku:</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>
                      {formatRupiah(calc.currentBookValue)}
                    </span>
                  </div>
                </div>

                {/* Location & Assignee */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={13} color="var(--accent-primary)" />
                    <span>{asset.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} color="var(--accent-secondary)" />
                    <span>{asset.assignee}</span>
                  </div>
                </div>

                {/* Card Footer Quick Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <QrCode size={14} /> Tap untuk detail & QR Tag
                  </span>
                  <ChevronRight size={16} />
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
