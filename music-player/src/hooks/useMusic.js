import { useState, useRef, useEffect } from "react";

export const useMusic = () => {
  const songs = [
    {
      id: 1,
      title: "Love sosa",
      artist: "Chief Keef",
      url: "/songs/LoveSosa.mp3",
    },
  ];

  const audioRef = useRef(null);

  const [allSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  const nextTrack = () => {
    const nextIndex = (currentSongIndex + 1) % allSongs.length;
    setCurrentSongIndex(nextIndex);
    setCurrentTrack(allSongs[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const nextIndex =
      currentSongIndex === 0 ? allSongs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(nextIndex);
    setCurrentTrack(allSongs[nextIndex]);
    setIsPlaying(true);
  };

  const seek = (value) => {
    const audio = audioRef.current;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return {
    audioRef,
    allSongs,
    currentTrack,
    currentSongIndex,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    nextTrack,
    prevTrack,
    seek,
    formatTime,

    // 👉 ДОБАВЛЯЕМ ЭТИ ТРИ СТРОКИ
    setIsPlaying,
    setCurrentTime,
    setDuration,
  };
};
