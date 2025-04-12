import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #f9f9f9, #e0eafc);
  padding: 2rem;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  font-family: 'Segoe UI', sans-serif;
`;

const Heading = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const PostForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WebcamContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f1f1f1;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  resize: none;
  padding: 0.75rem;
  border-radius: 8px;
  height: 100px;
  font-size: 1rem;
  border: 1px solid #ccc;
  background: #fcfcfc;
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #2980b9;
  }
`;

const PostGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const PostCard = styled(motion.div)`
  border-radius: 12px;
  background: #f4f6f8;
  padding: 1rem;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-3px);
  }
  img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }
  p {
    margin: 0.2rem 0;
    font-size: 0.95rem;
  }
  small {
    color: #888;
    font-size: 0.8rem;
  }
`;

const RoadIssueReporter = () => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [posts, setPosts] = useState([]);

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Unable to fetch location.');
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image || !issueType || !description || !location) {
      alert('Please fill out all fields and capture an image.');
      return;
    }

    const newPost = {
      image,
      issueType,
      description,
      location,
      timestamp: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    setImage(null);
    setDescription('');
    setIssueType('');
  };

  return (
    <PageWrapper>
      <Container>
        <Heading>🚧 Road Issue Reporter</Heading>

        <PostForm onSubmit={handleSubmit}>
          <WebcamContainer>
            {!image ? (
              <Webcam
                audio={false}
                height={240}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={320}
                videoConstraints={{ facingMode: 'environment' }}
              />
            ) : (
              <img src={image} alt="Captured" width={320} height={240} style={{ borderRadius: '10px' }} />
            )}
          </WebcamContainer>

          <Button type="button" onClick={capture}>
            {image ? 'Retake Photo' : 'Capture Photo'}
          </Button>

          <Select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <option value="">Select Issue Type</option>
            <option value="Pothole">Pothole</option>
            <option value="Blocked Drain">Blocked Drain</option>
            <option value="Broken Light">Broken Light</option>
            <option value="Fallen Tree">Fallen Tree</option>
          </Select>

          <TextArea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="button" onClick={getLocation}>
            Get Current Location
          </Button>

          <Button type="submit">Submit Report</Button>
        </PostForm>

        {posts.length > 0 && (
          <>
            <h3 style={{ marginTop: '2rem', color: '#2c3e50' }}>📌 Your Reports</h3>
            <PostGrid>
              {posts.map((post, idx) => (
                <PostCard
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                >
                  <img src={post.image} alt="Issue" />
                  <p><strong>Issue:</strong> {post.issueType}</p>
                  <p><strong>Description:</strong> {post.description}</p>
                  <p><strong>Location:</strong><br />Lat: {post.location.lat}<br />Lng: {post.location.lng}</p>
                  <small>{new Date(post.timestamp).toLocaleString()}</small>
                </PostCard>
              ))}
            </PostGrid>
          </>
        )}
      </Container>
    </PageWrapper>
  );
};

export default RoadIssueReporter;
