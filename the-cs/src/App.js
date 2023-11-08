import { React, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CustomerDashboard from './customerdashboard/CustomerDashboard';
import StoreOwnerDashboard from './storeownerdashboard/StoreOwnerDashboard';
import SiteManagerDashboard from './sitemanagerdashboard/SiteManagerDashboard';
import Navbar from './navbar/Navbar';
import Login from "./login/Login";
import './App.css';

export default function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [storeID, setStoreID] = useState("");

  return (
    <div>
      {window.location.pathname != "/login" ? <Navbar signedIn={signedIn}/> : null}
      <Routes>
        <Route path='/' element={<CustomerDashboard email={email} password={password} signedIn={signedIn} />} />
        <Route path='/login' element={<Login email={email} setEmail={setEmail} password={password} setPassword={setPassword} setSignedIn={setSignedIn} setStoreID={setStoreID} />} />
        <Route path='/storeownerdashboard' element={<StoreOwnerDashboard email={email} password={password} signedIn={signedIn} storeID={storeID} />} />
        <Route path='/sitemanagerdashboard' element={<SiteManagerDashboard email={email} password={password} signedIn={signedIn} />} />
      </Routes>
    </div>
  );
}