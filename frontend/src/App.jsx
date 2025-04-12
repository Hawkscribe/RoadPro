import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userType) {
      setShake(true);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  return (
    <div className="login-container">
      <div className="login-background">
        {[...Array(10)].map((_, i) => {
          const left = `${Math.random() * 100}%`;
          const top = `${Math.random() * 100}%`;
          const size = `${20 + Math.random() * 40}px`;
          return (
            <motion.div
              key={i}
              className="background-circle"
              initial={{ y: -50, opacity: 0 }}
              animate={{
                y: [0, 20, -10, 20, 0],
                x: [0, 10, -10, 5, 0],
                opacity: [0.2, 0.5, 0.3],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 3,
              }}
              style={{
                left,
                top,
                width: size,
                height: size,
                backgroundColor: i % 2 === 0 ? '#4f46e5' : '#10b981',
              }}
            />
          );
        })}
      </div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="logo-container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ originX: 0.5, originY: 0.5 }}
          >
            <svg className="logo-orbits" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="#e2e8f0" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="35" stroke="#cbd5e1" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>
          <motion.h1
            className="logo-text"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              scale: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
            }}
          >
            CivicConnect
          </motion.h1>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <motion.div
          className={`role-selector ${shake ? 'shake' : ''}`}
          animate={shake ? { x: [0, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <h3 className="role-title">I am a:</h3>
          <div className="role-options">
            {['citizen', 'officer'].map((type) => (
              <motion.button
                key={type}
                className={`role-option ${userType === type ? 'selected' : ''}`}
                onClick={() => setUserType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    backgroundColor: userType === type ? (type === 'citizen' ? '#4f46e5' : '#10b981') : '#f1f5f9',
                    color: userType === type ? 'white' : '#64748b',
                  }}
                  className="role-option-inner"
                >
                  <svg className="role-icon" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </motion.div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {activeTab === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
              >
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                🔄
              </motion.span>
            ) : (
              <span>{activeTab === 'login' ? 'Login' : 'Sign Up'}</span>
            )}
          </motion.button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <motion.button
            className="social-btn google"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="social-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
