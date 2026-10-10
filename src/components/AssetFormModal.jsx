import React, { useState } from 'react';
import { CATEGORIES } from '../data/initialAssets';
import { PlusCircle, Edit3, X, Save } from 'lucide-react';

export default function AssetFormModal({ isOpen, onClose, onSave, editingAsset }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    code: editingAsset?.code || `AST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    name: editingAsset?.name || '',
    category: editingAsset?.category || CATEGORIES[0],
    purchaseDate: editingAsset?.purchaseDate || new Date().toISOString().substring(0, 10),
    cost: editingAsset?.cost || 10000000,
    salvageValue: editingAsset?.salvageValue || 1000000,
    lifeYears: editingAsset?.lifeYears || 5,
    location: editingAsset?.location || 'Lantai 1 - Ruang Operasional',
    assignee: editingAsset?.assignee || 'Staff Umum',
    condition: editingAsset?.condition || 'Baik',
    status: editingAsset?.status || 'Aktif',
    depreciationMethod: editingAsset?.depreciationMethod || 'straight_line',
    notes: editingAsset?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    onSave({
      ...formData,
      id: editingAsset?.id || `AKT-${Date.now()}`
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingAsset ? <Edit3 size={18} color="var(--accent-warning)" /> : <PlusCircle size={18} color="var(--accent-primary)" />}
            {editingAsset ? 'Edit Data Aktiva Tetap' : 'Tambah Aktiva Tetap Baru'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Kode Aktiva / Barcode:</label>
              <input
                type="text"
                name="code"
                className="form-control"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori Aktiva:</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Aktiva:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Contoh: MacBook Pro 16 inch M3"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Harga Perolehan (IDR):</label>
              <input
                type="number"
                name="cost"
                className="form-control"
                value={formData.cost}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nilai Residu (IDR):</label>
              <input
                type="number"
                name="salvageValue"
                className="form-control"
                value={formData.salvageValue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Umur Manfaat (Thn):</label>
              <input
                type="number"
                name="lifeYears"
                className="form-control"
                value={formData.lifeYears}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Tanggal Perolehan:</label>
              <input
                type="date"
                name="purchaseDate"
                className="form-control"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Metode Depresiasi:</label>
              <select name="depreciationMethod" className="form-control" value={formData.depreciationMethod} onChange={handleChange}>
                <option value="straight_line">Garis Lurus (Straight Line)</option>
                <option value="double_declining">Saldo Menurun Ganda</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Lokasi Fisik Aktiva:</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Penanggung Jawab (PJ):</label>
              <input
                type="text"
                name="assignee"
                className="form-control"
                value={formData.assignee}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Kondisi Fisik:</label>
              <select name="condition" className="form-control" value={formData.condition} onChange={handleChange}>
                <option value="Baik">Kondisi Baik</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status Operasional:</label>
              <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                <option value="Aktif">Aktif</option>
                <option value="Perbaikan">Dalam Perbaikan</option>
                <option value="Dihapuskan">Dihapuskan (Disposed)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Simpan Data Aktiva
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
