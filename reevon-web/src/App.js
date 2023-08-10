import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { BrowserRouter, Routes, Route ,Navigate  } from "react-router-dom";

import Encrypter from './pages/encrypter';
import Decrypter from './pages/decrypter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/file-encrypt" />} />
        <Route path="/file-encrypt" element={<Encrypter />}></Route>
        <Route path="/file-decrypt" element={<Decrypter />}></Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
