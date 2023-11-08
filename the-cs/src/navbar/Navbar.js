import { useNavigate } from "react-router-dom";
import './Navbar.css';

function Navbar(props) {

    var signedIn = props.signedIn;

    const navigate = useNavigate();

    const onHandleNavClick = (dashboardPath) => {
        window.location.pathname = dashboardPath;
    };

    function MouseOver(event) {
        event.target.style.color = '#00B4E5';
    }

    function MouseOut(event) {
        event.target.style.color = "white";
    }

    return (
        <div className="navigation-wrapper">
            <div className="background-image"></div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light" id="navbar"
                style={{ backgroundColor: "rgba(42,87,131,1)" }}>
                <div className="content-container">
                    <i className="the-cs"  onClick={() => { onHandleNavClick("/")}}>The CS</i>
                    {!signedIn ?
                        <div className="nav-bar--dropdown">
                            <button
                                className="dropbtn"
                                onMouseOver={MouseOver}
                                onMouseOut={MouseOut}
                            >
                                <div className="button-content" title="For Site Managers and Store Owners" onClick={() => { onHandleNavClick("/login") }}>
                                    {"Sign in"}
                                </div>
                            </button>

                            <div
                                className="dropdown-content"
                                onMouseOver={MouseOver}
                                onMouseOut={MouseOut}
                            >
                                <a className="link-logout" >Sign Out</a>
                            </div>
                        </div>
                        : null}
                </div>
            </nav>
        </div>
    )
}

export default Navbar;