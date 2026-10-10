import React, { useState } from 'react';
import { calculateStraightLine, calculateDoubleDeclining, generateDepreciationSchedule, formatRupiah } from '../utils/depreciation';
import { Calculator, TrendingDown, Calendar, DollarSign, RefreshCw } from 'lucide-react';

export default function DepreciationView({ assets }) {
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [method, setMethod] = useState('straight_line');

  // Custom inputs if no asset selected or to override
  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  const [cost, setCost] = useState(selectedAsset?.cost || 50000000);
  const [salvage, setSalvage] = useState(selectedAsset?.salvageValue || 5000000);
  const [lifeYears, setLifeYears] = useState(selectedAsset?.lifeYears || 5);
  const [purchaseDate, setPurchaseDate] = useState(selectedAsset?.purchaseDate || '2024-01-01');

  // Handle Asset Dropdown Switch
  const handleSelectAssetChange = (assetId) => {
    setSelectedAssetId(assetId);
    const found = assets.find(a => a.id === assetId);
    if (found) {
      setCost(found.cost);
      setSalvage(found.salvageValue);
      setLifeYears(found.lifeYears);
      setPurchaseDate(found.purchaseDate);
      setMethod(found.depreciationMethod || 'straight_line');
    }
  };

  const straightCalc = calculateStraightLine(cost, salvage, lifeYears, purchaseDate);
  const doubleCalc = calculateDoubleDeclining(cost, salvage, lifeYears, purchaseDate);
  const schedule = generateDepreciationSchedule(cost, salvage, lifeYears, purchaseDate, method);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Title Header */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={22} color="var(--accent-primary)" /> Kalkulator Depresiasi & Jadwal Penyusutan Aktiva
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Simulasikan penghitungan nilai depresiasi aktiva tetap menggunakan Metode Garis Lurus (*Straight-Line*) atau Saldo Menurun Ganda (*Double Declining*).
        </p>

        {/* Asset Selector */}
        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <label className="form-label">Pilih Aktiva dari Database:</label>
            <select
              className="form-control"
              value={selectedAssetId}
              onChange={(e) => handleSelectAssetChange(e.target.value)}
            >
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  {a.code} - {a.name} ({formatRupiah(a.cost)})
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '180px' }}>
            <label className="form-label">Metode Penyusutan:</label>
            <select
              className="form-control"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="straight_line">Garis Lurus (Straight Line)</option>
              <option value="double_declining">Saldo Menurun Ganda</option>
            </select>
          </div>
        </div>
      </div>

      {/* Input Parameters & Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        
        {/* Cost & Parameters Panel */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
            Parameter Nilai Perolehan
          </h3>

          <div className="form-group">
            <label className="form-label">Harga Perolehan (Cost):</label>
            <input
              type="number"
              className="form-control"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nilai Residu (Salvage Value):</label>
            <input
              type="number"
              className="form-control"
              value={salvage}
              onChange={(e) => setSalvage(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Umur Manfaat (Tahun):</label>
            <input
              type="number"
              className="form-control"
              value={lifeYears}
              onChange={(e) => setLifeYears(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Calculation Result Panel */}
        <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.05))' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
              Penyusutan Tahunan ({method === 'straight_line' ? 'Garis Lurus' : 'Saldo Menurun'})
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '4px' }}>
              {formatRupiah(straightCalc.annualDepreciation)} / thn
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              (Sekitar {formatRupiah(straightCalc.monthlyDepreciation)} / bulan)
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Akumulasi Depresiasi Saat Ini:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-warning)' }}>
                {formatRupiah(method === 'straight_line' ? straightCalc.accumulatedDepreciation : doubleCalc.accumulatedDepreciation)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Nilai Buku Saat Ini:</span>
              <span style={{ fontWeight: '800', color: 'var(--accent-secondary)' }}>
                {formatRupiah(method === 'straight_line' ? straightCalc.currentBookValue : doubleCalc.currentBookValue)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Depreciation Schedule Table */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={18} color="var(--accent-secondary)" /> Tabel Jadwal Penyusutan (Depreciation Schedule)
        </h3>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tahun Ke</th>
                <th>Tahun</th>
                <th>Nilai Buku Awal</th>
                <th>Beban Depresiasi</th>
                <th>Akumulasi Depresiasi</th>
                <th>Nilai Buku Akhir</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.yearIndex}>
                  <td style={{ fontWeight: '700' }}>Tahun {row.yearIndex}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{row.year}</td>
                  <td>{formatRupiah(row.beginningBookValue)}</td>
                  <td style={{ color: 'var(--accent-warning)', fontWeight: '600' }}>
                    - {formatRupiah(row.depreciationExpense)}
                  </td>
                  <td style={{ color: 'var(--accent-primary)' }}>{formatRupiah(row.accumulatedDepreciation)}</td>
                  <td style={{ fontWeight: '800', color: 'var(--accent-secondary)' }}>
                    {formatRupiah(row.endingBookValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
