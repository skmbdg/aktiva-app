import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { INITIAL_ASSETS, INITIAL_OPNAME_SESSIONS } from './data/initialAssets';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UserRoleSelector from './components/UserRoleSelector';
import Dashboard from './components/Dashboard';
import AssetListLaptop from './components/AssetListLaptop';
import AssetListMobile from './components/AssetListMobile';
import StockOpnameModule from './components/StockOpnameModule';
import DepreciationView from './components/DepreciationView';

import AssetFormModal from './components/AssetFormModal';
import AssetDetailModal from './components/AssetDetailModal';
import ScannerModal from './components/ScannerModal';
import ExportReportModal from './components/ExportReportModal';

import { LayoutDashboard, Layers, ScanLine, Calculator, Camera } from 'lucide-react';

function AppContent() {
  // Persistence state in LocalStorage
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('aktiva_assets_data');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [opnameSessions, setOpnameSessions] = useState(() => {
    const saved = localStorage.getItem('aktiva_opname_sessions');
    return saved ? JSON.parse(saved) : INITIAL_OPNAME_SESSIONS;
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, assets, opname, depreciation
  const [deviceMode, setDeviceMode] = useState('laptop'); // laptop, mobile
  const [theme, setTheme] = useState('dark');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aktiva_assets_data', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('aktiva_opname_sessions', JSON.stringify(opnameSessions));
  }, [opnameSessions]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Asset Actions
  const handleSaveAsset = (assetData) => {
    if (editingAsset) {
      setAssets(prev => prev.map(a => a.id === assetData.id ? assetData : a));
    } else {
      setAssets(prev => [assetData, ...prev]);
    }
    setIsFormModalOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (assetId) => {
    if (confirm('Apakah Anda yakin ingin menghapus data aktiva ini?')) {
      setAssets(prev => prev.filter(a => a.id !== assetId));
    }
  };

  const handleScanSuccess = (scannedAsset) => {
    setIsScannerOpen(false);
    setSelectedAsset(scannedAsset);
    setIsDetailModalOpen(true);
  };

  // Content Views Renderer
  const renderMainView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            assets={assets}
            opnameSessions={opnameSessions}
            setActiveTab={setActiveTab}
          />
        );
      case 'assets':
        return deviceMode === 'laptop' ? (
          <AssetListLaptop
            assets={assets}
            onAddNew={() => { setEditingAsset(null); setIsFormModalOpen(true); }}
            onSelectAsset={(asset) => { setSelectedAsset(asset); setIsDetailModalOpen(true); }}
            onEditAsset={(asset) => { setEditingAsset(asset); setIsFormModalOpen(true); }}
            onDeleteAsset={handleDeleteAsset}
            onOpenExport={() => setIsExportOpen(true)}
          />
        ) : (
          <AssetListMobile
            assets={assets}
            onAddNew={() => { setEditingAsset(null); setIsFormModalOpen(true); }}
            onSelectAsset={(asset) => { setSelectedAsset(asset); setIsDetailModalOpen(true); }}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        );
      case 'opname':
        return (
          <StockOpnameModule
            opnameSessions={opnameSessions}
            setOpnameSessions={setOpnameSessions}
            assets={assets}
            setAssets={setAssets}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        );
      case 'depreciation':
        return <DepreciationView assets={assets} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        theme={theme}
        setTheme={setTheme}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Layout Container */}
      {deviceMode === 'laptop' ? (
        
        /* ---------------- LAPTOP / DESKTOP VIEW ---------------- */
        <div style={{ display: 'flex', flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '20px' }}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddNewAsset={() => { setEditingAsset(null); setIsFormModalOpen(true); }}
          />

          <main style={{ flex: 1, minWidth: 0, paddingLeft: '16px' }}>
            {/* User Role Switcher Bar */}
            <UserRoleSelector />
            
            {/* Active Content */}
            {renderMainView()}
          </main>
        </div>

      ) : (

        /* ---------------- MOBILE (HP) SIMULATOR FRAME VIEW ---------------- */
        <div className="simulator-container">
          <div className="mobile-frame">
            <div className="iphone-notch">
              <div className="camera-lens"></div>
            </div>

            {/* Simulated Phone Screen */}
            <div className="mobile-screen">
              
              {/* Phone Header */}
              <div style={{ padding: '0 14px 10px' }}>
                <UserRoleSelector />
              </div>

              {/* Mobile Active View */}
              <div style={{ padding: '0 14px 20px' }}>
                {renderMainView()}
              </div>

              {/* Mobile Bottom Navigation Bar */}
              <nav className="mobile-bottom-nav">
                <button
                  className={`nav-item-mobile ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </button>

                <button
                  className={`nav-item-mobile ${activeTab === 'assets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('assets')}
                >
                  <Layers size={20} />
                  <span>Aktiva</span>
                </button>

                {/* Floating Scan Button */}
                <button
                  className="nav-item-mobile"
                  onClick={() => setIsScannerOpen(true)}
                  style={{ color: '#10b981' }}
                >
                  <Camera size={22} />
                  <span style={{ fontWeight: '700' }}>Scan QR</span>
                </button>

                <button
                  className={`nav-item-mobile ${activeTab === 'opname' ? 'active' : ''}`}
                  onClick={() => setActiveTab('opname')}
                >
                  <ScanLine size={20} />
                  <span>Opname</span>
                </button>

                <button
                  className={`nav-item-mobile ${activeTab === 'depreciation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('depreciation')}
                >
                  <Calculator size={20} />
                  <span>Depresiasi</span>
                </button>
              </nav>

            </div>

            <div className="mobile-home-bar"></div>
          </div>
        </div>

      )}

      {/* Global Modals */}
      <AssetFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveAsset}
        editingAsset={editingAsset}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        assets={assets}
        onScanSuccess={handleScanSuccess}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        assets={assets}
        opnameSessions={opnameSessions}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
