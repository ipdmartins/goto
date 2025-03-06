import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contributors from './pages/contributors';
import Home from './pages/home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contributors" element={<Contributors />} />
      </Routes>
    </Router>
  );
}

export default App;
