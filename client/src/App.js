import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-service.onrender.com' 
  : 'http://localhost:5000'; 

function App() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [earnings, setEarnings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [targetAmount, setTargetAmount] = useState(1500000); 
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [currency, setCurrency] = useState('PKR');

  // Check login state on refresh
  useEffect(() => {
    const auth = localStorage.getItem('isAuth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-earnings`);
      setEarnings(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { 
    if (isLoggedIn) fetchEarnings(); 
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${API_URL}/login`, { password: passwordInput });
        if (res.data.success) {
            setIsLoggedIn(true);
            localStorage.setItem('isAuth', 'true');
        }
    } catch (err) {
        alert("Invalid Access Key!");
    }
  };

  const handleDemoLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isAuth', 'true'); 
    alert("Welcome to Demo Mode!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isAuth');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!amount || !source) return alert("Please provide all details!");
    await axios.post(`${API_URL}/add-earning`, { amount, source });
    setAmount(''); setSource('');
    fetchEarnings();
  };

  const deleteEarning = async (id) => {
    await axios.delete(`${API_URL}/delete-earning/${id}`);
    fetchEarnings();
  };

  const total = earnings.reduce((sum, item) => sum + Number(item.amount), 0);
  const progress = targetAmount > 0 ? Math.min((total / targetAmount) * 100, 100) : 0;

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Segoe UI, sans-serif', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {!isLoggedIn ? (
        // --- LOGIN & DEMO VIEW ---
        <div style={{ marginTop: '100px', backgroundColor: '#1e293b', padding: '40px', borderRadius: '20px', border: '1px solid #334155', textAlign: 'center', width: '320px' }}>
          <h2 style={{ color: '#fbbf24', marginBottom: '20px' }}>🔐 System Locked</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="Enter Access Key" 
              value={passwordInput} 
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white' }}
            />
            <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fbbf24', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Unlock Dashboard</button>
            
            <div style={{ margin: '10px 0', color: '#94a3b8', fontSize: '0.8rem' }}>OR</div>
            
            <button 
              type="button" 
              onClick={handleDemoLogin} 
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fbbf24', backgroundColor: 'transparent', color: '#fbbf24', fontWeight: 'bold', cursor: 'pointer' }}
            >
              View as Guest (Demo)
            </button>
          </form>
        </div>
      ) : (
        // --- FULL DASHBOARD VIEW ---
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ color: '#fbbf24', fontSize: '2.5rem', marginBottom: '10px', fontWeight: '800', textAlign: 'center' }}>ASSET TRACKER</h1>
          <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Save money for your future goals</p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#fbbf24', color: '#000', padding: '20px', borderRadius: '16px', width: '280px' }}>
              <h3 style={{ margin: 0, opacity: 0.8, fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Savings</h3>
              <p style={{ fontSize: '1.8rem', fontWeight: '900', margin: '5px 0' }}>{currency} {total.toLocaleString()}</p>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '16px', width: '280px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '8px' }}>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ backgroundColor: 'transparent', color: '#fbbf24', border: 'none', cursor: 'pointer', outline: 'none', fontWeight: 'bold' }}>
                  <option value="PKR">PKR (₨)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <span onClick={() => setIsEditingTarget(!isEditingTarget)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                  {isEditingTarget ? "SAVE" : "EDIT"}
                </span>
              </div>
              {isEditingTarget ? (
                <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))} style={{ width: '80%', background: '#0f172a', color: '#fbbf24', border: 'none', padding: '5px' }} />
              ) : (
                <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{currency} {targetAmount.toLocaleString()}</p>
              )}
              <div style={{ backgroundColor: '#334155', height: '10px', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, backgroundColor: '#fbbf24', height: '100%', transition: 'width 0.5s' }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '20px', width: '320px', border: '1px solid #334155' }}>
              <h2>Log Revenue</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white' }} />
                <input type="text" placeholder="Source" value={source} onChange={(e)=>setSource(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white' }} />
                <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fbbf24', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Add to Savings</button>
              </form>
            </div>

            <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '20px', width: '400px', border: '1px solid #334155', maxHeight: '400px', overflowY: 'auto' }}>
              <h2>Financial Ledger</h2>
              {earnings.map((e) => (
                <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #334155' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '600' }}>{e.source}</p>
                    <small style={{ color: '#94a3b8' }}>{new Date(e.date).toLocaleDateString()}</small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ color: '#4ade80', fontWeight: 'bold' }}>+{Number(e.amount).toLocaleString()}</span>
                    <button onClick={() => deleteEarning(e._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✖</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleLogout} style={{ marginTop: '30px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Sign Out</button>
        </div>
      )}
    </div>
  );
}

export default App;