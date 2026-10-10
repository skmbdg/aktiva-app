import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ScanLine, CheckCircle, AlertOctagon, HelpCircle, Camera, Search, Filter, Plus, FileSpreadsheet, CheckCheck, RefreshCw, UserCheck } from 'lucide-react';

export default function StockOpnameModule({ opnameSessions, setOpnameSessions, assets, setAssets, onOpenScanner }) {
  const { currentRole, currentUser, hasPermission } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState(opnameSessions[0]?.id || 'OPN-2026-Q3');

  // Auditor Verification Modal Form state
  const [activeScanModal, setActiveScanModal] = useState(false);
  const [scanAssetCode, setScanAssetCode] = useState('');
  const [scanCondition, setScanCondition] = useState('Baik');
  const [scanLocation, setScanLocation] = useState('');
  const [scanNotes, setScanNotes] = useState('');
  const [scanStatusResult, setScanStatusResult] = useState('Match');

  const activeSession = opnameSessions.find(s => s.id === selectedSessionId) || opnameSessions[0];

  // Helper to handle Asset Lookup when auditor types or scans code
  const handleLookupAsset = (code) => {
    setScanAssetCode(code);
    const found = assets.find(a => a.code.toLowerCase() === code.toLowerCase() || a.id.toLowerCase() === code.toLowerCase());
    if (found) {
      setScanCondition(found.condition);
      setScanLocation(found.location);
    }
  };

  // Submit Opname Scan Verification
  const handleSubmitVerification = (e) => {
    e.preventDefault();
    if (!scanAssetCode) return;

    const targetAsset = assets.find(a => a.code.toLowerCase() === scanAssetCode.toLowerCase() || a.id.toLowerCase() === scanAssetCode.toLowerCase());
    
    if (!targetAsset) {
      alert('Kode Aktiva tidak ditemukan dalam database sistem!');
      return;
    }

    // Determine status (Match vs Discrepancy)
    const isConditionMatch = targetAsset.condition === scanCondition;
    const isLocationMatch = targetAsset.location.toLowerCase() === scanLocation.toLowerCase();
    const finalStatus = (isConditionMatch && isLocationMatch) ? 'Match' : 'Discrepancy';

    const newScanEntry = {
      assetId: targetAsset.id,
      assetCode: targetAsset.code,
      scannedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      scannedBy: currentUser.name,
      status: finalStatus,
      physicalCondition: scanCondition,
      physicalLocation: scanLocation,
      notesVerified: scanNotes || (finalStatus === 'Match' ? 'Verifikasi fisik sesuai.' : 'Ditemukan ketidaksesuaian fisik/lokasi.')
    };

    // Update Session Scans
    const updatedSessions = opnameSessions.map(session => {
      if (session.id === activeSession.id) {
        const existingScanIdx = session.scans.findIndex(s => s.assetId === targetAsset.id);
        let newScans = [...session.scans];
        if (existingScanIdx >= 0) {
          newScans[existingScanIdx] = newScanEntry;
        } else {
          newScans.push(newScanEntry);
        }

        const scannedCount = newScans.length;
        const matchedCount = newScans.filter(s => s.status === 'Match').length;
        const discrepancyCount = newScans.filter(s => s.status === 'Discrepancy').length;

        return {
          ...session,
          scannedCount,
          matchedCount,
          discrepancyCount,
          scans: newScans
        };
      }
      return session;
    });

    setOpnameSessions(updatedSessions);
    setActiveScanModal(false);
    setScanAssetCode('');
    setScanNotes('');
    alert(`Verifikasi Aktiva ${targetAsset.code} berhasil disimpan! Status: ${finalStatus}`);
  };

  // Admin Action: Approve & Sync Opname Results to Master Data
  const handleFinalizeOpname = () => {
    if (!confirm('Apakah Anda yakin ingin memfinalisasi Stock Opname ini dan memperbarui Master Data Aktiva otomatis?')) return;

    // Update Asset condition & location from opname scans
    let updatedAssets = [...assets];
    activeSession.scans.forEach(scan => {
      updatedAssets = updatedAssets.map(asset => {
        if (asset.id === scan.assetId) {
          return {
            ...asset,
            condition: scan.physicalCondition,
            location: scan.physicalLocation,
            lastOpnameDate: scan.scannedAt,
            lastOpnameStatus: scan.status
          };
        }
        return asset;
      });
    });

    setAssets(updatedAssets);

    // Close session
    const updatedSessions = opnameSessions.map(s => {
      if (s.id === activeSession.id) {
        return { ...s, status: 'Selesai' };
      }
      return s;
    });
    setOpnameSessions(updatedSessions);

    alert('Sesi Stock Opname berhasil difinalisasi! Master Data Aktiva telah diperbarui.');
  };

  const progressPercent = Math.round((activeSession.scannedCount / activeSession.totalTargetAssets) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Session Banner */}
      <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.05))', borderColor: 'var(--border-glow)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-success">Sesi Opname {activeSession.status}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {activeSession.id}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{activeSession.title}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              📅 Periode: {activeSession.startDate} s/d {activeSession.endDate} &bull; Auditor Lead: {activeSession.auditor}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Field Auditor Scan Action Button */}
            <button
              className="btn btn-primary"
              onClick={() => setActiveScanModal(true)}
              style={{ boxShadow: 'var(--shadow-glow)', background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Camera size={18} /> Input Scan Audit Lapangan
            </button>

            {hasPermission('all') && activeSession.status === 'Aktif' && (
              <button className="btn btn-secondary" onClick={handleFinalizeOpname}>
                <CheckCheck size={18} color="#10b981" /> Finalisasi & Update Master
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar & KPI Stats */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Audit</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{activeSession.totalTargetAssets} Aktiva</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Telah Terverifikasi</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{activeSession.scannedCount} ({progressPercent}%)</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sesuai (Match)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-success)' }}>{activeSession.matchedCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Selisih (Discrepancy)</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-warning)' }}>{activeSession.discrepancyCount}</div>
          </div>
        </div>

        {/* Progress Meter Bar */}
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', marginTop: '14px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #6366f1)', borderRadius: '4px' }}></div>
        </div>
      </div>

      {/* Audit Log Verification Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} color="var(--accent-primary)" /> Catatan Hasil Pemindaian Audit Lapangan ({activeSession.scans.length})
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kode Aktiva</th>
                <th>Waktu Scan</th>
                <th>Auditor Lapangan</th>
                <th>Kondisi Terverifikasi</th>
                <th>Lokasi Fisik Terverifikasi</th>
                <th>Status Rekonsiliasi</th>
                <th>Catatan Auditor</th>
              </tr>
            </thead>
            <tbody>
              {activeSession.scans.map((scan, idx) => {
                const asset = assets.find(a => a.id === scan.assetId);
                return (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-primary)' }}>
                      {scan.assetCode}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset?.name}</div>
                    </td>
                    <td style={{ fontSize: '0.8rem' }}>{scan.scannedAt}</td>
                    <td style={{ fontSize: '0.85rem' }}>{scan.scannedBy}</td>
                    <td>
                      <span className={`badge ${scan.physicalCondition === 'Baik' ? 'badge-success' : 'badge-warning'}`}>
                        {scan.physicalCondition}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>📍 {scan.physicalLocation}</td>
                    <td>
                      <span className={`badge ${scan.status === 'Match' ? 'badge-success' : 'badge-danger'}`}>
                        {scan.status === 'Match' ? '✓ Match (Cocok)' : '⚠️ Discrepancy (Selisih)'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{scan.notesVerified}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auditor Scan Modal Dialog */}
      {activeScanModal && (
        <div className="modal-overlay" onClick={() => setActiveScanModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="var(--accent-success)" /> Form Verifikasi Stock Opname
              </h3>
              <button onClick={() => setActiveScanModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleSubmitVerification} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div className="form-group">
                <label className="form-label">Pilih / Scan Kode Aktiva:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="form-control"
                    value={scanAssetCode}
                    onChange={(e) => handleLookupAsset(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Aktiva yang Sedang Diperiksa --</option>
                    {assets.map(a => (
                      <option key={a.id} value={a.code}>
                        {a.code} - {a.name} ({a.location})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      onOpenScanner();
                    }}
                    title="Buka Kamera QR Scanner"
                  >
                    <Camera size={16} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kondisi Fisik di Lapangan:</label>
                <select
                  className="form-control"
                  value={scanCondition}
                  onChange={(e) => setScanCondition(e.target.value)}
                >
                  <option value="Baik">Sangat Baik / Normal</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan (Minor Service)</option>
                  <option value="Rusak Berat">Rusak Berat / Non-Operasional</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lokasi Fisik Terverifikasi:</label>
                <input
                  type="text"
                  className="form-control"
                  value={scanLocation}
                  onChange={(e) => setScanLocation(e.target.value)}
                  placeholder="Misal: Lantai 3 Ruang IT"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan Auditor Lapangan:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={scanNotes}
                  onChange={(e) => setScanNotes(e.target.value)}
                  placeholder="Contoh: Fisik terawat, stiker barcode bersih, nomor seri cocok."
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveScanModal(false)}>Batal</button>
                <button type="submit" className="btn btn-success">Simpan Verifikasi Scan</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
