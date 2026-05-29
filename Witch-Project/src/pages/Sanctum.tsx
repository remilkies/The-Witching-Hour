import React, {useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import '../App.css';
import Grimoire from "../componenets/Grimoire";
import MainApp from "../App";
import Window from "../assets/stainWindow.png";
import GrimoireHolder from "../assets/grimoireHolder.png";
import floor from "../assets/floor.png";
import RhythmKitchen from "../componenets/RhythmKitchen";

export default function Sanctum() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    //unpaack data sent from loigin >:D
    // const currentWitch = location.state?.witch;
        // get data from navigation state, fallback to localStorage if we just redirected from spotify

        const [currentWitch, setCurrentWitch] = useState(() => {
console.log("[Sanctum Boot 1] Sanctum is mounting...");
console.log("[Sanctum Boot 2] location.state?witch is:", location.state?.witch);
          if (location.state?.witch) {
            console.log("[Sanctum Boot 3] Witch identified in nav! Sealing in localStorgae...");
            localStorage.setItem("current_witch", JSON.stringify(location.state.witch));
    
            return location.state.witch
    
          }
    
    
    
          const savedWitch = localStorage.getItem("current_witch");
    console.log("[Sanctum Boot 4] Cheaked localStorage fo 'current_witch'. Result:", savedWitch);
          return savedWitch ? JSON.parse(savedWitch) : null
    
        });

        
    const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);    

    const [lookingAtApp, setIsLookingAtApp] = useState(false);

    //local state to keep track of wether the music link is actuve
    const [isSpotifyConnected, setIsSpoitifyConnected] = useState(false);


    // useEffect(() => {
    //   //look for the url the backend forewarded for the ✨tokens✨
    //   const token = searchParams.get("spotify_token");
    //   const refresh = searchParams.get("spotify_refresh")

    //   if (token && refresh) {
    //     console.log("⚡ [Sanctum] Caught the Spotifiy keys flying through the ether!")

    //     //sealing in local storage so they survive browser refreashes
    //     localStorage.setItem("spotify_access_token", token);
    //     localStorage.setItem("spotify_refresh_token", refresh);

    //     setIsSpoitifyConnected(true);

    //     //✨VANISHING ACT✨ - clear the tokens from the url so they dont linger around
    //     //CHANGES '/sanctum?spotify_token=insertrandomstring123' back to just the good ol '/sanctum'
    //     setSearchParams({});
    //   } else {
    //     //do we alreayd have and existing token from the previous session 
    //     console.log("👻 No new Spotify keys found in the ether. Checking for existing tokens in the shadows...")
    //     const existingToken = localStorage.getItem("spotify_access_token");
    //     if (existingToken) {
    //       setIsSpoitifyConnected(true);
    //     }
    //   }
    // }, [searchParams, setSearchParams]); //dependancies for the useEffect - we want to re-run this effect if the search params change (like when we get new tokens) or if the function to set search params changes (which is unlikely but good practice to include) :D

    //the button ritual for the backend teleportation portal
    const handleConnectSpotify = () => {
      console.log("🔮 Teleporting to the Spotify OAuth Gate...");

      //direct link to the backend login endpoint :P
      window.location.href = "http://localhost:5001/api/spotify/login";
    };

useEffect(() => {//useEffect so it triggers safely after React handles its business, and just return null if the witch isn't authenticated yet
      if (!currentWitch) { //React doesn't like side-effects during render cycles!
        console.error("[Sanctium Gaurd] FATAL: currentWitch is null! The shadows are consuming you! Retreating to /login...")
        navigate("/login")
       
    } else {
      console.log("[Sanctum Gaurd] Witch identity verified. Safe to stay.")
    }
}, [currentWitch, navigate]);

if (!currentWitch){
  return null; //if we don't have a witch, banich them back to the login page and render nothing
}


      //LOGOUT SPELL
  const handleLogout = () => {
    localStorage.removeItem("witch_temp_token");
    localStorage.removeItem("current_witch");
    alert("Logged out safely. The shadows consume your presence")
    navigate("/login");
  }


  //THE SPELL OF BANISHMENT (DELETE ACCOUNT FROM DATABASE)
  const handleDeleteAccount = async () => {
    if (!currentWitch?.id) return;

    const doubleCheak = window.confirm("Are you sure you wish to be banished from the coven? This spellconnot be undone!");
    if (!doubleCheak) return;

    try {
      //HITS BACKEND ROUTER.DELETE("/:id") ENPOINT
      const response = await fetch(`http://localhost:5001/api/${currentWitch.id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Banishment failed. Your soul stays here.");

      alert("Account permanantly deleted");
      handleLogout();

    } catch (err: any) {
      alert(err.message);

    }
  };

  return (
    <>
    <div className="sanctum-wallpaper-wrapper">
        <div className={`sanctum-slider ${lookingAtApp ? "slide-to-app" : ""}`}>
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
        {/* bookshelf and grimoire */}
        
<div className="sanctum-menu-column">
    <div className="sanctum-menu-zone">
        <button onClick={() => setIsLookingAtApp(true)} className="submit-ritual-btn">
            Start the Witching Hour
        </button>

<div className="ritual-controls">
<button onClick={handleLogout} className="submit-ritual-btn">
    Leave Coven
</button>

<button onClick={handleDeleteAccount} className="submit-ritual-btn delete-account-btn">
    Banish Self from Coven
</button>
</div>
</div>
</div>

{/* <div className="sanctum-control-room">
  <div className="spotify-card">
    <h3>Rhythm Kitchen Status</h3>

    {isSpotifyConnected ? (
      <div style={{color: "#1DB954", fontWeight: "bold"}}>
        <p>Connected to Spotify! Your musical rituals are ready to commence.</p> */}
        {/* ------------ INSEART LIVE TRACK DISPLAY HERE >:D ----------------- */}
        {/* </div>
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
</div> */}



        <Grimoire
            isOpen={isGrimoireOpen}
            onClose={() => setIsGrimoireOpen(false)}
            achievements={currentWitch.achievements}
            />

          </Col>

          <Col md={4}>
            <img src={Window} alt="bat window" className="bat-window" />
          </Col>
        </Row>
      </Container>

{/* SUMMON THE RHYTHM PORTAL COMP[ONENTS >;D */}
<RhythmKitchen />

{/* grimoire holder */}
<button className="open-grimoire-btn" onClick={() => setIsGrimoireOpen(true)}>
            <img src={GrimoireHolder} alt="grimoire holder" className="grimoire-holder" />
        </button>

<img src={floor} alt="wood floor" className="sanctum-floor" />

        </div>
        </div>

        {/* MAINAPP THINGY THING */}

        <div className="sanctum-section app-room">
            

            <div className="main-app-container-wrapper">
                <MainApp />
                <button className="submit-ritual-btn back-to-sanctum-btn"
            onClick={() => setIsLookingAtApp(false)}
            >
                Back To Sanctum
            </button>
            </div>
        </div>
        </div>
        
        </div>
        </>
  )
}