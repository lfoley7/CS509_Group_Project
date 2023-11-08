import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
                for (let company of JSON.parse(response.data.body)) {
                    let dropdownItem = document.createElement("option");
                    dropdownItem.innerHTML = company.STName + ", $" + company.InventoryBalance;
                    dropdownItem.setAttribute("data-UUID", company.StoreID)
                    document.getElementById("remove-store-options").appendChild(dropdownItem);
                }
            })
            .catch(function (error) {
                console.log(error);
            })

        // Reporting the Inventory
        instance.post("reportInventory")
            .then(function (response) {
                document.getElementById("total-inventory").innerHTML = JSON.parse(response.data.body).InventoryTotal;
            })
            .catch(function (error) {
                console.log(error);
            })
    });

    const removeStore = async () => {
        const StoreID = $('select option:selected').attr("data-UUID");
        // API Call to Remove Store from DB
        await instance.post("removeStore", { "StoreID": StoreID })
            .then(function (response) {
                window.alert("Store Removed!");
            })
            .catch(function (error) {
                console.log(error);
            })
        window.location.reload();
    }

    const navigate = useNavigate();

    return (
        <div className="container">
            <div>{"Total Inventory: "}</div>
            <label id="total-inventory"></label>
            <div>{"Remove Store:"}</div>
            <select id="remove-store-options"></select>
            <button id="remove-store-button" onClick={removeStore}>Remove Store</button>
        </div>
    )
};

export default SiteManagerDashboard;