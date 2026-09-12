import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, ShieldCheck, UserCheck, LogOut, ChevronDown, User } from 'lucide-react';

export default function Header({ currentTab, setCurrentTab }) {
  const { currentUser, switchRole, logout, allUsers } = useAuth();

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div className="logo-glowing-ring" style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          border: '2px solid #10b981'
        }}>
          <img 
            src="https://collegetransport-p9yg.vercel.app/logo.png" 
            alt="SVGI Logo" 
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
          />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.15rem', color: 'var(--accent-slate)', lineHeight: 1.1 }}>
            SVGI EXAM
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            Shree Venkateshwara Group of Institutions
          </div>
        </div>
      </div>

      {/* User Profile Card & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src={currentUser?.avatar} 
            alt={currentUser?.name} 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-100)' }} 
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {currentUser?.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className={`badge ${
                currentUser?.role === 'STUDENT' ? 'badge-blue' :
                currentUser?.role === 'FACULTY' ? 'badge-purple' :
                currentUser?.role === 'HOD' ? 'badge-green' : 'badge-yellow'
              }`}>
                {currentUser?.role}
              </span>
              <span>• {currentUser?.department}</span>
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout of Account"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #fee2e2',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              fontSize: '0.8rem',
              fontWeight: '700',
              marginLeft: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
