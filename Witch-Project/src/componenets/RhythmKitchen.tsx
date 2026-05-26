import React, {useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import '../App.css';

import Window from "../assets/stainWindow.png";

import floor from "../assets/floor.png";

export default function RhythmKitchen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    //unpaack data sent from loigin >:D
    const currentWitch = location.state?.witch || {
        username: "Auch-Witch",
        pp: 0,
        pw: 0
    };


   

    //local state to keep track of wether the music link is actuve
    const [isSpotifyConnected, setIsSpoitifyConnected] = useState(false);

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

    //the button ritual for the backend teleportation portal
    const handleConnectSpotify = () => {
      console.log("🔮 Teleporting to the Spotify OAuth Gate...");

      //direct link to the backend login endpoint :P
      window.location.href = "http://127.0.0.1:5001/api/spotify/login";
    };
  return (
    <>
    <div className="sanctum-wallpaper-wrapper">
        
        <div className="sanctum-section dashboard-room">

    <div className="dashboard-sanctum">
        <h2 style={{marginTop: "1em"}}>Welcome to the Inner Sanctum, {currentWitch.username}!</h2>
        <p>PP: {currentWitch.pp} | WP: {currentWitch.wp}</p> {/*maybe change this to say something else if the user hasnt accumulated aby points yet*/}

        <Container fluid className="sanctum-container">
        {/* THIS IS FOR THE AUTHENTICATION TRANSITION */}


        <Row className="sanctum-row">

          <Col md={4}>
            <img src={Window} alt="bat window" className="bat-window" />
          </Col>

          {/* MAIN ALTER LOGIN/REGISTRATION COL */}
          <Col md={4}>

<div className="sanctum-control-room">
  <div className="spotify-card">
    <h3>Rhythm Kitchen Status</h3>

    {isSpotifyConnected ? (
      <div style={{color: "#1DB954", fontWeight: "bold"}}>
        <p>Connected to Spotify! Your musical rituals are ready to commence.</p>
        {/* ------------ INSEART LIVE TRACK DISPLAY HERE >:D ----------------- */}
        </div>
    ) : (
      <div>
        <p>The Rhythm Realm is currently silent</p>
        <button onClick={handleConnectSpotify}
        style={{backgroundColor: "#1DB954", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "20px", cursor: "pointer"}}>
          Connect Spotify
          </button>
      </div>

    )}
  </div>
</div>

          </Col>

          <Col md={4}>
            <img src={Window} alt="bat window" className="bat-window" />
          </Col>
        </Row>
      </Container>


<img src={floor} alt="wood floor" className="sanctum-floor" />

        </div>
        </div>


        </div>

        </>
  )
}