import React, { useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Container, Row, Col } from "react-bootstrap";

import AuthClock from "../componenets/AuthenticationClock"
import TrophyRoom from "../componenets/TrophyRoom";

import mainShelf from "../assets/mainShelf.png";
import dreamcatcher from "../assets/dreamcatcher.png";
import Window from "../assets/stainWindow.png";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // to track is a witch is logging in, logged in or creating an account
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentWitch, setCurrentWitch] = useState<any>(null);

//flag to trach if they rigistered THIS SESSION so we know which badge to award
const [wasRegistrationSuccessful, setWasRegistrationSuccessful] = useState(false);
const [isTrophyRoomOpen, setIsTrophyRoomOpen] = useState(false);

  //authetication phase engine >:D
  const [authStage, setAuthStage] = useState<'form' | 'ritual' | 'passed'>('form');

  //hitting the Node.js backend
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("")

    //determines which API endpoint to hit based on mode
    const endpoint = isRegistering ? "register" : "login";

    try {
      const response = await fetch(`http://localhost:5001/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "The bouncers rejected your spell");
      }

      if (isRegistering) {
        setSuccessMessage("✨ Witch registed successfully! Enter your credentials to begin");
        setWasRegistrationSuccessful(true); //MARK THAT THEY'VE SUCCESSFULLY JOINED THE COVERN!
        setIsRegistering(false);
        setPassword("");
      } else {

        //if credits are valid, hold onto the token and trigger the authentication ritual >:D
        localStorage.setItem("witch_temp_token", data.token);
        setCurrentWitch(data.witch); //keeps track of the user id and progress stats
        console.log("Password passed! Activating the Witching Hour ritual setup...")
        setAuthStage('ritual'); //TRIGGERS THE ZOOMIES SCALE UP LAYPUT THING

        // I KINDA WANNA ADD A CRYPT KEEPER BADGE FOR GETTING JSW TOKEN HUNCHUCNHECHUE
      }


    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };


  //SACRED KEY PASSED TO THE CLOCK
  const handleClockSuccess = () => {
    console.log("Humanity verified! Access granted to the Inner Sanctum");
    setAuthStage('passed');

    //redirect user to the dashbpord room
    //window.location.href = "/dashboard"

    //ACHIEVENMT BADGED AWARDED RIGHT BEFORE UPDATING THE STATE >:D
    if (wasRegistrationSuccessful) {
      localStorage.setItem("witching-just-registered", "true");
    } else {
      localStorage.setItem("witching-just-logged-in", "true");
    }

  };

  //LOGOUT SPELL
  const handleLogout = () => {
    localStorage.removeItem("witch_temp_token");
    setCurrentWitch(null);
    setAuthStage('form');
    setUsername("");
    setPassword("");
    setWasRegistrationSuccessful(false); //reset session flags
    setSuccessMessage("Logged out safely. The shadows consume your presence")
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

      alert("💀 Account permanantly deleted");
      handleLogout();

    } catch (err: any) {
      setErrorMessage(err.message);

    }
  };

  return (
    <>
      {/* Tiele faes out for QTE loop */}
      {/* <div className={`login-titleContainer ${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>
        <h1 className="login-appTitle">The Witching H ur</h1>
        <img className="login-dreamcatcher" src={dreamcatcher} alt="Dreamcatcher" />
      </div> */}

      <Container fluid className="login-authetication-container">
        {/* THIS IS FOR THE AUTHENTICATION TRANSITION */}


        <Row className="login-container">

          <Col md={4}>
            <img src={Window} alt="bat window" className="bat-window" />
          </Col>

          {/* MAIN ALTER LOGIN/REGISTRATION COL */}
          <Col md={4} className={`login-col witch-alter-col ${authStage === 'ritual' ? 'ritual-active' : ''}`}>

            {/* if authenticated by form and clock, show control panel >:D */}
            {authStage === 'passed' ? (
              <div className="login-card">
                <h2>Welcome, {currentWitch.username}!</h2>
                <p>Productivity Points: {currentWitch.pp} | Wellness Point: {currentWitch.wp}</p>
                <hr />

              <button onClick={() => setIsTrophyRoomOpen(true)} className="submit-ritual-btn" style={{ marginBottom: '10px'}}>
                View Grimoire Achievments
              </button>

              {/* THE GLORIOUS TROPHY ROOM RENDERING >:D */}
              <TrophyRoom
                isOpen={isTrophyRoomOpen}
                onClose={() => setIsTrophyRoomOpen(false)}
                achievments={currentWitch?.achievments}
                />

                <button onClick={handleLogout} className="submit-ritual-btn">
                  Leave Coven (Logout)
                </button>

                <button onClick={handleDeleteAccount} className="submit-ritual-btn">
                  Banish Account
                </button>
              </div>

            ) : (

              <>
              <AuthClock onSuccess={handleClockSuccess} isActive={authStage === 'ritual'} /> {/* passing in the isActive prop */}

            <div className={`login-shelf-container ${authStage === 'ritual'}`}>
              <img className="login-shelf" src={mainShelf} alt="Main Shelf" />
            </div>

            <div className={`login-card ${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>
              <h2>{isRegistering ? "Join Coven" : "Login"}</h2>


              {errorMessage && <div className="error-scroll"> 💀{errorMessage}</div>}
              {successMessage && <div className="success-note">{successMessage}</div>}
              <form onSubmit={handleFormSubmit}>
                <div className="witch-input-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Witch420"
                    className="witch-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required />
                </div>

                <div className="witch-input-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="asabovesobelow"
                    className="witch-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="submit-ritual-btn">
                  {isRegistering ? "Create Cover Record" : "Begin Ritual"}
                  {/* user enters password and username and the app dilivers POST request to backend and if the input is worng the error is triggered >:D */}
                </button>

              </form>

              {/* WAIT? IS HE SWITCHING MODES?? */}
              <div className="switch-modes">
                <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setErrorMessage("");}}
                style={{background: 'none', border: 'none', color: "#715E72", textDecoration: 'underline', cursor: 'pointer'}}
                >
                  {isRegistering ? "Already a Witch? Login instead" : "New Witch? Claim a username"}
                </button>
              </div>
            </div>
            </>
         
)}

 </Col>

          <Col md={4} className={`${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>
            <img src={Window} alt="bat window" className="bat-window" />
          </Col>
        </Row>
      </Container>


      <div className={`footer ${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>
        <p>Brought to you by REMByte</p>
      </div>
    </>
  )
}