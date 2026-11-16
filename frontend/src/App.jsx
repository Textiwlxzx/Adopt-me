import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

export default function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // Global state
  const [animals, setAnimals] = useState([]);
  const [myAnimals, setMyAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [alert, setAlert] = useState(null);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorPopupMsg, setErrorPopupMsg] = useState('');
  const [showAdoptPopup, setShowAdoptPopup] = useState(false);

  const showAlert = (msg, type = 'error') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setPage('login');
  };

  const handleLoginSuccess = (userData, userToken) => {
    setCurrentUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    fetchMyApplications(userToken);
    fetchAnimals();
    if (userData.role === 'caretaker') {
      fetchMyCaredAnimals(userData.id);
    }
    setPage('home');
  };

  // Fetch all animals for home page
  const fetchAnimals = async () => {
    try {
      const res = await fetch(`${API_BASE}/animals`);
      const data = await res.json();
      if (data.success) {
        setAnimals(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch animals:', err);
    }
  };

  // Fetch animals cared/announced by this caretaker
  const fetchMyCaredAnimals = async (caretakerId = currentUser?.id) => {
    if (!caretakerId) return;
    try {
      const res = await fetch(`${API_BASE}/animals?caretaker_id=${caretakerId}`);
      const data = await res.json();
      if (data.success) {
        setMyAnimals(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch my animals:', err);
    }
  };

  // Fetch applications
  const fetchMyApplications = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/adoption-applications/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setMyApplications(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  useEffect(() => {
    fetchAnimals();
    if (token) {
      fetchMyApplications();
      if (currentUser?.role === 'caretaker') {
        fetchMyCaredAnimals();
      }
    }
  }, [token]);

  // Status badge helper
  const renderStatus = (status) => {
    switch (status) {
      case 'street':
        return <span className="status yellow">รอผู้ดูแล / รับเลี้ยง</span>;
      case 'fostered':
        return <span className="status green">พร้อมรับเลี้ยง</span>;
      case 'adopted':
        return <span className="status green">รับเลี้ยงแล้ว</span>;
      case 'submitted':
        return <span className="status yellow">รอพิจารณา</span>;
      case 'reviewing':
        return <span className="status yellow">กำลังพิจารณา</span>;
      case 'approved':
        return <span className="status green">อนุมัติแล้ว</span>;
      case 'rejected':
        return <span className="status red">ไม่ผ่าน</span>;
      default:
        return <span className="status yellow">{status}</span>;
    }
  };

  // Topbar
  const Topbar = ({ auth = false }) => (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => setPage('home')}>
        
        <span>Adopt Me</span>
      </button>

      <nav aria-label="เมนูหลัก">
        {auth ? (
          <button type="button" onClick={() => setPage('home')}>
            ‹ ย้อนกลับ
          </button>
        ) : currentUser ? (
          <>
            {currentUser.role === 'caretaker' && (
              <button
                type="button"
                onClick={() => {
                  fetchMyCaredAnimals();
                  setPage('my-animals');
                }}
              >
                สัตว์ที่ฉันดูแล ({myAnimals.length})
              </button>
            )}

            {currentUser.role === 'admin' || currentUser.role === 'caretaker' ? (
              <button
                type="button"
                onClick={() => {
                  fetchMyApplications();
                  setPage('review');
                }}
              >
                พิจารณาใบสมัคร ({myApplications.filter((a) => a.status === 'submitted').length})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  fetchMyApplications();
                  setPage('applications');
                }}
              >
                ใบสมัครของฉัน
              </button>
            )}

            <button type="button" onClick={handleLogout}>
              ออกจากระบบ ({currentUser.name?.split(' ')[0]})
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setPage('login')}>
              เข้าสู่ระบบ
            </button>
            <button type="button" onClick={() => setPage('register')}>
              สมัครสมาชิก
            </button>
          </>
        )}
      </nav>
    </header>
  );

  /* ================= 1. HOME PAGE ================= */
  const HomePage = () => (
    <div className="page home">
      <Topbar />

      <section className="hero">
        <div>
          <h1>สวัสดี, {currentUser ? currentUser.name : 'ผู้เยี่ยมชม'}</h1>
          <p>พร้อมหาเพื่อนใหม่ที่ใช่แล้วหรือยัง?</p>
        </div>

        {/* ปุ่มแจ้งพบสัตว์: ถ้าเป็น Caretaker/Admin จะเข้าได้ทันที ถ้าเป็น Guest หรือ Adopter จะแนะนำให้ล็อกอินหรือแจ้งสิทธิ์ */}
        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              showAlert('กรุณาเข้าสู่ระบบในฐานะ Caretaker เพื่อลงทะเบียนสัตว์', 'error');
              setPage('login');
            } else if (currentUser.role !== 'caretaker' && currentUser.role !== 'admin') {
              showAlert('สิทธิ์การลงทะเบียนสัตว์สงวนไว้สำหรับ Caretaker เท่านั้น', 'error');
            } else {
              setPage('report');
            }
          }}
        >
          {currentUser?.role === 'caretaker' ? 'ลงทะเบียนสัตว์ใหม่' : 'ลงทะเบียนสัตว์'}
        </button>
      </section>

      <main className="home-content">
        <section>
          <div className="section-title">
            <h2>น้องๆ ที่รอบ้านอยู่</h2>
            <button type="button" onClick={fetchAnimals}>
              รีเฟรชรายการ
            </button>
          </div>

          <div className="pet-grid">
            {animals.length > 0 ? (
              animals.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  className="pet-card"
                  onClick={() => {
                    setSelectedAnimal(pet);
                    setPage('detail');
                  }}
                >
                  <div className="pet-photo-container">
                    {pet.photo_url ? (
                      <img src={pet.photo_url} alt={pet.name} />
                    ) : (
                      <div className="pet-placeholder">รูปสัตว์</div>
                    )}
                  </div>
                  <div className="pet-info">
                    {renderStatus(pet.status)}
                    <strong>{pet.name}</strong>
                    <span>
                      {pet.species === 'cat' ? 'แมว' : pet.species === 'dog' ? 'สุนัข' : 'สัตว์อื่นๆ'} ·{' '}
                      {pet.breed || pet.location_found || 'ไม่ระบุสายพันธุ์'}
                    </span>
                    {pet.caretaker_name && (
                      <span style={{ fontSize: '12px', color: 'var(--teal)' }}>
                        ผู้ดูแล: {pet.caretaker_name}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', padding: '20px 0', color: 'var(--muted)' }}>
                ยังไม่มีข้อมูลสัตว์ในระบบ
              </p>
            )}
          </div>
        </section>

        <aside className="mini-apps">
          <div className="mini-head">
            <h3>
              {currentUser?.role === 'admin' || currentUser?.role === 'caretaker'
                ? 'ใบสมัครที่ส่งเข้ามา'
                : 'ใบสมัครของฉัน'}
            </h3>
            <button
              type="button"
              onClick={() => {
                fetchMyApplications();
                setPage(
                  currentUser?.role === 'admin' || currentUser?.role === 'caretaker'
                    ? 'review'
                    : 'applications'
                );
              }}
            >
              ดูทั้งหมด
            </button>
          </div>

          {myApplications.length > 0 ? (
            myApplications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="mini-row"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedApp(app);
                  setPage(
                    currentUser?.role === 'admin' || currentUser?.role === 'caretaker'
                      ? 'review'
                      : 'applications'
                  );
                }}
              >
                <div className="mini-photo">
                  {app.animal_photo_url ? (
                    <img src={app.animal_photo_url} alt={app.animal_name} />
                  ) : (
                    'รูป'
                  )}
                </div>
                <div className="mini-copy">
                  <strong>{app.animal_name}</strong>
                  <span>{new Date(app.submitted_at).toLocaleDateString('th-TH')}</span>
                </div>
                {renderStatus(app.status)}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>
              {currentUser ? 'ยังไม่มีรายการใบสมัคร' : 'เข้าสู่ระบบเพื่อดูใบสมัคร'}
            </div>
          )}
        </aside>
      </main>
    </div>
  );

  /* ================= 2. AUTH PAGES (Login / Register) ================= */
  const AuthPage = ({ isRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('adopter');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
      const payload = isRegister
        ? { name, email, phone, password, role, address }
        : { email, password };

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'เกิดข้อผิดพลาดในการทำรายการ');
        }

        if (isRegister) {
          handleLoginSuccess(data.data.user, data.data.token);
          setShowRegisterPopup(true);
        } else {
          handleLoginSuccess(data.data.user, data.data.token);
          setShowLoginPopup(true);
        }
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="page">
                <Topbar auth={true} />
        <form className="auth-page" onSubmit={handleSubmit}>
          <img src="/logo.png" alt="AdoptMe" className="auth-logo" />
          <h1>{isRegister ? 'Register' : 'Login'}</h1>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          <div className={`auth-fields ${isRegister ? '' : 'login-fields'}`}>
            {isRegister && (
              <label className="field">
                <span>ชื่อ - นามสกุล</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                />
              </label>
            )}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />
            </label>

            {isRegister && (
              <>
                <label className="field">
                  <span>เบอร์โทรศัพท์</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812345678"
                  />
                </label>

                <label className="field">
                  <span>บทบาท (Role)</span>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="adopter">ผู้ขอรับเลี้ยง (Adopter)</option>
                    <option value="caretaker">ผู้ดูแลสัตว์ (Caretaker)</option>
                  </select>
                </label>

                <label className="field wide">
                  <span>ที่อยู่</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="บ้านเลขที่ ถนน แขวง เขต จังหวัด"
                  />
                </label>
              </>
            )}

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
              />
            </label>
          </div>

          <button type="submit" className="primary auth-submit" disabled={loading}>
            {loading ? 'กำลังประมวลผล...' : isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>

          <button
            type="button"
            className="text-link"
            onClick={() => setPage(isRegister ? 'login' : 'register')}
          >
            {isRegister ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
          </button>
        </form>
      </div>
    );
  };

  /* ================= 3. ลงทะเบียนสัตว์ใหม่ (สงวนสิทธิ์เฉพาะ CARETAKER) ================= */
  const ReportPage = () => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('dog');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [personality, setPersonality] = useState('');
    const [health, setHealth] = useState('');
    const [locationFound, setLocationFound] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    // ตรวจสอบสิทธิ์ตั้งแต่ตอนเข้าหน้านี้
    if (!currentUser || (currentUser.role !== 'caretaker' && currentUser.role !== 'admin')) {
      return (
        <div className="page">
          <Topbar />
          <div className="content standard" style={{ textAlign: 'center' }}>
            <h2>หน้านี้สงวนสิทธิ์สำหรับ Caretaker เท่านั้น</h2>
            <p style={{ marginTop: '10px', color: 'var(--muted)' }}>
              กรุณาเข้าสู่ระบบด้วยบัญชี Caretaker เพื่อลงทะเบียนสัตว์ที่คุณดูแล
            </p>
            <button className="primary yellow" onClick={() => setPage('login')} style={{ marginTop: '20px' }}>
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      );
    }

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('species', species);
      formData.append('breed', breed);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('personality_note', personality);
      formData.append('health_condition', health);
      formData.append('location_found', locationFound);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      try {
        const res = await fetch(`${API_BASE}/animals`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'ไม่สามารถลงทะเบียนสัตว์ได้');
        }

        showAlert('ลงทะเบียนสัตว์ใหม่เรียบร้อยแล้ว! สัตว์ตัวนี้จะบันทึกให้คุณเป็นผู้ดูแลทันที', 'success');
        fetchAnimals();
        fetchMyCaredAnimals();
        setPage('my-animals');
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="page">
        <Topbar />
        <main className="report content">
          <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '8px' }}>ลงทะเบียนสัตว์ใหม่</h1>
          <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '24px' }}>
            คุณกำลังลงทะเบียนในฐานะ Caretaker: <strong>{currentUser.name}</strong> (ระบบจะตั้งให้คุณเป็นผู้ดูแลอัตโนมัติ)
          </p>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="upload">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="preview" />
              ) : (
                <>
                  <span className="upload-icon">📷</span>
                  <span>กดเพื่อเพิ่มรูปภาพ</span>
                </>
              )}
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </label>

            <div className="two-col form-grid">
              <label className="field">
                <span>ชื่อสัตว์ *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น เจ้าหลง, น้องส้ม"
                />
              </label>

              <label className="field">
                <span>ชนิด *</span>
                <select value={species} onChange={(e) => setSpecies(e.target.value)}>
                  <option value="dog">สุนัข (Dog)</option>
                  <option value="cat">แมว (Cat)</option>
                  <option value="other">อื่นๆ (Other)</option>
                </select>
              </label>

              <label className="field">
                <span>เพศ</span>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">ผู้ (Male)</option>
                  <option value="female">เมีย (Female)</option>
                </select>
              </label>

              <label className="field">
                <span>สายพันธุ์</span>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="เช่น ไทยสลิด, บางแก้ว"
                />
              </label>

              <label className="field">
                <span>อายุ (โดยประมาณเป็นปี)</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="เช่น 1 หรือ 2"
                />
              </label>

              <label className="field">
                <span>สถานที่พบ / สถานที่ดูแล</span>
                <input
                  type="text"
                  value={locationFound}
                  onChange={(e) => setLocationFound(e.target.value)}
                  placeholder="เช่น บ้านพักชั่วคราว พญาไท"
                />
              </label>

              <label className="field wide">
                <span>นิสัย / พฤติกรรม</span>
                <textarea
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  placeholder="เช่น เชื่อง ขี้เล่น ชอบให้อุ้ม"
                />
              </label>

              <label className="field wide">
                <span>สภาพสุขภาพ</span>
                <textarea
                  value={health}
                  onChange={(e) => setHealth(e.target.value)}
                  placeholder="เช่น แข็งแรง ได้รับวัคซีนแล้ว"
                />
              </label>
            </div>

            <button type="submit" className="primary yellow submit-wide" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : 'ลงทะเบียนสัตว์'}
            </button>
          </form>
        </main>
      </div>
    );
  };

  /* ================= 4. สัตว์ที่ฉันดูแล (CARETAKER'S ANIMALS PAGE) ================= */
  const MyAnimalsPage = () => (
    <div className="page">
      <Topbar />
      <main className="content standard">
        <h1>สัตว์ที่ฉันดูแล (My Cared Animals)</h1>
        <p className="subtitle">
          รายการสัตว์ที่คุณเป็นคนลงทะเบียน (Caretaker: {currentUser?.name})
        </p>

        <div className="pet-grid" style={{ marginTop: '30px' }}>
          {myAnimals.length > 0 ? (
            myAnimals.map((pet) => (
              <button
                key={pet.id}
                type="button"
                className="pet-card"
                onClick={() => {
                  setSelectedAnimal(pet);
                  setPage('detail');
                }}
              >
                <div className="pet-photo-container">
                  {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.name} />
                  ) : (
                    <div className="pet-placeholder">รูปสัตว์</div>
                  )}
                </div>
                <div className="pet-info">
                  {renderStatus(pet.status)}
                  <strong>{pet.name}</strong>
                  <span>
                    {pet.species === 'cat' ? 'แมว' : pet.species === 'dog' ? 'สุนัข' : 'สัตว์อื่นๆ'} ·{' '}
                    {pet.breed || pet.location_found || 'ไม่ระบุสายพันธุ์'}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px', color: 'var(--muted)' }}>
              คุณยังไม่มีสัตว์ในความดูแล สามารถกดปุ่ม 'ลงทะเบียนสัตว์ใหม่' ด้านบนได้เลยครับ
            </div>
          )}
        </div>
      </main>
    </div>
  );

  /* ================= 5. รายละเอียดสัตว์ / รับเป็นผู้ดูแล (DETAIL PAGE) ================= */
  const DetailPage = () => {
    const pet = selectedAnimal;

    if (!pet) {
      return (
        <div className="page">
          <Topbar />
          <div className="content standard" style={{ textAlign: 'center' }}>
            <p>กรุณาเลือกสัตว์จากหน้าหลัก</p>
            <button className="primary yellow" onClick={() => setPage('home')} style={{ marginTop: '20px' }}>
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      );
    }

    const isMyPet = currentUser && pet.caretaker_id === currentUser.id;

    return (
      <div className="page">
        <Topbar />
        <main className="detail content">
          <section className="gallery" aria-label="รูปภาพสัตว์">
            <div className="main-photo">
              {pet.photo_url ? (
                <img src={pet.photo_url} alt={pet.name} />
              ) : (
                <div style={{ color: 'var(--muted)', fontSize: '20px' }}>ไม่มีรูปภาพ</div>
              )}
            </div>

            <div className="thumbs">
              <div>รูป 1</div>
              <div>รูป 2</div>
              <div>รูป 3</div>
              <div>รูป 4</div>
            </div>
          </section>

          <section className="animal-copy">
            {renderStatus(pet.status)}
            <h1>{pet.name}</h1>
            <p>
              สถานที่ดูแล: {pet.location_found || 'ไม่ระบุ'} · วันที่ลงทะเบียน:{' '}
              {new Date(pet.created_at).toLocaleDateString('th-TH')}
            </p>

            <div className="facts">
              <div>
                <span>ชนิด</span>
                <strong>{pet.species === 'cat' ? 'แมว' : pet.species === 'dog' ? 'สุนัข' : 'สัตว์อื่นๆ'}</strong>
              </div>
              <div>
                <span>สายพันธุ์</span>
                <strong>{pet.breed || 'ไม่ระบุ'}</strong>
              </div>
              <div>
                <span>เพศ</span>
                <strong>{pet.gender === 'male' ? 'ผู้' : pet.gender === 'female' ? 'เมีย' : 'ไม่ระบุ'}</strong>
              </div>
            </div>

            <h3>เกี่ยวกับน้อง</h3>
            <p>{pet.personality_note || 'ไม่มีข้อมูลนิสัยระบุไว้'}</p>
            <p><strong>สุขภาพ:</strong> {pet.health_condition || 'ปกติ'}</p>

            <div className="caretaker">
              <span>ผู้ดูแลปัจจุบัน</span>
              <strong>
                {pet.caretaker_name
                  ? isMyPet
                    ? `${pet.caretaker_name} (คุณเป็นผู้ดูแลสัตว์ตัวนี้)`
                    : pet.caretaker_name
                  : 'ศูนย์ดูแลสัตว์'}
              </strong>
            </div>

            {/* ปุ่มแอคชัน */}
            {isMyPet ? (
              <button
                type="button"
                className="primary yellow"
                onClick={() => {
                  fetchMyApplications();
                  setPage('review');
                }}
              >
                ดูใบสมัครรับเลี้ยงของสัตว์ตัวนี้
              </button>
            ) : pet.status === 'adopted' ? (
              <button type="button" className="primary" disabled style={{ background: '#9ca3af', cursor: 'not-allowed' }}>
                สัตว์ตัวนี้มีผู้รับเลี้ยงแล้ว
              </button>
            ) : (
              <button
                type="button"
                className="primary yellow"
                onClick={() => {
                  if (!currentUser) {
                    showAlert('กรุณาเข้าสู่ระบบก่อนสมัครขอรับเลี้ยง', 'error');
                    setPage('login');
                  } else {
                    setPage('apply');
                  }
                }}
              >
                สมัครรับเลี้ยงสัตว์ตัวนี้
              </button>
            )}

            <p className="note">
              {pet.caretaker_name
                ? `สัตว์ตัวนี้มีผู้ดูแลคือคุณ ${pet.caretaker_name} ซึ่งจะเป็นผู้พิจารณาอนุมัติใบสมัคร`
                : 'ผู้ดูแลสัตว์จะเป็นผู้พิจารณาและอนุมัติใบสมัครรับเลี้ยง'}
            </p>
          </section>
        </main>
      </div>
    );
  };

  /* ================= 6. สมัครรับเลี้ยง (APPLY PAGE) ================= */
  const ApplyPage = () => {
    const pet = selectedAnimal;
    const [applicantName, setApplicantName] = useState(currentUser ? currentUser.name : '');
    const [phone, setPhone] = useState(currentUser ? currentUser.phone || '' : '');
    const [address, setAddress] = useState(currentUser ? currentUser.address || '' : '');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    if (!pet) {
      return (
        <div className="page">
          <Topbar />
          <div className="content standard" style={{ textAlign: 'center' }}>
            <p>กรุณาเลือกสัตว์ที่ต้องการรับเลี้ยง</p>
            <button className="primary yellow" onClick={() => setPage('home')}>
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      );
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!token) {
        showAlert('กรุณาเข้าสู่ระบบก่อนส่งใบสมัคร', 'error');
        setPage('login');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/adoption-applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            animal_id: pet.id,
            reason,
            home_environment: address,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'ส่งใบสมัครไม่สำเร็จ');
        }

        showAlert('ส่งใบสมัครขอรับเลี้ยงสำเร็จ!', 'success');
        await fetchMyApplications();
        setShowAdoptPopup(true);
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="page">
        <Topbar />
        <main className="content standard narrow">
          <h1>สมัครรับเลี้ยง</h1>
          <p className="subtitle">สำหรับผู้ขอรับเลี้ยง (Adopter / Caretaker คนอื่น)</p>

          {alert && (
            <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
              {alert.msg}
            </div>
          )}

          <div className="animal-summary">
            {pet.photo_url ? (
              <img src={pet.photo_url} alt={pet.name} />
            ) : (
              <div style={{ width: '142px', height: '80px', background: 'var(--placeholder)', display: 'grid', placeItems: 'center' }}>
                รูปสัตว์
              </div>
            )}
            <div>
              <h2>{pet.name}</h2>
              <p>
                {pet.species === 'cat' ? 'แมว' : 'สุนัข'} · {pet.breed || 'ไม่ระบุสายพันธุ์'} · ผู้ดูแล:{' '}
                {pet.caretaker_name || 'ศูนย์ดูแลสัตว์'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="two-col form-grid apply-form">
              <label className="field">
                <span>ชื่อผู้สมัคร *</span>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </label>

              <label className="field">
                <span>เบอร์โทร *</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <label className="field wide">
                <span>ที่อยู่และสภาพแวดล้อมที่เลี้ยงสัตว์ *</span>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="เช่น บ้านเดี่ยว มีรั้วรอบขอบชิด เลี้ยงระบบปิด มีสนามหญ้า"
                />
              </label>

              <label className="field wide">
                <span>เหตุผลที่ต้องการรับเลี้ยง *</span>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="เล่าประสบการณ์เลี้ยงสัตว์หรือความพร้อมในการดูแลน้อง"
                />
              </label>
            </div>

            <button type="submit" className="primary yellow centered" disabled={loading}>
              {loading ? 'กำลังส่งข้อมูล...' : 'ส่งใบสมัคร'}
            </button>
          </form>
        </main>
      </div>
    );
  };

  /* ================= 7. ใบสมัครของฉัน (APPLICATIONS PAGE) ================= */
  const ApplicationsPage = () => (
    <div className="page">
      <Topbar />
      <main className="content standard applications">
        <h1>ใบสมัครของฉัน</h1>
        <p className="subtitle">สถานะใบสมัครรับเลี้ยงของคุณ</p>

        {alert && (
          <div className={`alert ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {alert.msg}
          </div>
        )}

        <div className="application-list">
          {myApplications.length > 0 ? (
            myApplications.map((app) => (
              <article key={app.id}>
                <div className="list-photo">
                  {app.animal_photo_url ? (
                    <img src={app.animal_photo_url} alt={app.animal_name} />
                  ) : (
                    'รูปสัตว์'
                  )}
                </div>
                <div className="list-copy">
                  <h2>{app.animal_name}</h2>
                  <p>
                    ใบสมัคร #{app.id} · ส่งเมื่อ{' '}
                    {new Date(app.submitted_at).toLocaleDateString('th-TH')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAnimal({
                        id: app.animal_id,
                        name: app.animal_name,
                        photo_url: app.animal_photo_url,
                        species: app.animal_species,
                        breed: app.animal_breed,
                        status: app.animal_status,
                      });
                      setPage('detail');
                    }}
                  >
                    ดูรายละเอียดสัตว์
                  </button>
                </div>
                {renderStatus(app.status)}
              </article>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
              ยังไม่มีประวัติการส่งใบสมัครขอรับเลี้ยง
            </div>
          )}
        </div>

        <p className="footer-note">แสดงเฉพาะใบสมัครของบัญชีที่เข้าสู่ระบบ</p>
      </main>
    </div>
  );

  /* ================= 8. พิจารณาใบสมัคร (REVIEW PAGE - Caretaker & Admin) ================= */
  const ReviewPage = () => {
    const [selectedReviewApp, setSelectedReviewApp] = useState(selectedApp || myApplications[0] || null);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    const handleUpdateStatus = async (newStatus) => {
      if (!selectedReviewApp) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/adoption-applications/${selectedReviewApp.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'อัปเดตสถานะไม่สำเร็จ');
        }

        showAlert(
          `ปรับสถานะใบสมัครเป็น: ${newStatus === 'approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'} เรียบร้อย`,
          'success'
        );
        fetchMyApplications();
        if (newStatus === 'approved') {
          setSelectedApp(selectedReviewApp);
          setPage('followup');
        } else {
          setPage('home');
        }
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedReviewApp) {
      return (
        <div className="page">
          <Topbar />
          <div className="content standard" style={{ textAlign: 'center' }}>
            <h2>ยังไม่มีใบสมัครส่งเข้ามาในสัตว์ที่คุณดูแล</h2>
            <button className="primary yellow" onClick={() => setPage('home')} style={{ marginTop: '20px' }}>
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="page">
        <Topbar />
        <main className="content standard review">
          <div className="title-with-status">
            <div>
              <h1>พิจารณาใบสมัคร</h1>
              <p className="subtitle">
                {currentUser?.role === 'admin'
                  ? 'ระบบพิจารณาโดย Admin (อนุมัติได้ทุกตัว)'
                  : `สำหรับผู้ดูแลสัตว์ (${currentUser?.name} - พิจารณาเฉพาะสัตว์ที่คุณดูแล)`}
              </p>
            </div>
            {renderStatus(selectedReviewApp.status)}
          </div>

          {myApplications.length > 1 && (
            <div style={{ marginTop: '20px' }}>
              <span>เลือกใบสมัคร: </span>
              <select
                value={selectedReviewApp.id}
                onChange={(e) => {
                  const found = myApplications.find((a) => a.id === Number(e.target.value));
                  if (found) setSelectedReviewApp(found);
                }}
                style={{ padding: '6px 12px', borderRadius: '4px', border: '1.5px solid #087c70' }}
              >
                {myApplications.map((a) => (
                  <option key={a.id} value={a.id}>
                    ใบสมัคร #{a.id} - {a.animal_name} (ผู้สมัคร: {a.applicant_name || 'Adopter'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="review-grid">
            <section className="review-animal">
              {selectedReviewApp.animal_photo_url ? (
                <img src={selectedReviewApp.animal_photo_url} alt={selectedReviewApp.animal_name} />
              ) : (
                <div style={{ width: '100%', height: '154px', background: 'var(--placeholder)', display: 'grid', placeItems: 'center' }}>
                  รูปสัตว์
                </div>
              )}
              <h2>{selectedReviewApp.animal_name}</h2>
              <p>รหัสสัตว์: AN-{selectedReviewApp.animal_id}</p>
              <p>รหัสใบสมัคร: APP-{selectedReviewApp.id}</p>
              <p>ผู้ดูแลสัตว์: {currentUser?.name || 'Caretaker'}</p>
              <p>สถานะปัจจุบัน: {selectedReviewApp.status}</p>
            </section>

            <section className="applicant">
              <h2>ข้อมูลผู้ขอรับเลี้ยง</h2>
              <p><strong>ชื่อผู้สมัคร:</strong> {selectedReviewApp.applicant_name || 'ไม่ระบุ'}</p>
              <p><strong>เบอร์โทร:</strong> {selectedReviewApp.applicant_phone || 'ไม่ระบุ'}</p>
              <p><strong>อีเมล:</strong> {selectedReviewApp.applicant_email || 'ไม่ระบุ'}</p>
              <p><strong>สภาพแวดล้อมที่บ้าน:</strong> {selectedReviewApp.home_environment || 'ไม่ระบุ'}</p>
              <h3>เหตุผลที่ต้องการรับเลี้ยง</h3>
              <p>{selectedReviewApp.reason || 'ไม่ได้ระบุเหตุผล'}</p>
              <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--muted)' }}>
                ส่งเมื่อ {new Date(selectedReviewApp.submitted_at).toLocaleDateString('th-TH')}
              </p>
            </section>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleUpdateStatus('approved'); }}>
            <div className="review-actions">
              <button
                type="button"
                className="reject"
                disabled={loading}
                onClick={() => handleUpdateStatus('rejected')}
              >
                ปฏิเสธใบสมัคร
              </button>
              <button type="submit" className="primary yellow" disabled={loading}>
                อนุมัติใบสมัคร
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  };

  /* ================= 9. ติดตามหลังรับเลี้ยง (FOLLOW-UP PAGE) ================= */
  const FollowupPage = () => {
    const app = selectedApp || myApplications[0];
    const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('good');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [registeredData, setRegisteredData] = useState(null);

    const handleClosePopup = () => {
      setShowPopup(false);
      if (registeredData) {
        handleLoginSuccess(registeredData.user, registeredData.token);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!token) {
        showAlert('กรุณาเข้าสู่ระบบในฐานะ Caretaker หรือ Admin', 'error');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/follow-ups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_id: app?.id,
            visit_date: visitDate,
            status,
            note,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error?.message || 'บันทึกการติดตามไม่สำเร็จ');
        }

        showAlert('บันทึกผลการติดตามหลังรับเลี้ยงเรียบร้อยแล้ว!', 'success');
        setPage('home');
      } catch (err) {
        setErrorPopupMsg(err.message);
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="page">
        <Topbar />
        <main className="content standard narrow followup">
          <h1>ติดตามหลังรับเลี้ยง</h1>
          <p className="subtitle">บันทึกโดยผู้ดูแล (Caretaker) / Admin</p>

          <div className="follow-summary">
            <div>
              <h2>{app?.animal_name || 'สัตว์เลี้ยง'}</h2>
              <p>ใบสมัคร APP-{app?.id || '001'} · ผู้รับเลี้ยง: {app?.applicant_name || 'Adopter'}</p>
            </div>
            {renderStatus('approved')}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="two-col form-grid">
              <label className="field">
                <span>วันที่ติดตาม *</span>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
              </label>

              <label className="field">
                <span>สถานะการติดตาม</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="good">สภาพความเป็นอยู่ดี (Good)</option>
                  <option value="needs_attention">ต้องติดตามเพิ่มเติม (Needs Attention)</option>
                </select>
              </label>

              <label className="field wide follow-result">
                <span>ผลการติดตามหลังรับเลี้ยง *</span>
                <textarea
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น น้องปรับตัวเข้ากับบ้านใหม่ได้ดี สุขภาพแข็งแรง ร่าเริง กินอาหารได้ปกติ"
                />
              </label>
            </div>

            <button type="submit" className="primary yellow centered" disabled={loading}>
              {loading ? 'กำลังบันทึก...' : 'บันทึกผลการติดตาม'}
            </button>
          </form>
        </main>
      </div>
    );
  };

  // Router View
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <AuthPage isRegister={false} />;
      case 'register':
        return <AuthPage isRegister={true} />;
      case 'report':
        return <ReportPage />;
      case 'my-animals':
        return <MyAnimalsPage />;
      case 'detail':
        return <DetailPage />;
      case 'apply':
        return <ApplyPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'review':
        return <ReviewPage />;
      case 'followup':
        return <FollowupPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {renderPage()}
      {showRegisterPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => setShowRegisterPopup(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => setShowRegisterPopup(false)}
            >✕</button>
            <img src="/popup-cat.png" alt="แมวน้อย" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#2a9d4e', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>ลงทะเบียนสำเร็จ</p>
          </div>
        </div>
      )}
      {showLoginPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => setShowLoginPopup(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => setShowLoginPopup(false)}
            >✕</button>
            <img src="/popup-cat.png" alt="แมวน้อย" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#2a9d4e', fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>เข้าสู่ระบบสำเร็จ</p>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => setShowErrorPopup(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => setShowErrorPopup(false)}
            >✕</button>
            <img src="/popup-cat-error.png" alt="เกิดข้อผิดพลาด" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#e53e3e', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{errorPopupMsg}</p>
          </div>
        </div>
      )}
      {showAdoptPopup && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, cursor: 'pointer',
          }}
          onClick={() => { setShowAdoptPopup(false); setPage('applications'); }}
        >
          <div
            style={{
              background: '#fff', borderRadius: '16px', padding: '2rem 2.5rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'relative', textAlign: 'center', maxWidth: '380px', width: '90%', cursor: 'default',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#333' }}
              onClick={() => { setShowAdoptPopup(false); setPage('applications'); }}
            >✕</button>
            <img src="/popup-adopt.png" alt="ส่งคำขอสำเร็จ" style={{ width: '220px', height: 'auto', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ color: '#2a9d4e', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              ส่งคำขอรับเลี้ยงสำเร็จ<br />กำลังรออนุมัติ
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
