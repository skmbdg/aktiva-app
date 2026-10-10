import React, { useState } from 'react';
import { calculateStraightLine, formatRupiah } from '../utils/depreciation';
import { CATEGORIES } from '../data/initialAssets';
import { Search, Filter, Plus, QrCode, Eye, Edit3, Trash2, Download, Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AssetListLaptop({ assets, onAddNew, onSelectAsset, onEditAsset, onDeleteAsset, onOpenExport }) {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCondition, setSelectedCondition] = useState('ALL');

  // Filtering
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.assignee.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || asset.category === selectedCategory;
    const matchesCondition = selectedCondition === 'ALL' || asset.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header Actions & Filters Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Cari Kode, Nama, Lokasi, atau PJ Aktiva..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="ALL">Semua Kategori ({assets.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="form-control"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="ALL">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Perlu Perbaikan">Perlu Perbaikan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={onOpenExport}>
            <Download size={15} /> Export / Cetak
          </button>
          
          {hasPermission('all') && (
            <button className="btn btn-primary btn-sm" onClick={onAddNew}>
              <Plus size={15} /> Tambah Aktiva
            </button>
          )}
        </div>

      </div>

      {/* Main Table for Laptop */}
      <div className="table-container glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Kode & Tag</th>
              <th>Nama Aktiva & Kategori</th>
              <th>Lokasi & Penanggung Jawab</th>
              <th>Tgl Beli</th>
              <th>Harga Perolehan</th>
              <th>Nilai Buku (Book Value)</th>
              <th>Kondisi & Status</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  Tidak ada data aktiva yang sesuai filter.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const calc = calculateStraightLine(asset.cost, asset.salvageValue, asset.lifeYears, asset.purchaseDate);
                
                return (
                  <tr key={asset.id}>
                    
                    {/* Kode & Barcode */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                          {asset.code}
                        </span>
                        <button
                          onClick={() => onSelectAsset(asset)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          title="Lihat QR Code"
                        >
                          <QrCode size={16} />
                        </button>
                      </div>
                    </td>

                    {/* Nama & Kategori */}
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{asset.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset.category}</div>
                    </td>

                    {/* Lokasi & PJ */}
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>📍 {asset.location}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>👤 {asset.assignee}</div>
                    </td>

                    {/* Tanggal Beli */}
                    <td style={{ fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                      {asset.purchaseDate}
                    </td>

                    {/* Harga Perolehan */}
                    <td style={{ fontWeight: '600' }}>
                      {formatRupiah(asset.cost)}
                    </td>

                    {/* Nilai Buku */}
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--accent-secondary)' }}>
                        {formatRupiah(calc.currentBookValue)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                        Depresiasi: {formatRupiah(calc.accumulatedDepreciation)}
                      </div>
                    </td>

                    {/* Kondisi & Status */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <span className={`badge ${asset.condition === 'Baik' ? 'badge-success' : asset.condition === 'Perlu Perbaikan' ? 'badge-warning' : 'badge-danger'}`}>
                          {asset.condition}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          {asset.status}
                        </span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectAsset(asset)}
                          title="Detail Aktiva"
                          style={{ padding: '6px' }}
                        >
                          <Eye size={15} />
                        </button>

                        {hasPermission('all') && (
                          <>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onEditAsset(asset)}
                              title="Edit Aktiva"
                              style={{ padding: '6px' }}
                            >
                              <Edit3 size={15} color="#f59e0b" />
                            </button>

                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => onDeleteAsset(asset.id)}
                              title="Hapus Aktiva"
                              style={{ padding: '6px' }}
                            >
                              <Trash2 size={15} color="#ef4444" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
