import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import VoyagesPage from "./pages/VoyagesPage";
import CustomerPage from "./pages/CustomerPage";
import AgentPage from "./pages/AgentPage";
import CargoPage from "./pages/CargoPage";
import InvoicePage from "./pages/InvoicePage";
import SupplierPage from "./pages/SupplierPage";
import "./styles/global.css";
import { ReferenceDataProvider } from "./context/ReferenceDataProvider";
import { UIStateProvider } from "./context/UIStateContext";

function App() {
  return (
    <UIStateProvider>
      <ReferenceDataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/voyages" element={<VoyagesPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/agents" element={<AgentPage />} />
            <Route path="/cargo" element={<CargoPage />} />
            <Route path="/invoices" element={<InvoicePage />} />
            <Route path="/suppliers" element={<SupplierPage />} />
          </Routes>
        </Router>
      </ReferenceDataProvider>
    </UIStateProvider>
  );
}

export default App;