import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const OfficerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  // Color palette for the dashboard
  const colors = {
    bg: {
      primary: '#0f172a',
      card: '#1e293b',
      accent: '#334155'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      accent: '#38bdf8',
      title: '#facc15'
    },
    status: {
      pending: '#f97316',
      inProgress: '#3b82f6',
      resolved: '#10b981'
    },
    button: {
      primary: '#3b82f6',
      hover: '#2563eb'
    }
  };

  // Chart colors
  const CHART_COLORS = [colors.status.pending, colors.status.inProgress, colors.status.resolved];

  useEffect(() => {
    const initialIssues = [
      {
        _id: '1',
        title: 'Pothole on Main Road',
        reporterName: 'John Doe',
        reporterEmail: 'john@example.com',
        description: 'Large pothole causing traffic issues.',
        status: 'Pending',
      },
      {
        _id: '2',
        title: 'Damaged Streetlight',
        reporterName: 'Jane Smith',
        reporterEmail: 'jane@example.com',
        description: 'Streetlight not working on Elm Street.',
        status: 'In Progress',
      },
      {
        _id: '3',
        title: 'Water Drainage Problem',
        reporterName: 'Alex Brown',
        reporterEmail: 'alex@example.com',
        description: 'Water drainage blocked causing flooding.',
        status: 'Pending',
      },
      {
        _id: '4',
        title: 'Broken Sidewalk',
        reporterName: 'Emily Wilson',
        reporterEmail: 'emily@example.com',
        description: 'Sidewalk cracked and dangerous for pedestrians.',
        status: 'Resolved',
      },
      {
        _id: '5',
        title: 'Missing Street Sign',
        reporterName: 'Michael Johnson',
        reporterEmail: 'michael@example.com',
        description: 'Street name sign missing at Oak and Maple intersection.',
        status: 'In Progress',
      },
    ];

    setIssues(initialIssues);
    updateStats(initialIssues);
    setIsLoading(false);
  }, []);

  const updateStats = (issueList) => {
    const newStats = {
      pending: issueList.filter(i => i.status === 'Pending').length,
      inProgress: issueList.filter(i => i.status === 'In Progress').length,
      resolved: issueList.filter(i => i.status === 'Resolved').length
    };
    setStats(newStats);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedIssues = issues.map((issue) =>
      issue._id === id ? { ...issue, status: newStatus } : issue
    );
    setIssues(updatedIssues);
    updateStats(updatedIssues);
  };

  const handleUpdateStatus = (id) => {
    const issue = issues.find((issue) => issue._id === id);
    if (issue.status === 'Resolved') {
      // Optionally trigger email to user here
      const filteredIssues = issues.filter((i) => i._id !== id);
      setIssues(filteredIssues);
      updateStats(filteredIssues);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return colors.status.pending;
      case 'In Progress': return colors.status.inProgress;
      case 'Resolved': return colors.status.resolved;
      default: return colors.text.secondary;
    }
  };
  
  // Data for the pie chart
  const chartData = [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Resolved', value: stats.resolved }
  ];

  return (
    <div className="min-h-screen p-8 font-sans" style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}>
      <h2 className="text-center text-4xl mb-8" style={{ color: colors.text.accent, textShadow: '0 0 5px #38bdf8' }}>
        🚧 Officer Dashboard - Road Issue Reports
      </h2>

      {isLoading ? (
        <p className="text-center text-2xl" style={{ color: colors.text.primary }}>Loading...</p>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Analytics Section */}
          <div className="mb-10 p-6 rounded-xl" style={{ backgroundColor: colors.bg.card, boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)' }}>
            <h3 className="text-2xl mb-4" style={{ color: colors.text.accent }}>Issue Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="p-4 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg.accent }}>
                <p className="text-lg" style={{ color: colors.text.secondary }}>Total Issues</p>
                <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>{issues.length}</p>
              </div>
              
              <div className="p-4 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg.accent }}>
                <p className="text-lg" style={{ color: colors.text.secondary }}>Pending</p>
                <p className="text-3xl font-bold" style={{ color: colors.status.pending }}>{stats.pending}</p>
              </div>
              
              <div className="p-4 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg.accent }}>
                <p className="text-lg" style={{ color: colors.text.secondary }}>In Progress</p>
                <p className="text-3xl font-bold" style={{ color: colors.status.inProgress }}>{stats.inProgress}</p>
              </div>
              
              <div className="p-4 rounded-lg flex flex-col items-center justify-center" style={{ backgroundColor: colors.bg.accent }}>
                <p className="text-lg" style={{ color: colors.text.secondary }}>Resolved</p>
                <p className="text-3xl font-bold" style={{ color: colors.status.resolved }}>{stats.resolved}</p>
              </div>
              
              {/* Pie Chart */}
              <div className="col-span-1 md:col-span-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} issues`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="flex flex-col gap-5">
            {issues.length === 0 ? (
              <p className="text-center text-xl" style={{ color: colors.text.secondary }}>No issues left. Great job, Officer! ✅</p>
            ) : (
              issues.map((issue) => (
                <div 
                  key={issue._id} 
                  className="p-6 rounded-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ 
                    backgroundColor: colors.bg.card, 
                    boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)',
                    borderLeft: `4px solid ${getStatusColor(issue.status)}`
                  }}
                >
                  <h3 className="text-2xl mb-3" style={{ color: colors.text.title }}>{issue.title}</h3>
                  <p className="mb-2" style={{ color: colors.text.secondary }}><strong>Reported By:</strong> {issue.reporterName}</p>
                  <p className="mb-2" style={{ color: colors.text.secondary }}><strong>Email:</strong> {issue.reporterEmail}</p>
                  <p className="mb-2" style={{ color: colors.text.secondary }}><strong>Description:</strong> {issue.description}</p>
                  <p className="mb-4" style={{ color: colors.text.secondary }}>
                    <strong>Status:</strong> <span style={{ color: getStatusColor(issue.status) }}>{issue.status}</span>
                  </p>

                  <div className="flex flex-wrap gap-3 items-center mt-4">
                    <select
                      value={issue.status}
                      onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      className="px-3 py-2 text-base rounded-lg focus:outline-none focus:ring-2"
                      style={{ backgroundColor: colors.bg.accent, color: colors.text.primary, borderColor: colors.text.secondary }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(issue._id)}
                      className="px-4 py-2 text-base rounded-lg transition-all duration-300"
                      style={{ 
                        backgroundColor: colors.button.primary, 
                        color: colors.text.primary,
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.button.hover}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.button.primary}
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerDashboard;