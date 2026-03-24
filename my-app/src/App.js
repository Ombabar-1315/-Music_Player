import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const playlist = [
  { title: "Lofi Study", artist: "FASSounds", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Tropical House", artist: "Alex-Productions", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Chill Ambient", artist: "Coma-Media", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "https://images.unsplash.com/photo-1478147424095-2fe654e2fe55?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Deep Urban", artist: "AudioCoffee", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Midnight Forest", artist: "Purrple Cat", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", cover: "https://images.unsplash.com/photo-1448375240586-882707db888b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Summer Vibes", artist: "Simon Folwar", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", cover: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Tech Corporate", artist: "Scott Holmes", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Guitar Solo", artist: "Acoustic King", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", cover: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Piano Dream", artist: "Relaxing Music", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", cover: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" },
  { title: "Final Countdown", artist: "Epic Sounds", src: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Raising_Fequency/Ketsa_-_04_-_Intervention.mp3", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300" }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'all', 'one'
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(total || 0);
    if (total) setProgress((current / total) * 100);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    audioRef.current.currentTime = newTime;
    setProgress(percentage * 100);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const playSong = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    setCurrentTime(0);
    setProgress(0);
  };

  const getRandomIndex = () => Math.floor(Math.random() * playlist.length);

  const handleNext = () => {
    if (isShuffle) {
      playSong(getRandomIndex());
    } else {
      nextSong();
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (isShuffle) {
      playSong(getRandomIndex());
    } else if (repeatMode === 'all' || currentIndex < playlist.length - 1) {
      nextSong();
    } else {
      setIsPlaying(false);
    }
  };

  const nextSong = () => playSong((currentIndex + 1) % playlist.length);
  const prevSong = () => playSong((currentIndex - 1 + playlist.length) % playlist.length);

  const toggleMute = () => setIsMuted(!isMuted);
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const toggleRepeat = () => {
    setRepeatMode(prev => prev === 'none' ? 'all' : prev === 'all' ? 'one' : 'none');
  };

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Play failed"));
      }
    } else {
      audioRef.current.pause();
    }
  }, [currentIndex, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  return (
    <div className="player-container">
      <div className="background-blur" style={{ backgroundImage: `url(${playlist[currentIndex].cover})` }}></div>
      <div className="glass-overlay"></div>
      
      <audio 
        ref={audioRef} 
        src={playlist[currentIndex].src} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="main-layout">
        {/* PLAYER CARD */}
        <div className="player-card glass-panel">
          <div className="cover-art-container">
            <img 
              src={playlist[currentIndex].cover} 
              alt="Cover Art" 
              className={`cover-art ${isPlaying ? 'spinning' : ''}`} 
            />
          </div>

          <div className="song-header">
            <h1>{playlist[currentIndex].title}</h1>
            <p>{playlist[currentIndex].artist}</p>
          </div>

          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="progress-area">
            <div className="progress-bar-bg" ref={progressBarRef} onClick={handleSeek}>
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                <div className="progress-knob"></div>
              </div>
            </div>
          </div>

          <div className="main-controls">
            <button className={`ctrl-btn icon-btn ${isShuffle ? 'active-icon' : ''}`} onClick={() => setIsShuffle(!isShuffle)}>
              🔀
            </button>
            <button className="ctrl-btn" onClick={prevSong}>⏮</button>
            <button className="play-circle" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button className="ctrl-btn" onClick={handleNext}>⏭</button>
            <button className={`ctrl-btn icon-btn ${repeatMode !== 'none' ? 'active-icon' : ''}`} onClick={toggleRepeat}>
              {repeatMode === 'one' ? '🔂' : '🔁'}
            </button>
          </div>

          <div className="volume-control">
            <button className="icon-btn volume-icon" onClick={toggleMute}>
              {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeChange} 
              className="volume-slider"
            />
          </div>
        </div>

        {/* PLAYLIST SECTION */}
        <div className="playlist-sidebar glass-panel">
          <h2 className="list-title">Playlist ({playlist.length})</h2>
          <div className="list-items">
            {playlist.map((song, index) => (
              <div 
                key={index} 
                className={`song-row ${index === currentIndex ? 'active' : ''}`}
                onClick={() => playSong(index)}
              >
                <img src={song.cover} alt="Thumb" className="row-thumb" />
                <div className="row-info">
                  <p className="row-name">{song.title}</p>
                  <p className="row-artist">{song.artist}</p>
                </div>
                {index === currentIndex && isPlaying && <div className="wave-icon">♪</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;