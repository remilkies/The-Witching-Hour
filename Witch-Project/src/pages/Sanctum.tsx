import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import '../App.css';
import Grimoire from "../componenets/Grimoire";
import MainApp from "../App";
import Window from "../assets/stainWindow.png";
import GrimoireHolder from "../assets/grimoireHolder.png";
import floor from "../assets/floor.png";

export default function Sanctum() {
    const location = useLocation();
    const navigate = useNavigate();

    //unpaack data sent from loigin >:D
    const currentWitch = location.state?.witch;
    const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);    

    const [lookingAtApp, setIsLookingAtApp] = useState(false);


    if (!currentWitch){
        navigate("/login")
        return null; //if we don't have a witch, banich them back to the login page and render nothing
    }

      //LOGOUT SPELL
  const handleLogout = () => {
    localStorage.removeItem("witch_temp_token");
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