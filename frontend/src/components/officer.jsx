import { useState, useEffect } from 'react';
import styled from 'styled-components';

const OfficerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        status: 'Pending',
      },
      {
        _id: '3',
        title: 'Water Drainage Problem',
        reporterName: 'Alex Brown',
        reporterEmail: 'alex@example.com',
        description: 'Water drainage blocked causing flooding.',
        status: 'Pending',
      },
    ];

    setIssues(initialIssues);
    setIsLoading(false);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue._id === id ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const handleUpdateStatus = (id) => {
    const issue = issues.find((issue) => issue._id === id);
    if (issue.status === 'Resolved') {
      // Optionally trigger email to user here
      setIssues((prev) => prev.filter((i) => i._id !== id));
    }
  };

  return (
    <DashboardContainer>
      <Heading>🚧 Officer Dashboard - Road Issue Reports</Heading>
      {isLoading ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        <IssuesList>
          {issues.length === 0 ? (
            <NoIssuesText>No issues left. Great job, Officer! ✅</NoIssuesText>
          ) : (
            issues.map((issue) => (
              <IssueCard key={issue._id}>
                <IssueTitle>{issue.title}</IssueTitle>
                <IssueInfo><strong>Reported By:</strong> {issue.reporterName}</IssueInfo>
                <IssueInfo><strong>Email:</strong> {issue.reporterEmail}</IssueInfo>
                <IssueInfo><strong>Description:</strong> {issue.description}</IssueInfo>
                <IssueInfo><strong>Status:</strong> {issue.status}</IssueInfo>

                <StatusRow>
                  <StatusSelect
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </StatusSelect>
                  <UpdateButton onClick={() => handleUpdateStatus(issue._id)}>
                    Update Status
                  </UpdateButton>
                </StatusRow>
              </IssueCard>
            ))
          )}
        </IssuesList>
      )}
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  min-height: 100vh;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
`;

const Heading = styled.h2`
  text-align: center;
  color: #38bdf8;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-shadow: 0 0 5px #38bdf8;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #f1f5f9;
`;

const NoIssuesText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #94a3b8;
`;

const IssuesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const IssueCard = styled.div`
  background: #1e293b;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
  transition: 0.3s ease;

  &:hover {
    box-shadow: 0 0 25px rgba(34, 211, 238, 0.4);
    transform: translateY(-5px);
  }
`;

const IssueTitle = styled.h3`
  font-size: 1.8rem;
  color: #facc15;
  margin-bottom: 15px;
`;

const IssueInfo = styled.p`
  font-size: 1rem;
  color: #cbd5e1;
  margin: 8px 0;
`;

const StatusRow = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const StatusSelect = styled.select`
  padding: 10px 12px;
  font-size: 1rem;
  background: #334155;
  color: #f8fafc;
  border: 1px solid #64748b;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #38bdf8;
  }
`;

const UpdateButton = styled.button`
  padding: 10px 18px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #2563eb;
    box-shadow: 0 0 12px #3b82f6;
  }
`;

export default OfficerDashboard;
