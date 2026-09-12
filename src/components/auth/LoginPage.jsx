import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff,
  X,
  ShieldCheck
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // SVGI Logo PNG from CTM
  const logoUrl = 'https://collegetransport-p9yg.vercel.app/logo.png';
  // Campus Students Background Image from public directory
  const campusBgUrl = '/campus_students.png';

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameInput.trim()) {
      setErrorMessage('Please enter your Username or Roll Number.');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(usernameInput.trim());
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      // Campus Image Background with Dark Overlay Shade
      backgroundImage: `linear-gradient(135deg, rgba(6, 78, 59, 0.88) 0%, rgba(4, 120, 87, 0.82) 40%, rgba(15, 23, 42, 0.92) 100%), url("${campusBgUrl}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden'
    }}>
      {/* 1. Top Red Ticker Slider */}
      <div style={{
        background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
        padding: '0.45rem 1rem',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
        zIndex: 30
      }}>
        <div style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          width: '100%',
          animation: 'marqueeText 26s linear infinite'
        }}>
          <span style={{
            color: '#ffffff',
            fontWeight: '900',
            letterSpacing: '0.07em',
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ● SVGI EXAM • SHREE VENKATESHWARA GROUP OF INSTITUTIONS • GOBICHETTIPALAYAM • OFFICIAL ONLINE CBT EXAMINATION PORTAL • UNIT TESTS, MODEL EXAMS & SEMESTER ASSESSMENTS
          </span>
        </div>
      </div>

      {/* 2. Top Header Navigation Bar */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="logo-glowing-ring" style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            border: '2px solid #10b981'
          }}>
            <img 
              src={logoUrl} 
              alt="SVGI Logo" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: '#d1fae5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '0.68rem',
                fontWeight: '900',
                padding: '0.15rem 0.6rem',
                borderRadius: '12px',
                letterSpacing: '0.04em'
              }}>
                ● SVGI • GOBI
              </span>
              <span style={{ color: '#475569', fontWeight: '700', fontSize: '0.74rem' }}>
                Gobichettipalayam, Erode Dist.
              </span>
            </div>
            <div style={{
              fontWeight: '900',
              color: '#065f46',
              letterSpacing: '0.01em',
              fontSize: '1.25rem',
              lineHeight: 1.2,
              marginTop: '0.15rem'
            }}>
              SHREE VENKATESHWARA GROUP OF INSTITUTIONS
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Center Split Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '920px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          border: '1px solid rgba(255, 255, 255, 0.4)'
        }}>

          {/* LEFT SIDE: CLEAN EMBLEM PANEL */}
          <div style={{
            flex: '0.9',
            minWidth: '280px',
            background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(4, 120, 87, 0.95) 60%, rgba(5, 150, 105, 0.95) 100%)',
            color: '#ffffff',
            padding: '3.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div className="logo-glowing-ring" style={{
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.7)',
              marginBottom: '1.5rem'
            }}>
              <img 
                src={logoUrl} 
                alt="SVGI Logo" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', lineHeight: 1.1, marginBottom: '0.5rem' }}>
              SVGI EXAM
            </h1>

            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#d1fae5',
              fontSize: '0.78rem',
              fontWeight: '800',
              padding: '0.3rem 0.85rem',
              borderRadius: '20px',
              letterSpacing: '0.03em'
            }}>
              Shree Venkateshwara Group of Institutions
            </span>
          </div>

          {/* RIGHT SIDE: UNIFIED SINGLE LOGIN FORM (NO ROLE TABS) */}
          <div style={{
            flex: '1',
            minWidth: '320px',
            padding: '3.5rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#ffffff'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
                <ShieldCheck size={16} />
                <span>Portal Authentication</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginBottom: '0.35rem' }}>
                Account Login
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Enter your institutional username or roll number and password.
              </p>
            </div>

            {/* Error Banner if any */}
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                padding: '0.75rem 0.9rem',
                borderRadius: '12px',
                fontSize: '0.84rem',
                marginBottom: '1.25rem'
              }}>
                <AlertCircle size={17} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Smart Unified Login Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{
                  color: '#1e293b',
                  fontWeight: '800',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.45rem',
                  fontSize: '0.78rem'
                }}>
                  Username / Roll Number
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#059669" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter your Roll No or Username"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem 0.75rem 2.6rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{
                  color: '#1e293b',
                  fontWeight: '800',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.45rem',
                  fontSize: '0.78rem'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#059669" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      outline: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#059669', cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span style={{ color: '#475569', fontSize: '0.84rem', fontWeight: '700' }}>
                    Keep Me Logged In
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.88rem',
                  fontSize: '1.02rem',
                  fontWeight: '900',
                  borderRadius: '12px',
                  marginTop: '0.35rem',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 6px 20px rgba(5, 150, 105, 0.35)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {isSubmitting ? 'Verifying Account...' : 'Login to SVGI EXAM'}
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Account Credentials Hint Bar */}
            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.78rem',
              color: '#64748b',
              textAlign: 'center'
            }}>
              <span style={{ fontWeight: '800', color: '#1e293b' }}>Sample Institutional Login Credentials:</span>
              <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', lineHeight: 1.5, color: '#475569' }}>
                • <strong>Student:</strong> <code>student1</code> or <code>21CSE104</code><br />
                • <strong>Faculty:</strong> <code>faculty1</code> &nbsp;•&nbsp; <strong>HOD:</strong> <code>hod1</code> &nbsp;•&nbsp; <strong>Admin:</strong> <code>admin1</code>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '18px',
            padding: '1.75rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a' }}>
                Password Recovery Support
              </h3>
              <button onClick={() => setShowForgotModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Institutional student and faculty credentials are managed directly by the <strong>SVGI Controller of Examinations (Exam Cell)</strong>. Please visit the Exam Cell or contact <strong style={{ color: '#059669' }}>examcell@svgi.edu</strong> (Ext <strong>1025</strong>) to reset your password.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: '#059669',
                color: '#ffffff',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        fontSize: '0.78rem',
        color: '#ffffff',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(6, 78, 59, 0.9)'
      }}>
        SVGI EXAM • Shree Venkateshwara Group of Institutions • Gobichettipalayam
      </footer>

      {/* Marquee Keyframes */}
      <style>{`
        @keyframes marqueeText {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
