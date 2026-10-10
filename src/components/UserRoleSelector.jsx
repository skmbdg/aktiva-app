import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCheck, Smartphone } from 'lucide-react';

export default function UserRoleSelector() {
  const { currentRole, switchRole, USER_ROLES, currentUser } = useAuth();

  return (
    <div className="glass-card" style={{ padding: '12px 16px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent-primary)', objectFit: 'cover' }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{currentUser.name}</span>
            <span className="badge" style={{ backgroundColor: `${currentRole.badgeColor}22`, color: currentRole.badgeColor, border: `1px solid ${currentRole.badgeColor}55` }}>
              <Shield size={12} /> {currentRole.name}
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Simulasi Mode User:</span>
        <select
          className="form-control"
          value={currentRole.id}
          onChange={(e) => switchRole(e.target.value)}
          style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600', borderColor: currentRole.badgeColor }}
        >
          {USER_ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
