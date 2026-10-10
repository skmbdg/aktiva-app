import React from 'react';
import { calculateStraightLine, formatRupiah } from '../utils/depreciation';
import { DollarSign, TrendingDown, Layers, ScanLine, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard({ assets, opnameSessions, setActiveTab }) {
  // Calculate Portfolio Totals
  let totalCost = 0;
  let totalBookValue = 0;
  let totalAccumDep = 0;

  const categoryCounts = {};
  const conditionCounts = { Baik: 0, 'Perlu Perbaikan': 0, 'Rusak Berat': 0 };

  assets.forEach((asset) => {
    totalCost += Number(asset.cost) || 0;
    const calc = calculateStraightLine(asset.cost, asset.salvageValue, asset.lifeYears, asset.purchaseDate);
    totalBookValue += calc.currentBookValue;
    totalAccumDep += calc.accumulatedDepreciation;

    // Categories count
    categoryCounts[asset.category] = (categoryCounts[asset.category] || 0) + 1;

    // Conditions count
    if (conditionCounts[asset.condition] !== undefined) {
      conditionCounts[asset.condition] += 1;
    }
  });

  const activeOpname = opnameSessions.find(s => s.status === 'Aktif') || opnameSessions[0];
  const opnamePercent = activeOpname ? Math.round((activeOpname.scannedCount / activeOpname.totalTargetAssets) * 100) : 0;

  // Chart Data - Doughnut Kategori
  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart Data - Bar Kondisi
  const conditionChartData = {
    labels: ['Kondisi Baik', 'Perlu Perbaikan', 'Rusak Berat'],
    datasets: [
      {
        label: 'Jumlah Aktiva',
        data: [conditionCounts['Baik'], conditionCounts['Perlu Perbaikan'], conditionCounts['Rusak Berat']],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Metrics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Metric 1: Total Perolehan */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Harga Perolehan</span>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '10px', color: 'var(--accent-primary)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', tracking: '-0.02em', color: 'var(--text-main)' }}>
            {formatRupiah(totalCost)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Dari {assets.length} Aktiva Tetap</span>
        </div>

        {/* Metric 2: Total Nilai Buku */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Nilai Buku Saat Ini</span>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '8px', borderRadius: '10px', color: 'var(--accent-secondary)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>
            {formatRupiah(totalBookValue)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)' }}>
            {((totalBookValue / (totalCost || 1)) * 100).toFixed(1)}% dari Nilai Asli
          </span>
        </div>

        {/* Metric 3: Total Akumulasi Penyusutan */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Akumulasi Penyusutan</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '8px', borderRadius: '10px', color: 'var(--accent-warning)' }}>
              <TrendingDown size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-warning)' }}>
            {formatRupiah(totalAccumDep)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Terganti Secara Bertahap</span>
        </div>

        {/* Metric 4: Progress Stock Opname */}
        <div 
          className="glass-card" 
          style={{ padding: '18px', cursor: 'pointer', borderColor: 'var(--accent-primary)' }}
          onClick={() => setActiveTab('opname')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status Stock Opname</span>
            <div className="pulse-active" style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px', color: 'var(--accent-success)' }}>
              <ScanLine size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-success)' }}>{opnamePercent}%</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({activeOpname?.scannedCount}/{activeOpname?.totalTargetAssets} Scanned)</span>
          </div>
          {/* Progress Bar */}
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-primary)', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${opnamePercent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: '4px' }}></div>
          </div>
        </div>

      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Chart 1: Kategori */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-primary)" /> Distribusi Kategori Aktiva
          </h3>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Doughnut data={categoryChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } } } }} />
          </div>
        </div>

        {/* Chart 2: Kondisi Fisik */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--accent-warning)" /> Kondisi Fisik Lapangan
          </h3>
          <div style={{ height: '220px' }}>
            <Bar data={conditionChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { display: false } }, y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
          </div>
        </div>

      </div>

      {/* Opname Discrepancy & Perhatian Khusus */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--accent-warning)" /> Aktiva Memerlukan Perhatian Khusus
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('assets')}>
            Lihat Semua Aktiva
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {assets.filter(a => a.condition !== 'Baik' || a.status !== 'Aktif').map((asset) => (
            <div key={asset.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: asset.condition === 'Rusak Berat' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: asset.condition === 'Rusak Berat' ? '#ef4444' : '#f59e0b' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{asset.name} ({asset.code})</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {asset.location} &bull; PJ: {asset.assignee}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`badge ${asset.condition === 'Rusak Berat' ? 'badge-danger' : 'badge-warning'}`}>
                  {asset.condition}
                </span>
                <span className="badge badge-neutral">
                  {asset.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
