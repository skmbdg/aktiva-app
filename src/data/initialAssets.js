/**
 * Sample initial data for Aktiva Tetap & Stock Opname Sessions
 */

export const INITIAL_ASSETS = [
  {
    id: 'AKT-001',
    code: 'AST-2024-001',
    name: 'MacBook Pro M3 Max 16 inch',
    category: 'IT Hardware',
    purchaseDate: '2024-01-15',
    cost: 48500000,
    salvageValue: 5000000,
    lifeYears: 4,
    location: 'Lantai 3 - Ruang IT Core',
    assignee: 'Budi Santoso (Lead Dev)',
    condition: 'Baik', // Baik, Perlu Perbaikan, Rusak Berat
    status: 'Aktif', // Aktif, Perbaikan, Dihapuskan
    lastOpnameDate: '2026-06-15',
    lastOpnameStatus: 'Match', // Match, Discrepancy, Missing
    depreciationMethod: 'straight_line',
    notes: 'Laptop utama pengembangan sistem core.'
  },
  {
    id: 'AKT-002',
    code: 'AST-2023-088',
    name: 'Toyota Avanza Veloz 1.5 CVT',
    category: 'Kendaraan',
    purchaseDate: '2023-05-10',
    cost: 295000000,
    salvageValue: 80000000,
    lifeYears: 8,
    location: 'Parkiran Gedung Utama - Slot B2',
    assignee: 'Tim Operasional Kantor',
    condition: 'Baik',
    status: 'Aktif',
    lastOpnameDate: '2026-06-15',
    lastOpnameStatus: 'Match',
    depreciationMethod: 'straight_line',
    notes: 'Mobil operasional kurir & perjalanan dinas.'
  },
  {
    id: 'AKT-003',
    code: 'AST-2022-014',
    name: 'Server Rack Dell PowerEdge R750',
    category: 'IT Hardware',
    purchaseDate: '2022-09-01',
    cost: 135000000,
    salvageValue: 10000000,
    lifeYears: 5,
    location: 'Lantai 2 - Server Room A',
    assignee: 'Rian Hidayat (SysAdmin)',
    condition: 'Baik',
    status: 'Aktif',
    lastOpnameDate: '2026-06-15',
    lastOpnameStatus: 'Match',
    depreciationMethod: 'double_declining',
    notes: 'Primary database server & internal storage.'
  },
  {
    id: 'AKT-004',
    code: 'AST-2021-045',
    name: 'Genset Silent Perkins 50 kVA',
    category: 'Mesin & Peralatan',
    purchaseDate: '2021-03-20',
    cost: 185000000,
    salvageValue: 25000000,
    lifeYears: 10,
    location: 'Area Utility Belakang',
    assignee: 'Bambang (Building Manager)',
    condition: 'Perlu Perbaikan',
    status: 'Perbaikan',
    lastOpnameDate: '2026-07-01',
    lastOpnameStatus: 'Discrepancy',
    depreciationMethod: 'straight_line',
    notes: 'Oli perlu diganti & modul panel kontrol di-service.'
  },
  {
    id: 'AKT-005',
    code: 'AST-2025-012',
    name: 'Ergonomic Mesh Chair Herman Miller',
    category: 'Furnitur Kantor',
    purchaseDate: '2025-02-14',
    cost: 19500000,
    salvageValue: 2000000,
    lifeYears: 5,
    location: 'Lantai 4 - Ruang Direksi',
    assignee: 'Siti Aminah (Direktur Utama)',
    condition: 'Baik',
    status: 'Aktif',
    lastOpnameDate: '2026-06-15',
    lastOpnameStatus: 'Match',
    depreciationMethod: 'straight_line',
    notes: 'Kursi kerja ergonomis executive.'
  },
  {
    id: 'AKT-006',
    code: 'AST-2024-102',
    name: 'Smart TV Samsung 75 inch QLED',
    category: 'Elektronik',
    purchaseDate: '2024-06-01',
    cost: 24000000,
    salvageValue: 3000000,
    lifeYears: 4,
    location: 'Lantai 3 - Ruang Rapat Utama',
    assignee: 'Sekretaris Direksi',
    condition: 'Baik',
    status: 'Aktif',
    lastOpnameDate: '2026-06-15',
    lastOpnameStatus: 'Match',
    depreciationMethod: 'straight_line',
    notes: 'Layar presentasi rapat direksi & klien.'
  },
  {
    id: 'AKT-007',
    code: 'AST-2020-009',
    name: 'AC Heavy Duty Daikin 5 PK Cassette',
    category: 'Mesin & Peralatan',
    purchaseDate: '2020-11-10',
    cost: 32000000,
    salvageValue: 4000000,
    lifeYears: 6,
    location: 'Lantai 1 - Hall Lobby',
    assignee: 'Tim Facility',
    condition: 'Rusak Berat',
    status: 'Perbaikan',
    lastOpnameDate: '2026-07-20',
    lastOpnameStatus: 'Discrepancy',
    depreciationMethod: 'straight_line',
    notes: 'Kompresor mati, dalam pengajuan sparepart.'
  },
  {
    id: 'AKT-008',
    code: 'AST-2023-055',
    name: 'Printer High Speed Epson WorkForce',
    category: 'IT Hardware',
    purchaseDate: '2023-10-05',
    cost: 14500000,
    salvageValue: 1500000,
    lifeYears: 3,
    location: 'Lantai 2 - Area Finance',
    assignee: 'Dewi (Finance Staff)',
    condition: 'Baik',
    status: 'Aktif',
    lastOpnameDate: '2026-06-15',
    lastOpnameStatus: 'Match',
    depreciationMethod: 'straight_line',
    notes: 'Printer cetak faktur & dokumen keuangan.'
  }
];

