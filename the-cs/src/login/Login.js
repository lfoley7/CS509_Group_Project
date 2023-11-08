import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function Login(props) {
    const [showPassword, setShowPassword] = useState(true);
    const navigate = useNavigate();

    document.body.style.height = '0';

    const email = createContext();

    const verifyAccount = () => {
        let email = document.getElementById("email-input").value;
        let password = document.getElementById("pswd").value;

        /* TO DO: Comment out below 3 lines when instance.post is working*/
        props.setEmail(document.getElementsByClassName("email-input")[0]);
        props.setPassword(document.getElementsByClassName("pswd")[0]);
        props.setSignedIn(true);

        instance.post("login", { "STUsername": email, "STPassword": password })
            .then(function (response) {
                props.setEmail(email);
                props.setPassword(password);
                props.setSignedIn(true);
                let type = response.data.body;
                type = type.slice(1, type.length - 1);
                if (type == "") {
                    window.alert("No store associated with account");
                } else if (type == "Site manager") {
                    navigate("/sitemanagerdashboard");
                } else {
                    props.setStoreID(JSON.parse(type).StoreID);
                    navigate("/storeownerdashboard");
                }
            })
            .catch(function (error) {
                window.alert(error.response.data.error);
                console.log(error);
            })
    }

    return (
        <div>
            {props.setEmail("")}
            <div className="split left">
                <div className="color-grayish-blue"></div>
                <div className="flex">
                    <div className="dropdown">
                        <div className="logo-title">The&nbsp;CS</div>
                        <a className="dropdown-text" href="#">The Consignment Store for all your computer needs!</a>
                    </div>
                    <div className="message-container">
                        <div className="welcome-back">Welcome Back!</div>
                        <div className="custom-message">Looking to start gaming, developing, or getting rid of your clutter? We've got you covered!</div>
                    </div>
                </div>
            </div>
            <div className="split right">
                <div className="login-container">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
                    <div className="login-label">Login</div>
                    <div className="email-label">Username</div>
                    <input id="email-input" type="text" placeholder="Enter Your Username" name="uname" required />
                    <div className="pswd-label">Password</div>
                    <div>
                        <input id="pswd" type={showPassword ? "password" : "text"} placeholder="Enter Your Password" name="psw" required />
                        {showPassword ?
                            <i className="bi bi-eye-slash input-password-eye" onClick={() => { setShowPassword(false) }} /> :
                            <i className="bi bi-eye input-password-eye" onClick={() => { setShowPassword(true) }} />}
                    </div>
                    <button className="login" type="login" onClick={() => {
                        verifyAccount();
                    }}>Login</button>
                    <div>
                        <label>Don't have an account?&nbsp;</label>
                        <a onClick={() => { navigate("/register"); }}>Click here to register!</a>
                    </div>
                    <div className="copy-right">Powered by team Nanga Parbat</div>
                </div>
            </div>
        </div>
    )
}
export default Login;