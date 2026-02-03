import React, { useRef, useEffect } from "react";
import { useMusic } from "../hooks/useMusic";

export const MusicPlayer = () => {
  const {
    currentTrack,
    currentTime,
    setCurrentTime,
    formatTime,
    duration,
    setDuration,
    nextTrack,
    prevTrack,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
  } = useMusic();

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack]);

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const handleTimeChange = (e) => {
    const audio = audioRef.current;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src={currentTrack.url} preload="metadata" />

      <div className="track-info">
        <h3>{currentTrack.title || "No song selected"}</h3>
        <p>{currentTrack.artist || "Unknown Artist"}</p>
      </div>

      <div className="progress-container">
        <span>{formatTime(currentTime)}</span>

        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleTimeChange}
          style={{ "--progress": `${progressPercentage}%` }}
        />

        <span>{formatTime(duration)}</span>
      </div>

      <div className="controls">
        <button onClick={prevTrack}>⏮️</button>

        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "⏸️" : "▶️"}
        </button>

        <button onClick={nextTrack}>⏭️</button>
      </div>
      <div className="volume-control">
        <span className="volume-icon">🔈</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="volume-slider"
          onChange={handleVolumeChange}
          value={volume}
        ></input>
      </div>
    </div>
  );
};
