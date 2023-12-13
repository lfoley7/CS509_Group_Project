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

const instance = axios.create({
    baseURL: 'https://iggshnplye.execute-api.us-east-2.amazonaws.com/Initial/'
});

function CustomerDashboard(props) {

    const PROCESSORGEN = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD RYZEN 7000", "AMD RYZEN 6000"];
    const PROCESSOR = ["Intel Xeon", "Intel i9", "Intel i7", "AMD Ryzen 9", "AMD Ryzen 7"];
    const GRAPHICS = ["NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4080", "AMD Radeon Pro W6300", "AMD Radeon Pro W6400", "Intel Integrated Graphics", "Intel UHD Graphics 730", "Intel UHD Graphics 770"];

    const STORAGE = ["128GB", "256GB", "512GB", "1TB", "2TB"];
    const MEMORY = ["1GB", "4GB", "8GB", "12GB", "16GB", "32GB"];
    const storageMappings = ["128", "256", "512", "1000", "2000"];
    const memoryMappings = ["1", "4", "8", "12", "16", "32"];

    const navigate = useNavigate();

    let storeIDs;
    let filters = [[],[],[],[],[]];
    let filterGraphics = [];
    let filterProcessorGen = [];
    let filterProcessors = [];
    let filterStorageSize = [];
    let filterMemory = [];
    let priceSort = '';

    ////Multi Select
    const fetchStores = async () => {
        try {
            const response = await instance.post("fetchStore");
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
            generateInventoryCustomerClick(storeIDs, priceSort, filters);
        }, []);
    
        const handleChange = (event) => {
            const {
                target: { value },
            } = event;
            setSelectionName( typeof value === 'string' ? value.split(',') : value, );
            storeIDs = value;
            generateInventoryCustomerClick(storeIDs, priceSort, filters);
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
                generateInventoryCustomerClick(storeIDs, priceSort, filters);
            } else {
                setSelectionName(value ? (typeof value === 'string' ? value.split(',') : value) : []);

                switch (label){
                    case "Graphics":
                        filterGraphics = value.map(graphics => GRAPHICS.indexOf(graphics)+1).filter(index => index !== 0);
                        break;
                    case "Processor Generations":
                        filterProcessorGen = value.map(procGen => PROCESSORGEN.indexOf(procGen)+1).filter(index => index !== 0);
                        break;
                    case "Processors":
                        filterProcessors = value.map(processor => PROCESSOR.indexOf(processor)+1).filter(index => index !== 0);
                        break;
                    case "Storage Size":
                        filterStorageSize = value.map(storage => storageMappings[STORAGE.indexOf(storage)]);
                        break;
                    case "Memory":
                        filterMemory = value.map(memory => memoryMappings[MEMORY.indexOf(memory)]);
                        break;
                }
                
                filters = [filterGraphics, filterProcessorGen, filterProcessors, filterStorageSize, filterMemory];
                generateInventoryCustomerClick(storeIDs, priceSort, filters);
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

    const generateInventoryCustomerClick = async (StoreIDs, PriceSort, Filters) => {
        // console.log(StoreIDs);
        // console.log(PriceSort);
        // console.log(Filters);

        if (!StoreIDs || StoreIDs.length === 0) {
            StoreIDs = (await fetchStores()).map(store => store.StoreID);
        }

        if (!Filters[0] || Filters[0].length === 0) {
            Filters[0] = Array.from({ length: GRAPHICS.length }, (_, index) => index);
        }

        if (!Filters[1] || Filters[1].length === 0) {
            Filters[1] = Array.from({ length: PROCESSORGEN.length }, (_, index) => index);
        }

        if (!Filters[2] || Filters[2].length === 0) {
            Filters[2] = Array.from({ length: PROCESSOR.length }, (_, index) => index);
        }

        if (!Filters[3] || Filters[3].length === 0) {
            Filters[3] = storageMappings;
        }

        if (!Filters[4] || Filters[4].length === 0) {
            Filters[4] = memoryMappings;
        }

        instance.post("GenerateInventoryCustomer", {"StoreIDs": StoreIDs, "CGraphics": Filters[0], "CProcessorGen": Filters[1], "CProcessor": Filters[2], "CStorageSize": Filters[3], "CMemory": Filters[4], "PriceSort": PriceSort})
            .then(function (response) {
                let tr = document.getElementById("generate-inventory-table");
                if (tr.childNodes.length > 0) {
                    while (tr.childNodes.length > 0) {
                        tr.childNodes[tr.childNodes.length - 1].remove();
                    }
                }
                for (let computer of JSON.parse(response.data.body)) {
                    const inventoryRow = document.createElement("tr");
                    const storeName = document.createElement("td");
                    storeName.innerHTML = computer.STName;
                    const name = document.createElement("td");
                    name.innerHTML = computer.CName;
                    const price = document.createElement("td");
                    price.innerHTML = "$"+computer.CPrice;
                    const memory = document.createElement("td");
                    memory.innerHTML = computer.CMemory+"GB";
                    const storageSize = document.createElement("td");
                    storageSize.innerHTML = computer.CStorageSize+"GB";
                    const processor = document.createElement("td");
                    processor.innerHTML = PROCESSOR[+computer.CProcessor - 1];
                    const processorGen = document.createElement("td");
                    processorGen.innerHTML = PROCESSORGEN[+computer.CProcessorGen - 1];
                    const graphics = document.createElement("td");
                    graphics.innerHTML = GRAPHICS[+computer.CGraphics - 1];
                    inventoryRow.appendChild(storeName);
                    inventoryRow.appendChild(name);
                    inventoryRow.appendChild(graphics);
                    inventoryRow.appendChild(processorGen);
                    inventoryRow.appendChild(processor);
                    inventoryRow.appendChild(memory);
                    inventoryRow.appendChild(storageSize);
                    inventoryRow.appendChild(price);
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
                    <MultipleSelectCheckmarks label="Stores"/>
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Price" options={['ASC', 'DESC']}/>
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Graphics" options={GRAPHICS}/>
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Processor Generations" options={PROCESSORGEN}/>
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Processors" options={PROCESSOR}/>
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Storage Size" options={["128GB", "256GB", "512GB", "1TB", "2TB"]}/>
                </div>
                <div className="Filter-Item">
                    <FilterOptionMultipleSelect label="Memory" options={["1GB", "4GB", "8GB", "12GB", "16GB", "32GB"]}/>
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
                        </tr>
                    </thead>
                    <tbody id="generate-inventory-table">
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default CustomerDashboard;