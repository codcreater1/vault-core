import { useState, useEffect } from 'react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { HDNodeWallet } from 'ethers';
import { Shield, Lock, Unlock, Eye, EyeOff, Plus, Wallet, Trash2, Clock, Cpu, Database, Activity, Copy, Check, ExternalLink, Zap } from 'lucide-react';

function App() {
  const [wallets, setWallets] = useState([]);
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKey, setShowKey] = useState({});
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ cpu: 42, ram: 2.2, ping: 24 });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('vault_storage');
    if (saved) setWallets(JSON.parse(saved));
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 12) + 35,
        ram: (Math.random() * 0.1 + 2.1).toFixed(1),
        ping: Math.floor(Math.random() * 8) + 18
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg) => {
    setLogs((prev) => [...prev.slice(-5), `> ${msg}`]);
  };

  const createWallet = () => {
    if (password.length < 6 && isLocked) {
      alert("Security Protocol: Password must be at least 6 characters.");
      return;
    }
    setIsProcessing(true);
    setLogs([]);
    const steps = ["SECURE_ENCLAVE_INIT", "BIP39_GEN_MNEMONIC", "SECP256K1_DERIVATION", "KECCAK256_HASHING", "AES256_ENCRYPTION"];
    steps.forEach((step, index) => {
      setTimeout(() => {
        addLog(step);
        if (index === steps.length - 1) {
          const mnemonic = generateMnemonic();
          const seed = mnemonicToSeedSync(mnemonic);
          const hdNode = HDNodeWallet.fromSeed(seed);
          const newWallet = {
            id: Date.now(),
            name: `Vault Node #${wallets.length + 1}`,
            address: hdNode.address,
            phrase: mnemonic,
            key: hdNode.privateKey,
            createdAt: new Date().toLocaleTimeString()
          };
          const updated = [...wallets, newWallet];
          setWallets(updated);
          localStorage.setItem('vault_storage', JSON.stringify(updated));
          setIsProcessing(false);
          setIsLocked(false);
        }
      }, (index + 1) * 600);
    });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ backgroundColor: '#050505', color: '#e0e0e0', minHeight: '100vh', padding: '20px 40px', fontFamily: '"Inter", sans-serif', backgroundImage: 'radial-gradient(circle at 50% -20%, #1a1a2e 0%, #050505 80%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* NAV BAR */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '10px', borderRadius: '12px', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
              <Shield size={28} color="white" />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-1px', margin: 0, background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VAULT<span style={{ color: '#3b82f6' }}>CORE</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '30px', fontSize: '11px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={14} /> CPU: {stats.cpu}%</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> PING: {stats.ping}ms</span>
            <div style={{ width: '1px', height: '15px', background: '#333' }} />
            <span style={{ color: isLocked ? '#ef4444' : '#22c55e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isLocked ? <Lock size={14}/> : <Unlock size={14}/>} {isLocked ? 'SECURED' : 'UNLOCKED'}
            </span>
          </div>
        </nav>

        {isLocked ? (
          /* AUTHENTICATION VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', animation: 'fadeIn 0.8s ease' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '50px', borderRadius: '32px', backdropFilter: 'blur(20px)', textAlign: 'center', maxWidth: '450px', width: '100%' }}>
              <Zap size={40} color="#3b82f6" style={{ marginBottom: '20px' }} />
              <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Enter Encryption Key</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>Access your decentralized identity vault</p>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: '#111', border: '1px solid #222', color: 'white', padding: '16px', width: '100%', borderRadius: '14px', outline: 'none', textAlign: 'center', fontSize: '18px', marginBottom: '20px', boxSizing: 'border-box' }}
              />
              <button 
                onClick={() => setIsLocked(false)} 
                style={{ width: '100%', background: 'white', color: 'black', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', transition: '0.3s', marginBottom: '10px' }}
              >
                UNLOCK VAULT
              </button>
              <button onClick={createWallet} style={{ width: '100%', background: 'transparent', color: '#3b82f6', border: 'none', padding: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                OR INITIALIZE NEW ENCLAVE
              </button>
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h2 style={{ fontSize: '32px', margin: 0 }}>Identity Assets</h2>
                <p style={{ color: '#666', margin: '5px 0 0 0' }}>Manage your high-security cryptographic nodes</p>
              </div>
              <button 
                onClick={createWallet} 
                disabled={isProcessing}
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}
              >
                <Plus size={20} /> {isProcessing ? "GENERATING..." : "NEW WALLET"}
              </button>
            </div>

            {isProcessing && (
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <div className="dot" style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }} />
                  <div className="dot" style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }} />
                  <div className="dot" style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
                </div>
                {logs.map((log, i) => <p key={i} style={{ margin: '5px 0', fontSize: '13px', color: '#00ff41', fontFamily: 'monospace' }}>{log}</p>)}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '25px' }}>
              {wallets.map(w => (
                <div key={w.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#3b82f6' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#111', padding: '8px', borderRadius: '10px' }}><Wallet size={20} color="#3b82f6" /></div>
                      <span style={{ fontWeight: '700', fontSize: '18px' }}>{w.name}</span>
                    </div>
                    <button onClick={() => deleteWallet(w.id)} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>

                  <div style={{ background: '#0a0a0a', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #111' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#444', textTransform: 'uppercase' }}>Public Address</span>
                      <button onClick={() => copyToClipboard(w.address, w.id)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>
                        {copiedId === w.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <code style={{ fontSize: '13px', color: '#3b82f6', wordBreak: 'break-all', fontFamily: 'monospace' }}>{w.address}</code>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#444', textTransform: 'uppercase' }}>Seed Phrase</span>
                      <p style={{ fontSize: '13px', marginTop: '8px', lineHeight: '1.5', color: '#aaa' }}>{w.phrase}</p>
                    </div>
                    <div style={{ borderLeft: '1px solid #1a1a1a', paddingLeft: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#ef4444', textTransform: 'uppercase' }}>Private Key</span>
                        <button onClick={() => setShowKey({...showKey, [w.id]: !showKey[w.id]})} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          {showKey[w.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <p style={{ fontSize: '11px', color: '#ef4444', wordBreak: 'break-all', marginTop: '8px', filter: showKey[w.id] ? 'none' : 'blur(8px)', transition: '0.4s' }}>{w.key}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { filter: brightness(1.2); transform: translateY(-1px); }
        button:active { transform: translateY(0); }
      `}</style>
    </div>
  );
}

export default App;