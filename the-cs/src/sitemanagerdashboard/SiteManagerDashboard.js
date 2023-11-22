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
                    let tableRow = document.createElement("tr");
                    let tableItemName = document.createElement("td");
                    tableItemName.innerHTML = company.STName;
                    tableItemName.setAttribute("data-UUID", company.StoreID);
                    let tableItemBalance = document.createElement("td");
                    tableItemBalance.innerHTML = "$" + company.Balance;
                    let tableItemInventoryValue = document.createElement("td");
                    tableItemInventoryValue.innerHTML = "$" + company.InventoryBalance;
                    let tableItemRemoveTD = document.createElement("td");
                    let tableItemRemove = document.createElement("button");
                    tableItemRemove.innerHTML = "Remove Store";
                    tableItemRemove.onclick = async function () {
                        // API Call to Remove Store from DB
                        await instance.post("removeStore", { "StoreID": company.StoreID })
                            .then(function (response) {
                                window.alert("Store Removed!");
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                        window.location.reload();
                    };
                    tableItemRemoveTD.appendChild(tableItemRemove)
                    tableRow.appendChild(tableItemName);
                    tableRow.appendChild(tableItemBalance);
                    tableRow.appendChild(tableItemInventoryValue);
                    tableRow.appendChild(tableItemRemoveTD);
                    document.getElementById("all-stores").appendChild(tableRow);
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        // Reporting the Inventory
        instance.post("reportInventory")
            .then(function (response) {
                document.getElementById("total-sitewide-listing-value").innerHTML = "Total Site Inventory Value: $" + JSON.parse(response.data.body).InventoryTotal;
            })
            .catch(function (error) {
                console.log(error);
            });

        instance.post("fetchSMBalance")
            .then(function (response) {
                document.getElementById("total-site-manager-balance").innerHTML = "Site Manager Balance: $" + JSON.parse(response.data.body)[0].SMBalance;
            })
            .catch(function (error) {
                console.log(error);
            })
    });

    const removeStore = async (StoreID) => {
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
        <div className="sm-container">
            {/* <div>{"Total Site Inventory Value: "}</div> */}
            <label id="total-sitewide-listing-value"></label>
            {/* <div>{"Site Manager Balance: "}</div> */}
            <label id="total-site-manager-balance"></label>
            <table className="table-sm">
                <thead>
                    <tr>
                        <th>
                            Store Names
                        </th>
                        <th>
                            Balance
                        </th>
                        <th>
                            Inventory Value
                        </th>
                        <th>
                            Remove Store
                        </th>
                    </tr>
                </thead>
                <tbody id="all-stores">
                </tbody>
            </table>
        </div>
    )
};

export default SiteManagerDashboard;