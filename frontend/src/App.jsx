import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Suppliers from "./pages/Suppliers";
import Disruptions from "./pages/Disruptions";
import Analytics from "./pages/Analytics";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <Navbar />

        <main className="main-content">
          <Routes>

            <Route
              path="/"
              element={
                <Navigate to="/dashboard" />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/materials"
              element={<Materials />}
            />

            <Route
              path="/suppliers"
              element={<Suppliers />}
            />

            <Route
              path="/disruptions"
              element={<Disruptions />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;