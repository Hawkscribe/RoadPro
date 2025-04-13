import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoadComplaintsLogin from './components/login'; // Assuming this is where your login is located
import RoadCare from './components/landing'; // Add the component for the page to navigate after login
import RoadIssueReporter from './components/userreport';
import OfficerDashboard from './components/officer';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<RoadComplaintsLogin />} />
        <Route path="/" element={< RoadCare/>} />
        <Route path="/user"element={<RoadIssueReporter/>}/>
        <Route path="/officer"element={<OfficerDashboard/>}/>
      </Routes>
    </Router>
  );
};

export default App;
