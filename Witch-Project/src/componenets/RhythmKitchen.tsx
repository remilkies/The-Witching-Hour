import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import '../App.css';

import Window from "../assets/stainWindow.png";

import floor from "../assets/floor.png";
import Radio from "../assets/witchingRadio.png";
import Table from "../assets/witchingTable.png";

interface TrackData {
  title: string;
  artist: string;
  albumImg: string;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  id: string;
}

export default function RhythmKitchen() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  //unpaack data sent from loigin >:D
  const currentWitch = location.state?.witch || {
    username: "Coven Apprentice",
    pp: 0,
    pw: 0
  };

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // --- RHYTHM STATES ---

  const [isSpotifyConnected, setIsSpoitifyConnected] = useState(false);     //local state to keep track of wether the music link is actuve
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  //magical mirror to rember the last ID accross rerenders >:D
  const prevTrackIdRef = useRef<string>(""); //ref to store the id of prev played song

  // ============================================
  // 1. --- CAPTURE THE KEYS ---
  // ============================================
  useEffect(() => {
    //look for the url the backend forewarded for the ✨tokens✨
    const token = searchParams.get("spotify_token");
    const refresh = searchParams.get("spotify_refresh")

    if (token && refresh) {
      console.log("⚡ [Sanctum] Caught the Spotifiy keys flying through the ether!")

      //sealing in local storage so they survive browser refreashes
      localStorage.setItem("spotify_access_token", token);
      localStorage.setItem("spotify_refresh_token", refresh);

      setIsSpoitifyConnected(true);
      setIsPanelOpen(true); //automatically slide panel open

      setToastMessage("🔮 Portal Stabalized! Spotify portal linked to the Sanctum >:D");
      setShowToast(true);

      //✨VANISHING ACT✨ - clear the tokens from the url so they dont linger around
      //CHANGES '/sanctum?spotify_token=insertrandomstring123' back to just the good ol '/sanctum'
      setSearchParams({});
    } else {
      //do we alreayd have and existing token from the previous session 
      console.log("👻 No new Spotify keys found in the ether. Checking for existing tokens in the shadows...")
      const existingToken = localStorage.getItem("spotify_access_token");
      if (existingToken) {
        setIsSpoitifyConnected(true);
      }
    }
  }, [searchParams, setSearchParams]); //dependancies for the useEffect - we want to re-run this effect if the search params change (like when we get new tokens) or if the function to set search params changes (which is unlikely but good practice to include) :D

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) {
      console.log("⚡ No refresh token found in the spell components...cannot attempt resurrection.");
      return false;
    }

    try {
      console.log("🥀 Attempting the resurrection spell...");
      const response = await fetch(`http://127.0.0.1:5001/api/spotify/refresh_token?refresh_token=${refreshToken}`);
      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("spotify_access_token", data.access_token);
        console.log("✨ Resurrection successful!");
        if (data.refresh_token) {
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          console.log("✨ A new refresh token has also been obtained and stored for future resurrections.");
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("☠️ Resurrection failed...no access token returned.", err);
      return false;

    }
  };

  // ============================================
  // 2. --- THE FETCH CURRENT PLAYBACK RITUAL ---
  // ============================================

  const fetchPlaybackData = async () => {
    const token = localStorage.getItem("spotify_access_token");

    if (!token) {
      console.log("There is a void where the token should be...playback data ritual cannot commence");
      return;
    }
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        console.log("The bouncers rejected the token...");
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          return fetchPlaybackData(); //try fetching the playback data again with the new token
        } else {
          console.log("Resurrection failed...the token remains dead. Forcing re-login...");
          setIsSpoitifyConnected(false); //reconnect your spotify...sorry love
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_refresh_token");
          return
        }
      }

      if (response.status === 204) {
        setCurrentTrack(null);
        console.log("🔮 No track currently playing in the Rhythm Realm")
        return;
      }

      const data = await response.json();
      if (!data || !data.item) {
        console.log("🔮 The Rhythm Realm is silent...no track data found.")
        return;
      }

      const trackInfo: TrackData = {
        title: data.item.name,
        artist: data.item.artists.map((a: any) => a.name).join(", "),
        albumImg: data.item.album.images[0]?.url || "",
        isPlaying: data.is_playing,
        progressMs: data.progress_ms,
        durationMs: data.item.duration_ms,
        id: data.item.id,
      };
      setCurrentTrack(trackInfo);

      // ---- THE TOAST DETECTOR/DIRECTORL --- summon the toast when a new song starts
      if (trackInfo.id !== prevTrackIdRef.current) {
        console.log("✨ A new track has entered the Rhythm Realm! Summoning the toast ritual...")
        if (prevTrackIdRef.current !== "") {
          setToastMessage(`Now Brewing: "${trackInfo.title}" by ${trackInfo.artist}`);
          setShowToast(true);
        }
        prevTrackIdRef.current = trackInfo.id; //update ref with the current track id for the next comparison
      }
    } catch (err) {
      console.error("☠️  Failed to consult the player oracle:", err);
    }
  };

  useEffect(() => {
    if(showToast) {
      const timer = setTimeout(() => {
      setShowToast(false);
    }, 30000);
    return () => clearTimeout(timer);
  }
}, [showToast]);

  //cheak the playback mirror every 4 seconds >:D
  useEffect(() => {
    if (!isSpotifyConnected) {
      console.log("🔮 Spotify is not yet connected. The playback ritual will commence once the connection is established...");
      return;
    }
    console.log("🔮 The Spotify connection is alive! Starting the playback data ritual...")
    fetchPlaybackData(); //inital fetch to get the current track as soon an we're connected
    const interval = setInterval(fetchPlaybackData, 4000);
    return () => {
      clearInterval(interval); //cleanup the interval on component unmount or when spotify connection status changes
      console.log("☠️ The Spotify connection has been severed. Ending the playback data ritual.")
    }
  }, [isSpotifyConnected]); //dependancy on spotify connection statsu - O0NLY START PLAYBACK DATA RITUAL ONCE WE CONNECT TO THEIR REALM


  // =================================
  // 3. --- COMMAND SPELLS ---
  // =================================
  const sendPlayerCommands = async (endpoint: string, methhod: "PUT" | "POST") => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      console.log("⚡ The token is missing from the spell components...cannot send command to the player.");
      return;
    }
    try {
      await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
        method: methhod,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`🔮 Command "${endpoint}" sent to the player successfully!`);
      setTimeout(fetchPlaybackData, 400); //refresh the playback data after sending a command to reflect the changes in the UI
    } catch (err) {
      console.error(`☠️ Command spell [${endpoint}] failed:`, err);
    }
  };

  //the button ritual for the backend teleportation portal
  const handleConnectSpotify = () => {
    console.log("🔮 Teleporting to the Spotify OAuth Gate...");

    //direct link to the backend login endpoint :P
    window.location.href = "http://127.0.0.1:5001/api/spotify/login";
  };

  return (
    <>

            {showToast && (
              <div className="water-toast">
                <div className="water-toast-header">
                  <h3> ݁₊ ⊹ . ݁˖ .Sanctum Broadcast ݁₊ ⊹ . ݁˖ . ݁</h3>

                  <button className="toast-close" onClick={() => setShowToast(false)} show={showToast} delay={4000} autohide>
                    X
                  </button>
                </div>
                <p>{toastMessage}</p>
              </div>
            )}



                {/* MAIN CONTROL ALCHEMAL STATION */}





                {/* controls pannel display thing */}
                {isPanelOpen && (
<>
{/* CLICK POUTSIDE THE PLAYER TO CLOSE THE MOADL THINGY */}
                  <div className="modal-backdrop-overlay" onClick={() => setIsPanelOpen(false)}/> 

                  <div className="sanctum-control-room">
                    <div className="spotify-card">
                      <button className="close-rhythm-btn toast-close" onClick={() => setIsPanelOpen(false)}>x</button>
                      <h3> ݁₊ ⊹ . ݁˖ .Spotify Portal ݁₊ ⊹ . ݁˖ . ݁</h3>
                    

                      {isSpotifyConnected ? (

                          currentTrack ? (
                            <>

                            <div className="alchemy-player-display">

                              <img src={currentTrack.albumImg}
                                alt="Album Artwork"
                                className="album-artwork"/>

                              {/* TRACK DETAILS */}
                              <h4 style={{ fontSize: "2rem", marginBottom: "0" }}>{currentTrack.title}</h4>
                              <p style={{ fontStyle: "italic" }}>{currentTrack.artist}</p>

                              {/* RITUAL CONTROLS */}
                              <div className="player-buttons" style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "15px" }}>

                                <button className="spotify-action-btn" onClick={() => sendPlayerCommands("previous", "POST")}
                                  >
                                  ◀◀
                                </button>

                                {currentTrack.isPlaying ? (
                                  <button className="spotify-action-btn" onClick={() => sendPlayerCommands("pause", "PUT")}
                                    >
                                    ⏸
                                  </button>
                                ) : (
                                  <button className="spotify-action-btn" onClick={() => sendPlayerCommands("play", "PUT")}
                                    >
                                    ▶
                                  </button>
                                )}

                                <button className="spotify-action-btn" onClick={() => sendPlayerCommands("next", "POST")}
                                  >
                                  ▶▶
                                </button>
                              </div>
                            </div>
                            </>
                          ) : (
                            <div style={{ color: "#1DB954" }}>
                              <p>No track is currently playing in the Rhythm Realm. Wake up Spotify on your phone or PC to stream the leylines!</p>
                            </div>
                          )

                      ) : (
                        <div>
                          <p>The Rhythm Realm is currently silent</p>
                          <button onClick={handleConnectSpotify}
                            style={{ backgroundColor: "#1DB954", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer" }}>
                            Connect Spotify
                          </button>
                        </div>

                      )}
                    </div>
                  </div>
                  </>
                )}
                  
                  <div className="alter-setup">
            <img src={Radio}
            className="magical-radio"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            alt="Alchemal Radio Control" 
            />
            <img src={Table}
            alt="Ritual Table"
            className="ritual-table"/>

                </div>

    </>
  )
}