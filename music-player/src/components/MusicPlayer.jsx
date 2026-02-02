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
  } = useMusic();

  const audioRef = useRef(null);

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

  const handleTimeChange = (e) => {
    const audio = audioRef.current;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
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
    </div>
  );
};
