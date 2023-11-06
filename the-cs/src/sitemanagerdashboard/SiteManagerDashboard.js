import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import './SiteManagerDashboard.css';
import React from 'react';
import $ from 'jquery';
import { v4 as uuidv4 } from 'uuid';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function SiteManagerDashboard(props) {

    // On Render
    useEffect(() => {
        // Getting the Company Names and Adding them to the Dropdown
        instance.post("fetchStore")
            .then(function (response) {
                console.log(response)
                for (let company of JSON.parse(response.data.body)) {
                    let dropdownItem = document.createElement("option");
                    dropdownItem.innerHTML = JSON.stringify(company.STName);
                    document.getElementById("remove-store-options").appendChild(dropdownItem);
                }
            })
            .catch(function (error) {
                console.log(error);
            })

        // Reporting the Inventory
        instance.post("reportInventory")
            .then(function (response) {
                document.getElementById("total-inventory").innerHTML = response.data;
            })
            .catch(function (error) {
                console.log(error);
            })
    });

    $(function () {
        $('#remove-store-button').on("click", () => {
            const storeID = "12345678-1234-1234-1234-123456789013"; // CHANGE ME TO CORRECT GENERATION OF ID
            // API Call to Remove Store from DB
            instance.post("removeStore", { "storeID": storeID })
                .then(function (response) {
                    window.alert("Store Removed!");
                })
                .catch(function (error) {
                    console.log(error);
                })
            // Remove Store from Dropdown
            $('select option:selected').remove();
        });
    });

    const navigate = useNavigate();

    return (
        <div className="container">
            <div>{"Total Inventory: "}</div>
            <label id="total-inventory"></label>
            <div>{"Remove Store:"}</div>
            <select id="remove-store-options"></select>
            <button id="remove-store-button">Remove Store</button>
        </div>
    )
};

export default SiteManagerDashboard;