import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f8', paddingTop: '80px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #eef0f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 1000 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '120px', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '6px', animation: 'pulse-skel 1.5s infinite' }} />
            <div style={{ width: '200px', height: '36px', backgroundColor: '#e2e8f0', borderRadius: '18px', animation: 'pulse-skel 1.5s infinite' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse-skel 1.5s infinite' }} />
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse-skel 1.5s infinite' }} />
            <div style={{ width: '80px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px', padding: '0 16px' }}>
          <div className="d-none d-lg-flex" style={{ width: '280px', flexDirection: 'column', gap: '16px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse-skel 1.5s infinite' }} />
                <div style={{ width: '100px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
              </div>
            ))}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse-skel 1.5s infinite' }} />
                <div style={{ flex: 1, height: '40px', backgroundColor: '#e2e8f0', borderRadius: '20px', animation: 'pulse-skel 1.5s infinite' }} />
              </div>
              <div style={{ height: '1px', backgroundColor: '#f0f2f5' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '80px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
                <div style={{ width: '80px', height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
              </div>
            </div>

            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse-skel 1.5s infinite' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ width: '120px', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
                    <div style={{ width: '60px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ width: '100%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
                  <div style={{ width: '90%', height: '16px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
                </div>
                <div style={{ width: '100%', height: '200px', backgroundColor: '#e2e8f0', borderRadius: '8px', animation: 'pulse-skel 1.5s infinite' }} />
              </div>
            ))}
          </div>

          <div className="d-none d-xl-flex" style={{ width: '300px', flexDirection: 'column', gap: '16px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '100px', height: '18px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
              {[...Array(3)].map((_, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', animation: 'pulse-skel 1.5s infinite' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ width: '80px', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
                    <div style={{ width: '50px', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '4px', animation: 'pulse-skel 1.5s infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse-skel {
            0%, 100% { opacity: 1; }
            50% { opacity: .4; }
          }
        `}</style>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
