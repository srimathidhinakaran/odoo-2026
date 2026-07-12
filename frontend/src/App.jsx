import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Dispatch from './pages/Dispatch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dispatch" element={<Dispatch />} />
          {/* We'll add Vehicles and Drivers pages later */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
