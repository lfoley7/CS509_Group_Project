import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './CustomerDashboard.css';
import $ from 'jquery';
import { v4 as uuidv4 } from 'uuid';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function CustomerDashboard(props) {

    const PROCESSORGEN = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD RYZEN 7000", "AMD RYZEN 6000"];
    const PROCESSOR = ["Intel Xeon", "Intel i9", "Intel i7", "AMD Ryzen 9", "AMD Ryzen 7"];
    const GRAPHICS = ["NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4080", "AMD Radeon Pro W6300",
        "AMD Radeon Pro W6400", "Intel Integrated Graphics", "Intel UHD Graphics 730", "Intel UHD Graphics 770"];

    const navigate = useNavigate();

    useEffect(() => {
        // Getting the Company Names and Adding them to the Dropdown and Table
        instance.post("fetchStore")
            .then(function (response) {
                for (let company of JSON.parse(response.data.body)) {
                    let tableItem = document.createElement("td");
                    tableItem.className = "generate-table-item"
                    tableItem.innerHTML = company.STName;
                    tableItem.setAttribute("data-UUID", company.StoreID)
                    let tableGenerateButton = document.createElement("button");
                    tableGenerateButton.innerHTML = "Generate Inventory"
                    tableGenerateButton.onclick = () => { generateInventoryClick(company.StoreID) }
                    let br = document.createElement("br");
                    tableItem.appendChild(br);
                    tableItem.appendChild(tableGenerateButton);
                    document.getElementById("all-stores").appendChild(tableItem);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    })

    const generateInventoryClick = (StoreID) => {
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
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="sm-container">
            <div>
                <label>Want to become a Store Owner?&nbsp;</label>
                <a onClick={() => { navigate("/register"); }}>Click here to register!</a>
            </div>
            <table>
                <thead>
                    <tr>
                        Store Names:
                    </tr>
                </thead>
                <tbody id="all-stores">
                </tbody>
            </table>
            {/* <select id="inventory-store-options"></select>
            <button onClick={generateInventoryClick}>{"Generate Selected Store Inventory"}</button> */}
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

export default CustomerDashboard;