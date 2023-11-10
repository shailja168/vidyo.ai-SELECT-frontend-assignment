// VideoPlayer.js
import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import WaveSurfer from "wavesurfer.js";

const VideoPlayer = ({ videoUrl, onVideoSelect, videoMetadata }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const waveformRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wavesurferInitialized, setWavesurferInitialized] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDuration = (d) => {
    setDuration(d);
  };

  const handleProgress = ({ played }) => {
    const wavesurfer = waveformRef.current;

    if (wavesurfer) {
      const newPosition = (played / duration) * 100;
      wavesurfer.current?.seekTo(newPosition / 100);
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        videoRef.current.getInternalPlayer(),
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const initializeWaveSurfer = () => {
    if (!wavesurferInitialized) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#f55385",
      });

      wavesurfer.load(videoUrl);

      // Cleanup on component unmount
      return () => {
        wavesurfer.destroy();
      };

      setWavesurferInitialized(true);
    }
  };

  useEffect(() => {
    onVideoSelect(videoRef);
  }, [onVideoSelect]);

  useEffect(() => {
    // Perform WaveSurfer initialization when the video starts playing
    if (isPlaying) {
      const cleanupWaveSurfer = initializeWaveSurfer();
      return cleanupWaveSurfer;
    }
  }, [isPlaying, videoUrl]);
    
    

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* Video Player */}
      <div
        style={{
          flex: "0 0 80%",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ReactPlayer
          ref={videoRef}
          url={videoUrl}
          width="100%"
          height="auto"
          controls={false}
          playing={isPlaying}
          onDuration={handleDuration}
          onProgress={handleProgress}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Play/Pause Button in the middle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            opacity: isHovered ? 1 : 0, // Show only on hover
            transition: "opacity 0.3s ease",
          }}
        >
          <button
            onClick={handlePlayPause}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0)",
              border: "none",
            }}
          >
            <img
              src={isPlaying ? "/assets/pause.png" : "/assets/play.png"}
              alt={isPlaying ? "Pause" : "Play"}
              style={{ width: "50%", height: "100%" }}
            />
          </button>
        </div>
      </div>
      {/* Waveform Container */}
      <div
        id="waveform"
        ref={waveformRef}
        style={{
          flex: "0 0 20%",
          height: "100px",
          width: "100%",
          marginBottom: "20px",
        }}
      ></div>

      {/* Video Metadata */}
      <div style={{ flex: "0 0 20%" }}>
        <div
          style={{
            flex: "0 0 20%",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h4>Metadata:</h4>
          <p
            style={{
              color: "#4f61ff",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
            }}
          >
            Duration: {duration}s | Height: 1080px | Width:1920px
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
