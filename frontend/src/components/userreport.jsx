import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1520262454473-a1a82276a574?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-fixed bg-cover bg-opacity-30">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-10 sm:px-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">Road Issue Reporter</h1>
              <p className="text-gray-600 text-lg">Report road problems in your community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-1 rounded-2xl">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex justify-center mb-4">
                    {!image ? (
                      <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-indigo-100">
                        <Webcam
                          audio={false}
                          height={300}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          width={400}
                          videoConstraints={{ facingMode: "environment" }}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-indigo-100">
                        <img 
                          src={image} 
                          alt="Captured" 
                          width={400} 
                          height={300} 
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={capture}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      {image ? 'Retake Photo' : 'Capture Photo'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Issue Type</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                  >
                    <option value="">Select Issue Type</option>
                    <option value="Pothole">Pothole</option>
                    <option value="Blocked Drain">Blocked Drain</option>
                    <option value="Broken Light">Broken Light</option>
                    <option value="Fallen Tree">Fallen Tree</option>
                    <option value="Road Damage">Road Damage</option>
                    <option value="Traffic Signal Issue">Traffic Signal Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Location</label>
                  <button
                    type="button"
                    onClick={getLocation}
                    className={`w-full px-4 py-3 rounded-xl border ${location ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'} flex items-center justify-center focus:ring-2 focus:ring-indigo-200 hover:bg-gray-100 transition-all duration-200`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {location ? 'Location Captured' : 'Get Current Location'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Issue Description</label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 h-32"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>

        {posts.length > 0 && (
          <div className="mt-12 backdrop-blur-sm bg-white/80 rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:px-10">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Your Reports
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                    <div className="relative h-48">
                      <img src={post.image} alt="Issue" className="w-full h-full object-cover" />
                      <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm rounded-bl-lg px-2 py-1">
                        <span className="text-xs font-medium text-indigo-700">{post.issueType}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">
                          {post.location.lat.toFixed(4)}, {post.location.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(post.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadIssueReporter;