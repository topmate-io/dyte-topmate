import React from "react";
import "./App.css";
import { MainScreenComponent } from "./container/mainScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SimpleDyteClient } from "./exampleComponent/simpleDyteClient";
import { CustomLayout } from "./exampleComponent/customLayout";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<MainScreenComponent />}
          />
          <Route
            path="/simple-dyte-client/meeting/:room/:id"
            element={<SimpleDyteClient />}
          />
          <Route
            path="/custom-layout/meeting/:room/:id"
            element={<CustomLayout />}
          />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
