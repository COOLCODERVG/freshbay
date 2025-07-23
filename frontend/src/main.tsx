import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/theme-provider.tsx";
import App from "./App.tsx";
import LoginForm from "./Login.tsx";
import SignupForm from "./Signup.tsx";
import Dashbord from "./dashbord.tsx";
import Inventory from "./Donors/Inventory.tsx";
import FoodBankInventory from "./FoodBanks/Inventory.tsx"
import ResetPassword from "./resetPassword.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NDVIMap from "./CalMap.tsx";
import History from "./Donors/History.tsx"
import Location from "./FoodBanks/Locations.tsx"
import FoodBankMealPlans from "./FoodBanks/MealPlans.tsx"
import Individuals from "./Individuals.tsx"
import HeatMap from "./HeatMap.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashbord />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/donor/inventory" element={<Inventory />} />
          <Route path="/donor/history" element={<History />} />
          <Route path="/foodbank/locations" element={<Location />} />
          <Route path="/foodbank/inventory" element={<FoodBankInventory />} />
          <Route path="/reset-password-form/:resetId" element={<ResetPassword />} />
          <Route path = "/foodbank/mealplans" element={<FoodBankMealPlans/>} />
          <Route path = "/calmap" element={<NDVIMap/>} />
          <Route path = "/heatmap" element={<HeatMap/>} />

          {/* Smart Menu Insights Routes */}
          <Route path = "/individuals" element = {<Individuals/>} />
          {/* Smart Menu Insights Routes */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
