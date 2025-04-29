import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripList from './pages/TripList';
import TripDetail from './pages/TripDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/trip/:id" element={<TripDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;