export const INITIAL_OPNAME_SESSIONS = [
  {
    id: 'OPN-2026-Q3',
    title: 'Stock Opname Q3 2026 - Seluruh Gedung Pusat',
    startDate: '2026-07-25',
    endDate: '2026-08-05',
    status: 'Aktif', // Aktif, Selesai, Draft
    targetLocation: 'Semua Lokasi',
    totalTargetAssets: 8,
    scannedCount: 5,
    matchedCount: 4,
    discrepancyCount: 1,
    missingCount: 0,
    auditor: 'Agus Pratama (Auditor Internal)',
    notes: 'Audit tahunan verifikasi aktiva fisik dan kondisi operasional.',
    scans: [
      {
        assetId: 'AKT-001',
        assetCode: 'AST-2024-001',
        scannedAt: '2026-07-28 10:15',
        scannedBy: 'Agus Pratama (Auditor)',
        status: 'Match',
        physicalCondition: 'Baik',
        physicalLocation: 'Lantai 3 - Ruang IT Core',
        notesVerified: 'Fisik dan barcode dalam kondisi baik.'
      },
      {
        assetId: 'AKT-002',
        assetCode: 'AST-2023-088',
        scannedAt: '2026-07-28 11:30',
        scannedBy: 'Agus Pratama (Auditor)',
        status: 'Match',
        physicalCondition: 'Baik',
        physicalLocation: 'Parkiran Gedung Utama - Slot B2',
        notesVerified: 'KM terdata 42.100 km, STNK aktif.'
      },
      {
        assetId: 'AKT-003',
        assetCode: 'AST-2022-014',
        scannedAt: '2026-07-29 09:40',
        scannedBy: 'Agus Pratama (Auditor)',
        status: 'Match',
        physicalCondition: 'Baik',
        physicalLocation: 'Lantai 2 - Server Room A',
        notesVerified: 'Lampu indikator normal, tag terpasang.'
      },
      {
        assetId: 'AKT-004',
        assetCode: 'AST-2021-045',
        scannedAt: '2026-07-29 14:20',
        scannedBy: 'Agus Pratama (Auditor)',
        status: 'Discrepancy',
        physicalCondition: 'Perlu Perbaikan',
        physicalLocation: 'Area Utility Belakang',
        notesVerified: 'Status di sistem Aktif, namun kondisi di lapangan perlu perbaikan panel.'
      },
      {
        assetId: 'AKT-005',
        assetCode: 'AST-2025-012',
        scannedAt: '2026-07-30 08:50',
        scannedBy: 'Agus Pratama (Auditor)',
        status: 'Match',
        physicalCondition: 'Baik',
        physicalLocation: 'Lantai 4 - Ruang Direksi',
        notesVerified: 'Fisik sangat mulus.'
      }
    ]
  }
];

export const CATEGORIES = [
  'IT Hardware',
  'Kendaraan',
  'Mesin & Peralatan',
  'Furnitur Kantor',
  'Elektronik',
  'Bangunan & Renovasi',
  'Lainnya'
];

export const USER_ROLES = [
  {
    id: 'admin',
    name: 'Admin / Manajer Keuangan',
    description: 'Akses Penuh: Master Data, Depresiasi, Kelola Opname, Approval & Export.',
    badgeColor: '#6366f1',
    permissions: ['all']
  },
  {
    id: 'auditor',
    name: 'Auditor Lapangan (Stock Opname)',
    description: 'Mode Fokus HP: Scan QR/Barcode, Verifikasi Fisik & Kondisi Aktiva di Lapangan.',
    badgeColor: '#10b981',
    permissions: ['scan_opname', 'verify_asset', 'view_assets']
  },
  {
    id: 'staff',
    name: 'Staff / Pemegang Aktiva',
    description: 'Akses Terbatas: Melihat aktiva yang ditugaskan & laporan perbaikan.',
    badgeColor: '#f59e0b',
    permissions: ['view_assigned_assets', 'request_maintenance']
  }
];
