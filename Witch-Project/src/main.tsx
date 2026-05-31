import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login';
import Sanctum from './pages/Sanctum';
// import RhythmKitchen from './componenets/RhythmKitchen';

// ==================================
// SPOTIFY HASH REALM TRAFFIC CONTROL (DUDE KILL ME THIS IS SO MUCH MORE WORK THAN I THOUGHT HOLY COW)
// ==================================

const params = new URLSearchParams(window.location.search);
const spotifyToken = params.get('spotify_token');
const spotifyRefresh = params.get('spotify_refresh');

if (window.location.pathname.includes('/sanctum') || spotifyToken) {

  if (spotifyToken) {
    localStorage.setItem('spotify_access_token', spotifyToken);
  }

  if (spotifyRefresh) {
    localStorage.setItem('spotify_refresh_token', spotifyRefresh)
  }

  window.location.href = window.location.origin + '/#/sanctum'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
    {/* add a # to URL structure (/#/login) which tells Electron that we're just moving around inside the index.html file, SO NOT "file not found" panic. */}
    <Routes>
      {/* TEMP CATCH-ALL ROUTE FOR THESTING COMPONENTS ----- PATH="/*" MEANS NO MATTER WHAT THE URL BROWSER IT CURRENTLY ON, RENDER THIS */}
      {/* <Route path='/*' element={<RhythmKitchen />} />  */}

    {/* When Electron boots up, it lands on the blank / path by default. This new line catches that and immediately shoves the app over to /login so the actual component renders */}
       <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/sanctum" element={<Sanctum />} />
      </Routes>
      </HashRouter> 
      
  </StrictMode>,
)
