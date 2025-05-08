import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Home from "./pages/Home";
import TripList from "./pages/TripList";
import TripDetail from "./pages/TripDetail";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

function App() {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TripList />} />
          <Route path="/trip/:id" element={<TripDetail />} />
        </Routes>
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;
