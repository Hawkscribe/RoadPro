import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Theme definitions
const themes = {
  default: {
    primary: '#4361ee',
    secondary: '#3f37c9',
    accent: '#4895ef',
    light: '#f8f9fa',
    dark: '#212529',
    success: '#4cc9f0',
    danger: '#f72585',
    warning: '#f8961e',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  dark: {
    primary: '#7209b7',
    secondary: '#560bad',
    accent: '#480ca8',
    light: '#e5e5e5',
    dark: '#14213d',
    success: '#4cc9f0',
    danger: '#ef233c',
    warning: '#ff9e00',
    background: 'linear-gradient(135deg, #14213d 0%, #000000 100%)',
  },
  nature: {
    primary: '#2a9d8f',
    secondary: '#264653',
    accent: '#e9c46a',
    light: '#f8f9fa',
    dark: '#264653',
    success: '#2a9d8f',
    danger: '#e76f51',
    warning: '#f4a261',
    background: 'linear-gradient(135deg, #e9c46a 0%, #2a9d8f 100%)',
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  body {
    background: ${(props) => props.theme.background};
    min-height: 100vh;
    overflow-x: hidden;
  }
`;

const Container = styled(motion.div)`
  position: relative;
  z-index: 5;
  width: 90%;
  max-width: 1000px;
  display: flex;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  backdrop-filter: blur(10px);
  margin: 2rem auto;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.light};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RightSection = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: ${(props) => props.theme.light};
  color: ${(props) => props.theme.dark};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormToggle = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.accent};
  font-weight: bold;
  cursor: pointer;
  margin: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: #fff;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: bold;
  &:hover {
    background-color: ${(props) => props.theme.secondary};
  }
`;

const FloatingIcon = styled(motion.i)`
  position: absolute;
  opacity: 0.2;
  z-index: 0;
`;

const RoadComplaintsLogin = () => {
  const [activeForm, setActiveForm] = useState('officer');
  const [theme, setTheme] = useState('default');
  const [floatingIcons, setFloatingIcons] = useState([]);

  useEffect(() => {
    const icons = ['car', 'road', 'traffic-light', 'hard-hat', 'construction', 'sign', 'exclamation-triangle'];
    const colors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#f72585', '#f8961e', '#7209b7'];

    const newIcons = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 10,
      duration: Math.random() * 20 + 10
    }));

    setFloatingIcons(newIcons);
  }, []);

  const toggleForm = (form) => {
    setActiveForm(form);
  };

  const handleLogin = (type) => {
    alert(`${type} login successful (demo)`);
  };

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />

      {floatingIcons.map((icon) => (
        <FloatingIcon
          key={icon.id}
          className={`fas fa-${icon.icon}`}
          style={{
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            fontSize: `${icon.size}px`,
            color: icon.color,
          }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <LeftSection>
          <h2>Welcome to RoadComplaints</h2>
          <p>Choose your role to login</p>
          <div>
            <FormToggle onClick={() => toggleForm('officer')}>Officer</FormToggle>
            <FormToggle onClick={() => toggleForm('citizen')}>Citizen</FormToggle>
          </div>
        </LeftSection>

        <RightSection>
          <h3>{activeForm === 'officer' ? 'Officer Login' : 'Citizen Login'}</h3>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button onClick={() => handleLogin(activeForm)}>
            Login as {activeForm.charAt(0).toUpperCase() + activeForm.slice(1)}
          </Button>
        </RightSection>
      </Container>
    </ThemeProvider>
  );
};

export default RoadComplaintsLogin;
