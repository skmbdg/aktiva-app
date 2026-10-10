import React, { useState, useEffect } from 'react';
import { Camera, QrCode, CheckCircle, Search, RefreshCw } from 'lucide-react';

export default function ScannerModal({ isOpen, onClose, assets, onScanSuccess }) {
  if (!isOpen) return null;

  const [selectedSimulatedCode, setSelectedSimulatedCode] = useState(assets[0]?.code || '');
  const [isScanning, setIsScanning] = useState(true);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const found = assets.find(a => a.code === selectedSimulatedCode || a.id === selectedSimulatedCode);
      if (found) {
        onScanSuccess(found);
      }
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', background: '#090d16' }}>
        
        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={18} color="var(--accent-success)" /> Pemindai Barcode / QR Aktiva
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
        </div>

        {/* Camera Scanner View Simulation */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          
          <div style={{ width: '260px', height: '260px', background: '#000', border: '2px dashed var(--accent-primary)', borderRadius: '20px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)' }}>
            
            {/* Animated Laser Scanning Line */}
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '2px', background: '#10b981', boxShadow: '0 0 10px #10b981', animation: 'scanLine 2s infinite ease-in-out' }}></div>

            <QrCode size={120} color="rgba(255,255,255,0.7)" />

            <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Arahkan Kamera ke Barcode Aktiva
            </div>
          </div>

          <style>{`
            @keyframes scanLine {
              0% { top: 10%; }
              50% { top: 90%; }
              100% { top: 10%; }
            }
          `}</style>

          {/* Quick Select Barcode Simulator */}
          <div style={{ width: '100%' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Simulasi Temuan Barcode Kamera:</label>
            <select
              className="form-control"
              value={selectedSimulatedCode}
              onChange={(e) => setSelectedSimulatedCode(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              {assets.map(a => (
                <option key={a.id} value={a.code}>
                  📷 [{a.code}] {a.name} ({a.location})
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-success" onClick={handleSimulateScan} style={{ width: '100%', padding: '12px' }}>
            <CheckCircle size={18} /> Verifikasi Barcode Ini
          </button>

        </div>
      </div>
    </div>
  );
}
