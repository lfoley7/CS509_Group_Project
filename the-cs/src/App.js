import { React, useState } from 'react';
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import CustomerDashboard from './customerdashboard/CustomerDashboard';
import StoreOwnerDashboard from './storeownerdashboard/StoreOwnerDashboard';
import SiteManagerDashboard from './sitemanagerdashboard/SiteManagerDashboard';
import Navbar from './navbar/Navbar';
import Login from "./login/Login";
import Register from "./register/Register";
import './App.css';

export default function App() {

  let navbarElement

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [storeID, setStoreID] = useState("");

  const location = useLocation();
  useEffect(() => { }, [location]);

  return (
    <div>
      {location.pathname != "/login" ? <Navbar signedIn={signedIn} /> : null}
      <Routes>
        <Route path='/' element={<CustomerDashboard email={email} password={password} signedIn={signedIn} />} />
        <Route path='/login' element={<Login email={email} setEmail={setEmail} password={password} setPassword={setPassword} setSignedIn={setSignedIn} setStoreID={setStoreID} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/storeownerdashboard' element={<StoreOwnerDashboard email={email} password={password} signedIn={signedIn} storeID={storeID} />} />
        <Route path='/sitemanagerdashboard' element={<SiteManagerDashboard email={email} password={password} signedIn={signedIn} />} />
      </Routes>
    </div>
  );
}