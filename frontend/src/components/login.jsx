import { useState, useEffect } from 'react';

export default function RoadComplaintsLogin() {
  const [activeForm, setActiveForm] = useState('officer');
  const [activeAuthMode, setActiveAuthMode] = useState('login');
  const [theme, setTheme] = useState('default');
  const [floatingIcons, setFloatingIcons] = useState([]);

  // Theme configurations
  const themes = {
    default: {
      primary: '#7e3af2',
      secondary: '#6c2bd9',
      accent: '#4c1d95',
      light: '#f8f9fa',
      dark: '#212529',
      background: 'bg-gradient-to-br from-gray-900 to-black',
      leftPanelBg: 'bg-white',
      leftPanelText: 'text-gray-800',
      rightPanelBg: 'bg-gradient-to-br from-purple-600 to-indigo-800',
      rightPanelText: 'text-white',
      buttonBg: 'bg-purple-600 hover:bg-purple-700',
      buttonText: 'text-white',
    }
  };

  // Generate floating icons for the background
  useEffect(() => {
    const icons = ['car', 'road', 'traffic-light', 'hard-hat', 'exclamation-triangle', 'map-marker-alt', 'tools'];
    const newIcons = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 16 + 16,
      delay: Math.random() * 3,
      duration: Math.random() * 10 + 15,
      opacity: Math.random() * 0.15 + 0.05
    }));
    setFloatingIcons(newIcons);
  }, []);

  const toggleAuthMode = () => {
    setActiveAuthMode(activeAuthMode === 'login' ? 'signup' : 'login');
  };

  const handleAuth = (type) => {
    alert(`${type} ${activeAuthMode} successful (demo)`);
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${currentTheme.background} relative overflow-hidden`}>
      {/* Floating Background Icons */}
      {floatingIcons.map((icon) => (
        <div
          key={icon.id}
          className="absolute z-0 text-gray-700"
          style={{
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            fontSize: `${icon.size}px`,
            opacity: icon.opacity,
            animation: `float ${icon.duration}s ease-in-out ${icon.delay}s infinite alternate`,
          }}
        >
          <i className={`fas fa-${icon.icon}`}></i>
        </div>
      ))}

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
        {/* Left Side - Login Form */}
        <div className={`md:w-1/2 p-6 ${currentTheme.leftPanelBg} ${currentTheme.leftPanelText} rounded-2xl shadow-lg transform transition-all duration-500`}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {activeAuthMode === 'login' ? 'Sign In' : 'Sign Up'}
            </h2>
            
            {/* User Type Toggle */}
            <div className="flex justify-center p-1 bg-gray-100 rounded-lg mb-6">
              <button 
                onClick={() => setActiveForm('officer')}
                className={`py-2 px-4 rounded-md flex-1 transition-all duration-300 flex items-center justify-center ${activeForm === 'officer' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-700 bg-transparent'}`}
              >
                <i className="fas fa-user-shield mr-2"></i>
                Officer
              </button>
              <button 
                onClick={() => setActiveForm('citizen')}
                className={`py-2 px-4 rounded-md flex-1 transition-all duration-300 flex items-center justify-center ${activeForm === 'citizen' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-700 bg-transparent'}`}
              >
                <i className="fas fa-user mr-2"></i>
                Citizen
              </button>
            </div>
          </div>
          
          {/* Social Login */}
          <div className="flex justify-center space-x-4 mb-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition hover:bg-gray-200">
              <span className="text-gray-600 text-lg">G</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition hover:bg-gray-200">
              <span className="text-gray-600 text-lg">f</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition hover:bg-gray-200">
              <span className="text-gray-600 text-lg">in</span>
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500 mb-6">or use your email account</div>
          
          {/* Login Form */}
          <form className="space-y-4">
            <div className="input-box-animation">
              <input 
                type="text" 
                placeholder="Email" 
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300" 
              />
            </div>
            
            <div className="input-box-animation">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300" 
              />
            </div>
            
            {activeAuthMode === 'signup' && (
              <div className="input-box-animation">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-transparent focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300" 
                />
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-600">Remember me</label>
              </div>
              <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">Forgot Password?</a>
            </div>
            
            <button 
              type="button"
              onClick={() => handleAuth(activeForm)}
              className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonText} py-3 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:-translate-y-1 btn-animation`}
            >
              {activeAuthMode === 'login' ? 
                <><i className="fas fa-sign-in-alt mr-2"></i>Sign In as {activeForm.charAt(0).toUpperCase() + activeForm.slice(1)}</> : 
                <><i className="fas fa-user-plus mr-2"></i>Sign Up as {activeForm.charAt(0).toUpperCase() + activeForm.slice(1)}</>
              }
            </button>
          </form>
        </div>
        
        {/* Right Side - Welcome Content */}
        <div className={`md:ml-6 md:w-1/2 ${currentTheme.rightPanelBg} p-8 ${currentTheme.rightPanelText} flex flex-col justify-center items-center rounded-2xl`}>
          <div className="text-center z-10">
            <h2 className="text-3xl font-bold mb-4">
              {activeAuthMode === 'login' ? 'Hello, Friend!' : 'Welcome Back!'}
            </h2>
            <p className="mb-8 text-purple-100">
              {activeAuthMode === 'login' 
                ? 'Register with your personal details to use all the features of Road Complaints portal'
                : 'Sign in to access your account and continue your journey with us'
              }
            </p>
            <button 
              type="button"
              onClick={toggleAuthMode}
              className="border-2 border-white text-white bg-transparent py-2 px-8 rounded-full font-medium hover:bg-white hover:text-purple-700 transition-all duration-300 transform hover:-translate-y-1"
            >
              {activeAuthMode === 'login' ? 'SIGN UP' : 'SIGN IN'}
            </button>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -ml-16 -mb-16"></div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        .input-box-animation {
          opacity: 0;
          animation: fadeInUp 0.5s forwards;
        }
        
        .input-box-animation:nth-child(1) {
          animation-delay: 0.1s;
        }
        
        .input-box-animation:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .input-box-animation:nth-child(3) {
          animation-delay: 0.3s;
        }
        
        .btn-animation {
          opacity: 0;
          animation: fadeInUp 0.5s forwards;
          animation-delay: 0.4s;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
          100% { transform: translateY(-5px) rotate(-5deg); }
        }
        
        input:focus {
          box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
        }
      `}</style>
    </div>
  );
}