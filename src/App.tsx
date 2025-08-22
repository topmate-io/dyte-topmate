import React from "react";
import "./App.css";
import { MainScreenComponent } from "./container/mainScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TopmateClient } from "src/TopmateClient/TopmateClient";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<MainScreenComponent />} />
          <Route path="/meeting/:room/:id" element={<TopmateClient />} />
          <Route path="/meeting/:id" element={<TopmateClient />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
