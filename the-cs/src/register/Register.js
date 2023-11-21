import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import './Register.css';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function Register(props) {
    const navigate = useNavigate();

    const createStore = () => {
        const StoreID = uuidv4(); // CHANGE ME TO CORRECT GENERATION OF ID
        const STName = document.getElementById("create-store-name").value;
        const STLatitude = +document.getElementById("x-coordinate").value;
        const STLongitude = +document.getElementById("y-coordinate").value;
        const STUsername = document.getElementById("create-username").value;
        const STPassword = document.getElementById("create-password").value;
        instance.post("createStore", { "StoreID": StoreID, "STName": STName, "STLatitude": STLatitude, "STLongitude": STLongitude, "STUsername": STUsername, "STPassword": STPassword })
            .then(function (response) {
                window.alert("Store added!");
                navigate("/login");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div style={{ position: "relative", textAlign: "center", top: "5rem", whiteSpace: "pre-line" }}>
            {"Enter the information of your store below!\n\n"}
            <div>{"Create Store:"}</div>
            <label>{"Username: "}</label>
            <input id="create-username"></input>
            <label>{"Password: "}</label>
            <input id="create-password"></input>
            <label>{"Store Name: "}</label>
            <input id="create-store-name"></input>
            <label>{" X Coordinate: "}</label>
            <input id="x-coordinate" style={{ width: "4rem" }}></input>
            <label>{" Y Coordinate: "}</label>
            <input id="y-coordinate" style={{ width: "4rem" }}></input>
            <button onClick={createStore}>{"Create Store"}</button>
        </div>
    )
}
export default Register;