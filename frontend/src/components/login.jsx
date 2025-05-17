import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoadComplaintsLogin() {
  const [activeForm, setActiveForm] = useState('officer');
  const [activeAuthMode, setActiveAuthMode] = useState('login');
  const [theme, setTheme] = useState('default');
  const [floatingIcons, setFloatingIcons] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const themes = {
    default: {
      primary: '#7e3af2',
      background: 'bg-gradient-to-br from-gray-900 to-black',
      leftPanelBg: 'bg-white',
      leftPanelText: 'text-gray-800',
      rightPanelBg: 'bg-gradient-to-br from-purple-600 to-indigo-800',
      rightPanelText: 'text-white',
      buttonBg: 'bg-purple-600 hover:bg-purple-700',
      buttonText: 'text-white',
    },
  };

  useEffect(() => {
    const icons = ['car', 'road', 'traffic-light', 'hard-hat', 'exclamation-triangle'];
    const newIcons = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 16 + 16,
      delay: Math.random() * 3,
      duration: Math.random() * 10 + 15,
      opacity: Math.random() * 0.15 + 0.05,
    }));
    setFloatingIcons(newIcons);
  }, []);

  const toggleAuthMode = () => {
    setActiveAuthMode(activeAuthMode === 'login' ? 'signup' : 'login');
  };

  const handleAuth = (type) => {
    if (activeAuthMode === 'login') {
      navigate(type === 'citizen' ? '/user' : '/officer');
    } else {
      alert(`${type} signup successful`);
    }
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 ${currentTheme.background} relative overflow-hidden`}>
      {/* Floating Icons */}
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

      {/* Card */}
      <div className="w-full max-w-4xl bg-black bg-opacity-40 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row z-10">
        {/* Left Panel */}
        <div className={`md:w-1/2 p-6 ${currentTheme.leftPanelBg} ${currentTheme.leftPanelText} rounded-2xl`}>
          <h2 className="text-2xl font-bold mb-4 text-center">
            {activeAuthMode === 'login' ? 'Sign In' : 'Sign Up'}
          </h2>

          <div className="flex justify-center p-1 bg-gray-100 rounded-lg mb-6">
            <button
              onClick={() => setActiveForm('officer')}
              className={`py-2 px-4 rounded-md flex-1 ${activeForm === 'officer' ? 'bg-purple-600 text-white' : 'text-gray-700'}`}
            >
              Officer
            </button>
            <button
              onClick={() => setActiveForm('citizen')}
              className={`py-2 px-4 rounded-md flex-1 ${activeForm === 'citizen' ? 'bg-purple-600 text-white' : 'text-gray-700'}`}
            >
              Citizen
            </button>
          </div>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none"
            />
            {activeAuthMode === 'signup' && (
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none"
              />
            )}

            <button
              type="button"
              onClick={() => handleAuth(activeForm)}
              className={`w-full ${currentTheme.buttonBg} ${currentTheme.buttonText} py-3 rounded-lg font-medium shadow-md`}
            >
              {activeAuthMode === 'login' ? 'Sign In' : 'Sign Up'} as {activeForm}
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className={`md:ml-6 md:w-1/2 ${currentTheme.rightPanelBg} p-8 ${currentTheme.rightPanelText} flex flex-col justify-center items-center rounded-2xl`}>
          <h2 className="text-3xl font-bold mb-4">
            {activeAuthMode === 'login' ? 'Hello, Friend!' : 'Welcome Back!'}
          </h2>
          <p className="mb-8 text-purple-100 text-center">
            {activeAuthMode === 'login'
              ? 'Register to use all features of RoadCare portal'
              : 'Sign in to continue your journey'}
          </p>
          <button
            type="button"
            onClick={toggleAuthMode}
            className="border-2 border-white text-white py-2 px-8 rounded-full hover:bg-white hover:text-purple-700"
          >
            {activeAuthMode === 'login' ? 'SIGN UP' : 'SIGN IN'}
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
            100% { transform: translateY(-5px) rotate(-5deg); }
          }
        `} 
      </style>
    </div>
  );
}
