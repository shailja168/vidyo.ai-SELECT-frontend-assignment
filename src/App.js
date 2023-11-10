// App.js
import React, { useState, useRef } from "react";
import VideoPlayer from "./VideoPlayer";

function App() {
  const [videoUrl, setVideoUrl] = useState("/assets/sample.mp4"); // Set to sample.mp4 initially
  const videoRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const fileInputRef = useRef(null);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        backgroundColor: "#242424",
        color: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <h1>VideoPlayer.mp4</h1>
      <button
        onClick={handleButtonClick}
        style={{
          marginBottom: "0px",
          padding: "10px",
          cursor: "pointer",
          backgroundColor: "#4f61ff",
        }}
      >
        Input Video File
      </button>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <div
        style={{
          maxWidth: "800px",
          marginLeft: "auto",
          marginTop: "20px",
          marginBottom: "20px",
          marginRight: "auto",
        }}
      >
        <VideoPlayer
          videoUrl={videoUrl}
          onVideoSelect={(ref) => (videoRef.current = ref)}
        />
      </div>
    </div>
  );
}

export default App;
