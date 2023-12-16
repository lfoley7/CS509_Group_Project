import { useEffect } from "react";
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './CustomerDashboard.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function CustomerDashboard(props) {

    const [comparisonsElements, setComparisonsElements] = React.useState(0);
    const PROCESSORGEN = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD RYZEN 7000", "AMD RYZEN 6000"];
    const PROCESSOR = ["Intel Xeon", "Intel i9", "Intel i7", "AMD Ryzen 9", "AMD Ryzen 7"];
    const GRAPHICS = ["NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4080", "AMD Radeon Pro W6300", "AMD Radeon Pro W6400", "Intel Integrated Graphics", "Intel UHD Graphics 730", "Intel UHD Graphics 770"];
    const STORAGE = ["128GB", "256GB", "512GB", "1TB", "2TB"];
    const MEMORY = ["1GB", "4GB", "8GB", "12GB", "16GB", "32GB"];

    const storageMappings = ["128", "256", "512", "1000", "2000"];
    const memoryMappings = ["1", "4", "8", "12", "16", "32"];

    const navigate = useNavigate();

    const [minPrice, setMinPrice] = React.useState(0);
    const [maxPrice, setMaxPrice] = React.useState(1000000000);

    let storeIDs;
    let filters = [[], [], [], [], []];
    let filterGraphics = [];
    let filterProcessorGen = [];
    let filterProcessors = [];
    let filterStorageSize = [];
    let filterMemory = [];
    let priceSort = '';
    let cLat = 0;
    let cLong = 0;

    const setLoc = () => {
        cLat = document.getElementById("lat").value;
        cLong = document.getElementById("long").value;
        generateInventoryCustomerClick(storeIDs, priceSort, filters, minPrice, maxPrice);
    }

    const setMinMax = () => {
        setMinPrice(document.getElementById("min-price").value);
        setMaxPrice(document.getElementById("max-price").value);
        generateInventoryCustomerClick(storeIDs, priceSort, filters, minPrice, maxPrice);
    }

    function calculateDistance(lat1, lon1, lat2, lon2) 
    {
      var R = 6371;
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return (d/1.609)/1.151;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

    ////Multi Select
    const fetchStores = async () => {
        try {
            const response = await instance.post("fetchStore");
            console.log(response);
            return JSON.parse(response.data.body);
        } catch (error) {
            console.error("Error fetching stores:", error);
            throw error;
        }
    };

    const MultipleSelectCheckmarks = ({ label }) => {
        const [selectionName, setSelectionName] = React.useState([]);
        const [storeNames, setStoreNames] = React.useState([]);

        useEffect(() => {
            generateInventoryCustomerClick(storeIDs, priceSort, filters, minPrice, maxPrice);
        }, []);

        const handleChange = (event) => {
            const {
                target: { value },
            } = event;
            setSelectionName(typeof value === 'string' ? value.split(',') : value,);
            storeIDs = value;
            generateInventoryCustomerClick(storeIDs, priceSort, filters, minPrice, maxPrice);
        };

        const handleOpen = async () => {
            try {
                setStoreNames(await fetchStores());
            } catch (error) {
                console.error("Error in handleOpen:", error);
            }
        };

        return (
            <div>
                <FormControl sx={{ m: 1, width: 250 }}>
                    <InputLabel id={`multiple-checkbox-label-${label}`}>{label}</InputLabel>
                    <Select
                        labelId={`multiple-checkbox-label-${label}`}
                        id={`multiple-checkbox-${label}`}
                        multiple
                        value={selectionName}
                        onChange={handleChange}
                        onOpen={handleOpen}
                        input={<OutlinedInput label={label} />}
                        renderValue={(selected) => {
                            const selectedNames = selected.map(storeID => {
                                const selectedStore = storeNames.find(name => name.StoreID === storeID);
                                return selectedStore ? selectedStore.STName : '';
                            });
                            return selectedNames.join(', ');
                        }}
                    >
                        {storeNames.length > 0 ? (
                            storeNames.map((name) => (
                                <MenuItem key={name.STName} value={name.StoreID}>
                                    <Checkbox checked={selectionName.indexOf(name.StoreID) > -1} />
                                    <ListItemText primary={name.STName} />
                                </MenuItem>
                            ))
                        ) : null}
                    </Select>
                </FormControl>
            </div>
        );
    };

    const FilterOptionMultipleSelect = ({ label, options }) => {
        const [selectionName, setSelectionName] = React.useState([]);

        const handleChange = (event) => {
            const {
                target: { value },
            } = event;

            if (label === 'Price') {
                const lastValue = Array.isArray(value) ? value[value.length - 1] : value;
                setSelectionName(lastValue ? lastValue.split(',') : []);
                priceSort = lastValue !== undefined ? lastValue : '';
                generateInventoryCustomerClick(storeIDs, priceSort, filters, minPrice, maxPrice);
            } else {
                setSelectionName(value ? (typeof value === 'string' ? value.split(',') : value) : []);

                switch (label) {
                    case "Graphics":
                        filterGraphics = value.map(graphics => GRAPHICS.indexOf(graphics) + 1).filter(index => index !== 0);
                        break;
                    case "Processor Generations":
                        filterProcessorGen = value.map(procGen => PROCESSORGEN.indexOf(procGen) + 1).filter(index => index !== 0);
                        break;
                    case "Processors":
                        filterProcessors = value.map(processor => PROCESSOR.indexOf(processor) + 1).filter(index => index !== 0);
                        break;
                    case "Storage Size":
                        filterStorageSize = value.map(storage => storageMappings[STORAGE.indexOf(storage)]);
                        break;
                    case "Memory":
                        filterMemory = value.map(memory => memoryMappings[MEMORY.indexOf(memory)]);
                        break;
                }

                filters = [filterGraphics, filterProcessorGen, filterProcessors, filterStorageSize, filterMemory];
                generateInventoryCustomerClick(storeIDs, priceSort, filters, minPrice, maxPrice);
            }

        };

        return (
            <div>
                <FormControl sx={{ m: 1, width: 250 }}>
                    <InputLabel id={`multiple-checkbox-label-${label}`}>{label}</InputLabel>
                    <Select
                        labelId={`multiple-checkbox-label-${label}`}
                        id={`multiple-checkbox-${label}`}
                        multiple
                        value={selectionName}
                        onChange={handleChange}
                        input={<OutlinedInput label={label} />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {options?.map((option) => (
                            <MenuItem key={option} value={option}>
                                {
                                    label === "Price" ?
                                        null
                                        :
                                        <Checkbox checked={selectionName.indexOf(option) > -1} />
                                }
                                <ListItemText primary={option} />
                            </MenuItem>
                        ))}

                    </Select>
                </FormControl>
            </div>
        );
    };

    const generateInventoryCustomerClick = async (StoreIDs, PriceSort, Filters, MinP, MaxP) => {
        // console.log(StoreIDs);
        // console.log(PriceSort);
        // console.log(Filters);

        if (!StoreIDs || StoreIDs.length === 0) {
            StoreIDs = (await fetchStores()).map(store => store.StoreID);
            console.log(StoreIDs);
        }

        if (!Filters[0] || Filters[0].length === 0) {
            Filters[0] = Array.from({ length: GRAPHICS.length }, (_, index) => index+1);
            console.log(Filters[0]);
        }

        if (!Filters[1] || Filters[1].length === 0) {
            Filters[1] = Array.from({ length: PROCESSORGEN.length }, (_, index) => index+1);
            console.log(Filters[1]);
        }

        if (!Filters[2] || Filters[2].length === 0) {
            Filters[2] = Array.from({ length: PROCESSOR.length }, (_, index) => index+1);
            console.log(Filters[2]);
        }

        if (!Filters[3] || Filters[3].length === 0) {
            Filters[3] = storageMappings;
            console.log(Filters[3]);
        }

        if (!Filters[4] || Filters[4].length === 0) {
            Filters[4] = memoryMappings;
            console.log(Filters[4]);
        }

        console.log(StoreIDs);
        instance.post("GenerateInventoryCustomer", { "StoreIDs": StoreIDs, "CGraphics": Filters[0], "CProcessorGen": Filters[1], "CProcessor": Filters[2], "CStorageSize": Filters[3], "CMemory": Filters[4], "PriceSort": PriceSort, "MinPrice": MinP, "MaxPrice": MaxP })
            .then(function (response) {
                console.log(response);
                let tr = document.getElementById("generate-inventory-table");
                if (tr.childNodes.length > 0) {
                    while (tr.childNodes.length > 0) {
                        tr.childNodes[tr.childNodes.length - 1].remove();
                    }
                }
                for (let computer of JSON.parse(response.data.body)) {
                    console.log(computer.STName);
                    const inventoryRow = document.createElement("tr");
                    const storeName = document.createElement("td");
                    storeName.innerHTML = computer.STName;
                    const name = document.createElement("td");
                    name.innerHTML = computer.CName;
                    const price = document.createElement("td");
                    price.innerHTML = "$"+computer.CPrice;
                    const distance = calculateDistance(cLat, cLong, computer.STLatitude, computer.STLongitude);
                    const shipping = ((distance * 0.03) + computer.CPrice).toFixed(2);
                    const totalPrice = document.createElement("td");
                    totalPrice.innerHTML = "$"+shipping;
                    const memory = document.createElement("td");
                    memory.innerHTML = computer.CMemory + "GB";
                    const storageSize = document.createElement("td");
                    storageSize.innerHTML = computer.CStorageSize + "GB";
                    const processor = document.createElement("td");
                    processor.innerHTML = PROCESSOR[+computer.CProcessor - 1];
                    const processorGen = document.createElement("td");
                    processorGen.innerHTML = PROCESSORGEN[+computer.CProcessorGen - 1];
                    const graphics = document.createElement("td");
                    graphics.innerHTML = GRAPHICS[+computer.CGraphics - 1];
                    const buy = document.createElement("td");
                    let buyButton = document.createElement("button")
                    buyButton.innerHTML = "Buy Now!"
                    buyButton.onclick = async function () {

                        let result = false;
                        await instance.post("buyComputer", {"ComputerID": computer.ComputerID})
                            .then(function (response) {
                                console.log(computer.ComputerID);
                                result = true;
                            })
                            .catch(function (error) {
                                console.log(error);
                                window.alert("Error Buying Computer");
                            })
                        
                        if(result){
                            
                            await instance.post("removecomputer", {"ComputerID": computer.ComputerID})
                            .then(function (response) {
                                console.log("removed computer");
                                window.alert("Computer Purchased");
                            })
                            .catch(function (error) {
                                console.log(error);
                                window.alert("Error Buying Computer");
                            })
                        }    


                        window.location.reload();
                        
                    }
                    inventoryRow.onclick = function () {
                        if (comparisonsElements >= 2) {
                            console.log("too much");
                        } else {
                            const compInventoryRow = document.createElement("tr");
                            compInventoryRow.id = computer.CName;
                            const compStoreName = document.createElement("td");
                            compStoreName.innerHTML = computer.STName;
                            const compName = document.createElement("td");
                            compName.innerHTML = computer.CName;
                            const compPrice = document.createElement("td");
                            compPrice.innerHTML = "$" + computer.CPrice;
                            const compMemory = document.createElement("td");
                            compMemory.innerHTML = computer.CMemory + "GB";
                            const compStorageSize = document.createElement("td");
                            compStorageSize.innerHTML = computer.CStorageSize + "GB";
                            const compProcessor = document.createElement("td");
                            compProcessor.innerHTML = PROCESSOR[+computer.CProcessor - 1];
                            const compProcessorGen = document.createElement("td");
                            compProcessorGen.innerHTML = PROCESSORGEN[+computer.CProcessorGen - 1];
                            const compGraphics = document.createElement("td");
                            compGraphics.innerHTML = GRAPHICS[+computer.CGraphics - 1];
                            compInventoryRow.onclick = function () {
                                document.getElementById(computer.CName).remove();
                                setComparisonsElements(comparisonsElements - 1);
                                if (document.getElementById("comparisons-table-body").children.length > 0) {
                                    document.getElementById("comparisons-table-body").children[0].children[5].style.color = "black";
                                    document.getElementById("comparisons-table-body").children[0].children[6].style.color = "black";
                                    document.getElementById("comparisons-table-body").children[0].children[7].style.color = "black";
                                }
                                
                            }
                            compInventoryRow.appendChild(compStoreName);
                            compInventoryRow.appendChild(compName);
                            compInventoryRow.appendChild(compGraphics);
                            compInventoryRow.appendChild(compProcessorGen);
                            compInventoryRow.appendChild(compProcessor);
                            compInventoryRow.appendChild(compMemory);
                            compInventoryRow.appendChild(compStorageSize);
                            compInventoryRow.appendChild(compPrice);
                            document.getElementById("comparisons-table-body").appendChild(compInventoryRow);
                            setComparisonsElements(comparisonsElements + 1);
                            if (document.getElementById("comparisons-table-body").children.length == 2) {
                                let firstMemory = document.getElementById("comparisons-table-body").children[0].children[5].innerHTML
                                firstMemory = firstMemory.substring(firstMemory - 2);
                                let secondMemory = document.getElementById("comparisons-table-body").children[1].children[5].innerHTML;
                                secondMemory = secondMemory.substring(secondMemory - 2);
                                if (firstMemory > secondMemory) {
                                    document.getElementById("comparisons-table-body").children[0].children[5].style.color = "green";
                                    document.getElementById("comparisons-table-body").children[1].children[5].style.color = "red";
                                } else if (firstMemory < secondMemory) {
                                    document.getElementById("comparisons-table-body").children[1].children[5].style.color = "green";
                                    document.getElementById("comparisons-table-body").children[0].children[5].style.color = "red";
                                }
                                let firstStorageSize = document.getElementById("comparisons-table-body").children[0].children[6].innerHTML;
                                firstStorageSize = firstStorageSize.substring(firstStorageSize - 2);
                                let secondStorageSize = document.getElementById("comparisons-table-body").children[1].children[6].innerHTML;
                                secondStorageSize = secondStorageSize.substring(secondStorageSize - 2);
                                if (firstStorageSize > secondStorageSize) {
                                    document.getElementById("comparisons-table-body").children[0].children[6].style.color = "green";
                                    document.getElementById("comparisons-table-body").children[1].children[6].style.color = "red";
                                } else if (firstStorageSize < secondStorageSize) {
                                    document.getElementById("comparisons-table-body").children[1].children[6].style.color = "green";
                                    document.getElementById("comparisons-table-body").children[0].children[6].style.color = "red";
                                }
                                let firstPrice = document.getElementById("comparisons-table-body").children[0].children[7].innerHTML;
                                firstPrice = firstPrice.substring(1);
                                let secondPrice = document.getElementById("comparisons-table-body").children[1].children[7].innerHTML;
                                secondPrice = secondPrice.substring(1);
                                if (firstPrice < secondPrice) {
                                    document.getElementById("comparisons-table-body").children[0].children[7].style.color = "green";
                                    document.getElementById("comparisons-table-body").children[1].children[7].style.color = "red";
                                } else if (firstPrice > secondPrice) {
                                    document.getElementById("comparisons-table-body").children[1].children[7].style.color = "green";
                                    document.getElementById("comparisons-table-body").children[0].children[7].style.color = "red";
                                }
                                console.log(firstMemory + " " + secondMemory + " " + firstStorageSize + " " + secondStorageSize + " " + firstPrice + " " + secondPrice + " ");
                            }
                        }
                    };
                    inventoryRow.appendChild(storeName);
                    inventoryRow.appendChild(name);
                    inventoryRow.appendChild(graphics);
                    inventoryRow.appendChild(processorGen);
                    inventoryRow.appendChild(processor);
                    inventoryRow.appendChild(memory);
                    inventoryRow.appendChild(storageSize);
                    inventoryRow.appendChild(price);
                    inventoryRow.appendChild(totalPrice);
                    inventoryRow.appendChild(buyButton);
                    document.getElementById("generate-inventory-table").appendChild(inventoryRow);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    ////Multi Select

    return (
        <div className="Content-Container">
            <div className="Filter-Container">
                <div className="Filter-Item">
                    <label>Want to become a Store Owner?&nbsp;</label>
                    <a onClick={() => { navigate("/register"); }}>Click here to register!</a>
                </div>
                <div className="Filter-Item">
                    <label>Your Latitude: </label>
                    <input id="lat" style={{width: "60%"}}></input>
                    <label>Your Longitude: </label>
                    <input id="long" style={{width: "60%"}}></input>
                    <button onClick={setLoc}>Calculate Shipping</button>
                </div>
                <div className="Filter-Item">
                    <MultipleSelectCheckmarks label="Stores" />
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Price" options={['ASC', 'DESC']} />
                    <label>Min Price: </label>
                    <input id="min-price" style={{width: "60%"}}></input>
                    <label>Max Price: </label>
                    <input id="max-price" style={{width: "60%"}}></input>
                    <button onClick={setMinMax}>Price Filter</button>
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Graphics" options={GRAPHICS} />
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Processor Generations" options={PROCESSORGEN} />
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Processors" options={PROCESSOR} />
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Storage Size" options={STORAGE} />
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Memory" options={MEMORY} />
                </div>
            </div>
            <div className="Table-Container">
                <table className="Table-Custom">
                    <thead>
                        <tr>
                            <th>Store</th>
                            <th>Name</th>
                            <th>Graphics</th>
                            <th>Processor Gen</th>
                            <th>Processor</th>
                            <th>Memory</th>
                            <th>Storage Size</th>
                            <th>Price</th>
                            <th>Total Price</th>
                            <th>Buy</th>
                        </tr>
                    </thead>
                    <tbody id="generate-inventory-table">
                    </tbody>
                </table>
                <label>
                    Click on a row to add it to the Comparisons table
                </label>
                <table className="Table-Custom">
                    <thead>
                        <tr>
                            <th>Store</th>
                            <th>Name</th>
                            <th>Graphics</th>
                            <th>Processor Gen</th>
                            <th>Processor</th>
                            <th>Memory</th>
                            <th>Storage Size</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody id="comparisons-table-body">
                    </tbody>
                </table>
                <label>
                    Click on a row to remove it from the Comparisons table
                </label>
            </div>
        </div>
    )
};

export default CustomerDashboard;