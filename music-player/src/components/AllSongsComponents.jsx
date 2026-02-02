import { useMusic } from "../hooks/useMusic";

export const AllSongsComponents = () => {
  const { allSongs, handlePlaySong, currentTrack, currentSongIndex } =
    useMusic();

  return (
    <div className="all-songs">
      <h2>All Songs ({allSongs.length})</h2>

      <div className="songs-grid">
        {allSongs.map((song, index) => (
          <div
            key={index}
            className={`song-card ${currentSongIndex === index ? "active" : ""}`}
            onClick={() => handlePlaySong(song, index)}
          >
            <div className="song-info">
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
              <span>{song.duration}</span>
            </div>

            <div className="play-button">
              {currentSongIndex === index && currentTrack ? "⏸️" : "▶️"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllSongsComponents;
