import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicPlayer } from "./components/MusicPlayer";

import AllSongsComponents from "./components/AllSongsComponents";
import { PlayListFile } from "./components/PlayListFile";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <main className="app-main">
          <MusicPlayer />

          <Routes>
            <Route path="/" element={<AllSongsComponents />} />
            <Route path="/playlists" element={<PlayListFile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
