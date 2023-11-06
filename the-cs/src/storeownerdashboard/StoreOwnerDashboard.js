import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './StoreOwnerDashboard.css';
import { v4 as uuidv4 } from 'uuid';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function StoreOwnerDashboard(props) {

    const createStore = () => {
        const storeID = uuidv4(); // CHANGE ME TO CORRECT GENERATION OF ID
        const STName = document.getElementById("create-store-name").innerHTML;
        const STLatitude = document.getElementById("x-coordinate").innerHTML;
        const STLongitude = document.getElementById("y-coordinate").innerHTML;
        const STUsername = props.email;
        const STPassword = props.password;
        instance.post("createStore", { "storeID": storeID, "STName": STName, "STLatitude": STLatitude, "STLongitude": STLongitude, "STUsername": STUsername, "STPassword": STPassword })
            .then(function (response) {
                window.alert("Store added!");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const addComputer = () => {
        const ComputerID = uuidv4(); // CHANGE ME TO CORRECT GENERATION OF ID
        const StoreID = uuidv4(); // CHANGE ME TO CORRECT GENERATION OF ID
        const CName = document.getElementById("CName").innerHTML;
        const CPrice = document.getElementById("CPrice").innerHTML;
        const CMemory = document.getElementById("CMemory").innerHTML;
        const CStorageSize = document.getElementById("CStorageSize").innerHTML;
        const CProcessor = document.getElementById("CProcessor").innerHTML;
        const CProcessorGen = document.getElementById("CProcessorGen").innerHTML;
        const CGraphics = document.getElementById("CGraphics").innerHTML;
        instance.post("addComputer", {
            "ComputerID": ComputerID, "StoreID": StoreID, "CName": CName,
            "CPrice": CPrice, "CMemory": CMemory, "CStorageSize": CStorageSize,
            "CProcessor": CProcessor, "CProcessorGen": CProcessorGen, "CGraphics": CGraphics
        })
            .then(function (response) {
                window.alert("Computer added!");
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const generateInventory = () => {
        const StoreID = uuidv4(); // CHANGE ME TO CORRECT GENERATION OF ID
        instance.post("generateInventory")
            .then(function (response) {
                for (let computer in response) {
                    const inventoryRow = document.createElement("tr");
                    const name = document.createElement("td");
                    name.innerHTML = computer.name;
                    const price = document.createElement("td");
                    price.innerHTML = computer.price;
                    const memory = document.createElement("td");
                    memory.innerHTML = computer.memory;
                    const storageSize = document.createElement("td");
                    storageSize.innerHTML = computer.storageSize;
                    const processor = document.createElement("td");
                    processor.innerHTML = computer.processor;
                    const processorGen = document.createElement("td");
                    processorGen.innerHTML = computer.processorGen;
                    const graphics = document.createElement("td");
                    graphics.innerHTML = computer.graphics;
                    inventoryRow.appendChild(name);
                    inventoryRow.appendChild(price);
                    inventoryRow.appendChild(memory);
                    inventoryRow.appendChild(storageSize);
                    inventoryRow.appendChild(processor);
                    inventoryRow.appendChild(processorGen);
                    inventoryRow.appendChild(graphics);
                    document.getElementById("generate-inventory-table").appendChild(inventoryRow);
                }
            })
    }

    return (
        <div className="container">
            <div>{"Create Store:"}</div>
            <label>{"Store Name: "}</label>
            <input id="create-store-name"></input>
            <label>{" X Coordinate: "}</label>
            <input id="x-coordinate" style={{ width: "4rem" }}></input>
            <label>{" Y Coordinate: "}</label>
            <input id="y-coordinate" style={{ width: "4rem" }}></input>
            <button onClick={createStore}>{"Create Store"}</button>
            <br /><br />
            <div>{"Add Computer:"}</div>
            <label>{"Store Name: "}</label>
            <select></select>
            <label>{"Name: "}</label>
            <input id="CName"></input>
            <label>{" Price: "}</label>
            <input id="CPrice"></input>
            <label>{" Memory: "}</label>
            <input id="CMemory"></input>
            <label>{" Storage Size: "}</label>
            <input id="CStorageSize"></input>
            <label>{" Processor: "}</label>
            <input id="CProcessor"></input>
            <label>{" Processor Gen: "}</label>
            <input id="CProcessorGen"></input>
            <label>{" Graphics: "}</label>
            <input id="CGraphics"></input>
            <button>{"Add Computer"}</button>
            <br /><br />
            <button>{"Generate Inventory"}</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Memory</th>
                        <th>Storage Size</th>
                        <th>Processor</th>
                        <th>Processor Gen</th>
                        <th>Graphics</th>
                    </tr>
                </thead>
                <tbody id="generate-inventory-table">
                </tbody>
            </table>
        </div>
    )
};

export default StoreOwnerDashboard;