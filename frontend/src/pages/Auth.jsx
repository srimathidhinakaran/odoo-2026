import { useState } from 'react';
import { Truck, LogIn, UserPlus } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast';
import { loginUser, registerUser, googleAuth } from '../services/api';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Dispatcher' });

  const handleManualAuth = async (e) => {
    e.preventDefault();
    try {
      const response = isLogin 
        ? await loginUser({ email: formData.email, password: formData.password })
        : await registerUser(formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      setTimeout(() => onAuthSuccess(), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleAuth(credentialResponse.credential);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      toast.success('Google Authentication successful!');
      setTimeout(() => onAuthSuccess(), 1000);
    } catch (err) {
      toast.error('Google Auth failed. Try again.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <Toaster position="top-center" />
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div className="sidebar-logo" style={{ marginBottom: '8px' }}>
            <Truck size={32} /> TransitOps
          </div>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
            {isLogin ? 'Sign in to access your dashboard' : 'Create an account to start dispatching'}
          </p>
        </div>

        <form onSubmit={handleManualAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Full Name"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <select 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Dispatcher">Dispatcher</option>
                <option value="Admin">Admin / Fleet Manager</option>
              </select>
            </>
          )}
          <input 
            type="email" 
            placeholder="Email Address"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            {isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--text-secondary)', fontSize: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          <span style={{ padding: '0 12px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin 
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Login Failed')}
            theme="filled_black"
            shape="rectangular"
          />
        </div>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
