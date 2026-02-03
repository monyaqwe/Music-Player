import { useState, useRef, useEffect } from "react";

export const useMusic = () => {
  // Автоматически импортируем ВСЕ mp3 из public/songs
  const importedSongs = import.meta.glob("/public/songs/*.mp3", {
    eager: true,
  });

  // Превращаем файлы в массив песен
  const songs = Object.keys(importedSongs).map((path, index) => {
    const fileName = path.split("/").pop().replace(".mp3", "");

    // По умолчанию
    let artist = "Unknown Artist";
    let title = fileName;

    // Если формат "Artist - Title"
    if (fileName.includes("-")) {
      const [rawArtist, rawTitle] = fileName.split("-");

      // Функция для красивого форматирования
      const format = (str) =>
        str
          .trim()
          .replace(/_/g, " ")
          .replace(/([a-z])([A-Z])/g, "$1 $2") // LoveSosa → Love Sosa
          .replace(/\s+/g, " ") // убрать двойные пробелы
          .replace(/\b\w/g, (c) => c.toUpperCase()); // каждое слово с большой буквы

      artist = format(rawArtist);
      title = format(rawTitle);
    }

    return {
      id: index + 1,
      title,
      artist,
      url: path.replace("/public", ""), // /public/songs/... → /songs/...
    };
  });

  const audioRef = useRef(null);

  const [allSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

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
    setIsPlaying,
    setCurrentTime,
    setDuration,
    volume,
    setVolume,
  };
};
