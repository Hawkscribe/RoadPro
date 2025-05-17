import React, { useState, useRef } from "react";
import { Camera, Upload, MapPin, ChevronDown, Send, Image as ImageIcon } from "lucide-react";

const ReportForm = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState("Pothole");
  const [location, setLocation] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const issueTypes = [
    { value: "Pothole", label: "Pothole", color: "bg-red-500" },
    { value: "Crack", label: "Road Crack", color: "bg-orange-500" },
    { value: "Drainage", label: "Drainage Issue", color: "bg-blue-500" },
    { value: "Debris", label: "Road Debris", color: "bg-yellow-500" },
    { value: "Signage", label: "Damaged Signage", color: "bg-purple-500" },
    { value: "Other", label: "Other Issue", color: "bg-gray-500" }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check your permissions.");
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/png');
      setImage(imageData);
      
      // Stop the camera stream
      const stream = video.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      setIsCapturing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !description || !location) {
      alert("Please fill all fields and allow location access.");
      return;
    }

    const newPost = {
      image,
      description,
      issueType,
      location,
      time: new Date().toLocaleString()
    };

    // Add post to the list
    setPosts((prev) => [newPost, ...prev]);

    // Clear form
    setImage(null);
    setDescription("");
    setIssueType("Pothole");
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to access location. Please allow location access.");
      }
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-blue-600 text-white py-6 px-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Road Issue Reporter</h1>
        <p className="text-center text-blue-100">Help improve your community by reporting road issues</p>
      </div>
      
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
            New Report
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isCapturing ? (
              <div className="space-y-4">
                {!image ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <button
                        type="button"
                        onClick={handleCameraCapture}
                        className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition duration-200"
                      >
                        <Camera size={20} />
                        <span>Take Photo</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg transition duration-200"
                      >
                        <Upload size={20} />
                        <span>Upload Image</span>
                      </button>
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full flex flex-col items-center justify-center text-gray-500">
                      <ImageIcon size={48} className="mb-2 text-gray-400" />
                      <p>No image selected</p>
                      <p className="text-sm">Take or upload a clear photo of the issue</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Selected issue"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded-full w-14 h-14 flex items-center justify-center border-4 border-white"
                  >
                    <Camera size={24} />
                  </button>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block mb-2 font-medium text-gray-700">Issue Type</label>
              <div 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white flex justify-between items-center cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${issueTypes.find(type => type.value === issueType)?.color || 'bg-gray-500'}`}></span>
                  <span>{issueTypes.find(type => type.value === issueType)?.label || issueType}</span>
                </div>
                <ChevronDown size={20} className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                  {issueTypes.map((type) => (
                    <div
                      key={type.value}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIssueType(type.value);
                        setShowDropdown(false);
                      }}
                    >
                      <span className={`w-3 h-3 rounded-full ${type.color}`}></span>
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue in detail..."
              ></textarea>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Location</label>
              <button
                type="button"
                onClick={getLocation}
                className="w-full flex items-center justify-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg transition duration-200"
              >
                <MapPin size={20} />
                <span>{location ? "Update Location" : "Get Current Location"}</span>
              </button>
              {location && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-700">
                    <MapPin size={16} className="mr-2" />
                    <p className="text-sm">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              <Send size={20} />
              <span>Submit Report</span>
            </button>
          </form>
        </div>

        {posts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Recent Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt="Reported issue"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${
                        issueTypes.find(type => type.value === post.issueType)?.color || 'bg-gray-500'
                      }`}>
                        {post.issueType}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 mb-2 line-clamp-2">{post.description}</p>
                    <div className="flex items-center text-gray-600 text-sm mt-2">
                      <MapPin size={14} className="mr-1" />
                      <span className="truncate">
                        {post.location.latitude.toFixed(4)}, {post.location.longitude.toFixed(4)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">{post.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
