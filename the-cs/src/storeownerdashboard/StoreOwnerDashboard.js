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

    const PROCESSORGEN = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD RYZEN 7000", "AMD RYZEN 6000"];
    const PROCESSOR = ["Intel Xeon", "Intel i9", "Intel i7", "AMD Ryzen 9", "AMD Ryzen 7"];
    const GRAPHICS = ["NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4080", "AMD Radeon Pro W6300",
        "AMD Radeon Pro W6400", "Intel Integrated Graphics", "Intel UHD Graphics 730", "Intel UHD Graphics 770"];

    const addComputer = () => {
        const ComputerID = uuidv4(); // CHANGE ME TO CORRECT GENERATION OF ID
        const StoreID = props.storeID; // CHANGE ME TO CORRECT GENERATION OF ID
        const CName = document.getElementById("CName").value;
        const CPrice = +document.getElementById("CPrice").value;
        const CMemory = document.getElementById("CMemory").value;
        const CStorageSize = document.getElementById("CStorageSize").value;
        const CProcessor = +document.getElementById("CProcessor").value;
        const CProcessorGen = +document.getElementById("CProcessorGen").value;
        const CGraphics = +document.getElementById("CGraphics").value;
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
        const StoreID = props.storeID; // CHANGE ME TO CORRECT GENERATION OF ID
        instance.post("generateInventory", { "StoreID": StoreID })
            .then(function (response) {
                let tr = document.getElementById("generate-inventory-table");
                if (tr.childNodes.length > 0) {
                    while (tr.childNodes.length > 0) {
                        tr.childNodes[tr.childNodes.length - 1].remove();
                    }
                }
                for (let computer of JSON.parse(response.data.body)) {
                    const inventoryRow = document.createElement("tr");
                    const name = document.createElement("td");
                    name.innerHTML = computer.CName;
                    const price = document.createElement("td");
                    price.innerHTML = computer.CPrice;
                    const memory = document.createElement("td");
                    memory.innerHTML = computer.CMemory;
                    const storageSize = document.createElement("td");
                    storageSize.innerHTML = computer.CStorageSize;
                    const processor = document.createElement("td");
                    processor.innerHTML = PROCESSOR[+computer.CProcessor - 1];
                    const processorGen = document.createElement("td");
                    processorGen.innerHTML = PROCESSORGEN[+computer.CProcessorGen - 1];
                    const graphics = document.createElement("td");
                    graphics.innerHTML = GRAPHICS[+computer.CGraphics - 1];
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
            <div>{"Add Computer:"}</div>
            <label>{"Name: "}</label>
            <input id="CName"></input>
            <label>{" Price: "}</label>
            <input id="CPrice"></input>
            <label>{" Memory: "}</label>
            <input id="CMemory"></input>
            <label>{" Storage Size: "}</label>
            <input id="CStorageSize"></input>
            <label>{" Processor: "}</label>
            <select id="CProcessor">
                <option value="1">{"Intel Xeon"}</option>
                <option value="2">{"Intel i9"}</option>
                <option value="3">{"Intel i7"}</option>
                <option value="4">{"AMD Ryzen 9"}</option>
                <option value="5">{"AMD Ryzen 7"}</option>
            </select>
            <label>{" Processor Gen: "}</label>
            <select id="CProcessorGen">
                <option value="1">{"13th Gen Intel"}</option>
                <option value="2">{"12th Gen Intel"}</option>
                <option value="3">{"11th Gen Intel"}</option>
                <option value="4">{"AMD RYZEN 7000"}</option>
                <option value="5">{"AMD RYZEN 6000"}</option>
            </select>
            <label>{" Graphics: "}</label>
            <select id="CGraphics">
                <option value="1">{"NVIDIA GeForce RTX 4090"}</option>
                <option value="2">{"NVIDIA GeForce RTX 4080"}</option>
                <option value="3">{"AMD Radeon Pro W6300"}</option>
                <option value="4">{"AMD Radeon Pro W6400"}</option>
                <option value="5">{"Intel Integrated Graphics"}</option>
                <option value="6">{"Intel UHD Graphics 730"}</option>
                <option value="7">{"Intel UHD Graphics 770"}</option>
            </select>
            <button onClick={addComputer}>{"Add Computer"}</button>
            <br /><br />
            <button onClick={generateInventory}>{"Generate Inventory"}</button>
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