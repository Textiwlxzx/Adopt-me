'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * /auth/callback
 *
 * Backend (googleOauthCallback) จะ redirect มาที่นี่พร้อม ?payload=<base64url>
 * หน้านี้ decode payload → บันทึก user/token ลง localStorage → redirect ไปหน้าหลัก
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('กำลังเข้าสู่ระบบด้วย Google...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const payload = searchParams.get('payload');
    const errorMsg = searchParams.get('error');

    if (errorMsg) {
      setError(`เกิดข้อผิดพลาด: ${errorMsg}`);
      setTimeout(() => router.replace('/'), 3000);
      return;
    }

    if (!payload) {
      setError('ไม่พบข้อมูลจาก Google กรุณาลองใหม่อีกครั้ง');
      setTimeout(() => router.replace('/'), 3000);
      return;
    }

    try {
      // Decode base64url → JSON
      const decoded = JSON.parse(
        Buffer.from(payload, 'base64').toString('utf-8')
      );

      const { user, token } = decoded;

      if (!user || !token) throw new Error('Invalid payload structure');

      // บันทึกลง localStorage (เหมือน login ปกติ)
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setStatus(`ยินดีต้อนรับ, ${user.name || user.email}! กำลังพาไปหน้าหลัก...`);

      // Redirect ไปหน้าหลักหลัง 1.2 วินาที
      setTimeout(() => router.replace('/'), 1200);
    } catch (err) {
      console.error('[AuthCallback] decode error:', err);
      setError('ไม่สามารถอ่านข้อมูลจาก Google ได้ กรุณาลองใหม่');
      setTimeout(() => router.replace('/'), 3000);
    }
  }, [searchParams, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Itim, sans-serif',
        gap: '16px',
        padding: '20px',
      }}
    >
      {error ? (
        <>
          <span style={{ fontSize: '48px' }}>❌</span>
          <p style={{ color: '#9b1c1c', fontSize: '18px', textAlign: 'center' }}>{error}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>กำลังพาไปหน้าหลัก...</p>
        </>
      ) : (
        <>
          {/* Spinner */}
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '5px solid #e4ebe5',
              borderTop: '5px solid #0c756b',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#203d29', fontSize: '18px', textAlign: 'center' }}>{status}</p>
        </>
      )}
    </div>
  );
}
