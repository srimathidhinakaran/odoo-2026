import { useState } from 'react';
import { Truck, LogIn, UserPlus, KeyRound } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast';
import { loginUser, registerUser, googleAuth, verifyOtp, resendOtp } from '../services/api';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Dispatcher' });

  const handleManualAuth = async (e) => {
    e.preventDefault();
    if (showOtp) {
      try {
        const response = await verifyOtp({ email: formData.email, otp });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Email verified successfully!');
        setTimeout(() => onAuthSuccess(), 1000);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Verification failed');
      }
      return;
    }

    try {
      if (isLogin) {
        const response = await loginUser({ email: formData.email, password: formData.password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Welcome back!');
        setTimeout(() => onAuthSuccess(), 1000);
      } else {
        const response = await registerUser(formData);
        toast.success(response.data.message || 'OTP sent to your email!');
        setShowOtp(true);
      }
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        toast.error('Please verify your email first.');
        setShowOtp(true);
        // Optionally trigger resend OTP here
        resendOtp({ email: formData.email }).catch(() => {});
      } else {
        toast.error(err.response?.data?.message || 'Authentication failed');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({ email: formData.email });
      toast.success(response.data.message || 'OTP resent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
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
            {showOtp ? 'Verify your email address' : isLogin ? 'Sign in to access your dashboard' : 'Create an account to start dispatching'}
          </p>
        </div>

        <form onSubmit={handleManualAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {showOtp ? (
            <>
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', textAlign: 'center', letterSpacing: '2px', fontSize: '18px' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
              />
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <KeyRound size={18} /> Verify OTP
              </button>
              <button type="button" onClick={handleResendOtp} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}>
                Resend OTP
              </button>
              <button type="button" onClick={() => setShowOtp(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px' }}>
                Back to {isLogin ? 'Login' : 'Registration'}
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </form>

        {!showOtp && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
