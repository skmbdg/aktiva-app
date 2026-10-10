import React from 'react';
import { calculateStraightLine, formatRupiah } from '../utils/depreciation';
import { QrCode, Printer, MapPin, User, Calendar, ShieldCheck, Tag } from 'lucide-react';

export default function AssetDetailModal({ asset, onClose }) {
  if (!asset) return null;

  const calc = calculateStraightLine(asset.cost, asset.salvageValue, asset.lifeYears, asset.purchaseDate);

  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '4px' }}>{asset.category}</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{asset.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Printable QR Code Card */}
          <div style={{ background: '#ffffff', color: '#000000', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px dashed #cbd5e1' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '800' }}>
                PROPERTY TAG - PERUSAHAAN
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-mono)', margin: '4px 0 2px' }}>
                {asset.code}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{asset.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {asset.location}</div>
            </div>

            {/* Simulated QR Code Box */}
            <div style={{ width: '80px', height: '80px', background: '#000', padding: '6px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={54} color="#fff" />
              <span style={{ color: '#fff', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>SCAN ME</span>
            </div>
          </div>

          {/* Asset Key Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-primary)', padding: '14px', borderRadius: '12px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Harga Perolehan</span>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{formatRupiah(asset.cost)}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nilai Buku Saat Ini</span>
              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--accent-secondary)' }}>{formatRupiah(calc.currentBookValue)}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Akumulasi Depresiasi</span>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--accent-warning)' }}>{formatRupiah(calc.accumulatedDepreciation)}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nilai Residu</span>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{formatRupiah(asset.salvageValue)}</div>
            </div>
          </div>

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Penanggung Jawab:</span>
              <span style={{ fontWeight: '600' }}>👤 {asset.assignee}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tanggal Perolehan:</span>
              <span style={{ fontWeight: '600' }}>📅 {asset.purchaseDate}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Kondisi Fisik:</span>
              <span className={`badge ${asset.condition === 'Baik' ? 'badge-success' : 'badge-warning'}`}>{asset.condition}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status Stock Opname Terakhir:</span>
              <span className="badge badge-success">✓ Terverifikasi ({asset.lastOpnameDate})</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="btn btn-secondary" onClick={handlePrintQR}>
              <Printer size={16} /> Cetak Label Tag
            </button>
            <button className="btn btn-primary" onClick={onClose}>Tutup</button>
          </div>

        </div>
      </div>
    </div>
  );
}
