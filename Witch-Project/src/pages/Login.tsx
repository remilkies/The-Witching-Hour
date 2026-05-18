import React, { useState } from "react";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";
import mainShelf from "../assets/mainShelf.png";
import AuthClock from "../componenets/AuthenticationClock"
import dreamcatcher from "../assets/dreamcatcher.png";
import Window from "../assets/stainWindow.png";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //authetication phase engine >:D
  const [authStage, setAutheStage] = useState<'form' | 'ritual' | 'passed'>('form');

  //hitting the Node.js backend

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "The bouncers rejected your spell");
      }

      //if credits are valid, hold onto the token and trigger the authentication ritual >:D
      localStorage.setItem("witch_temp_token", data.token);
      console.log("Password passed! Activating the Witching Hour ritual setup...")

      setAuthStage('ritual'); //TRIGGERS THE ZOOMIES SCALE UP LAYPUT THING

    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  //SACRED KEY PASSED TO THE CLOCK
  const handleClockSuccess = () => {

    console.log("Humanity verified! Access granted to the Inner Sanctum");
    setAutheStage('passed');

    //redirect user to the dashbpord room
    //window.location.href = "/dashboard"
  };

  return (
    <>
      {/* Tiele faes out for QTE loop */}
      <div className={`titleContainer ${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>
        <h1 className="appTitle">The Witching H ur</h1>
        <img className="dreamcatcher" src={dreamcatcher} alt="Dreamcatcher" />
      </div>

      <Container fluid className="login-container">
        <Row className="w-100 align-items-center">

          <Col md={4} className={`${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>
            <img src={Window} alt="bat window" className="bat-window" />
          </Col>


          {/* <Col md={4} className={`clock-col ${authStage === 'ritual' ? 'ritual-active' : ''}`}>
            <AuthClock onSuccess={handleClockSuccess} />


            <div className={`w-100 d-flex flex-column align-item-center ${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>

              <div className={`shelfContainer w-100`}>
                <img className="mainShelf" src={mainShelf} alt="Main Shelf" />
              </div>

              

            </div>
          </Col> */}

          <Col md={4}>
          <div className="login-shelf-container">
                <img className="login-shelf" src={mainShelf} alt="Main Shelf" />
              </div>
              <div className="login-card">
                <h2>Login</h2>
                {errorMessage && <div className="error-scroll"> 💀{errorMessage}</div>}

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
                    Begin Ritual
                    {/* user enters password and username and the app dilivers POST request to backend and if the input is worng the error is triggered >:D */}
                  </button>

                </form>
              </div>
          </Col>


          <Col md={4} className={`text-center ${authStage === 'ritual' ? 'fade-out-witchcraft' : ''}`}>
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