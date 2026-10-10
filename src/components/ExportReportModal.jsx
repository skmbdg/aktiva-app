import React from 'react';
import { calculateStraightLine, formatRupiah } from '../utils/depreciation';
import { Download, Printer, FileSpreadsheet, X } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, assets, opnameSessions }) {
  if (!isOpen) return null;

  // Export Assets to CSV File
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Kode Barcode,Nama Aktiva,Kategori,Tgl Perolehan,Harga Perolehan,Nilai Buku,Lokasi,Penanggung Jawab,Kondisi,Status\n";

    assets.forEach(a => {
      const calc = calculateStraightLine(a.cost, a.salvageValue, a.lifeYears, a.purchaseDate);
      const row = [
        a.id,
        a.code,
        `"${a.name}"`,
        `"${a.category}"`,
        a.purchaseDate,
        a.cost,
        calc.currentBookValue,
        `"${a.location}"`,
        `"${a.assignee}"`,
        a.condition,
        a.status
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Aktiva_Tetap_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={20} color="var(--accent-primary)" /> Export & Cetak Laporan Aktiva
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            
            {/* CSV Option */}
            <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px', width: 'fit-content', color: '#10b981' }}>
                <Download size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Export ke File CSV / Excel</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Unduh seluruh daftar aktiva lengkap beserta harga perolehan & kalkulasi nilai buku untuk diolah di Microsoft Excel.
              </p>
              <button className="btn btn-success btn-sm" onClick={handleExportCSV} style={{ marginTop: 'auto' }}>
                Unduh Spreadsheet CSV
              </button>
            </div>

            {/* Print Option */}
            <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '10px', borderRadius: '10px', width: 'fit-content', color: 'var(--accent-primary)' }}>
                <Printer size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Cetak Dokumen Laporan PDF</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Cetak laporan format resmi beserta ringkasan eksekutif untuk arsip keuangan atau audit internal.
              </p>
              <button className="btn btn-primary btn-sm" onClick={handlePrint} style={{ marginTop: 'auto' }}>
                Buka Tampilan Cetak
              </button>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn btn-secondary" onClick={onClose}>Tutup</button>
          </div>

        </div>
      </div>
    </div>
  );
}
