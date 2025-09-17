import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CarGallery from './pages/CarGallery';
import CarViewer from './pages/CarViewer';
// import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CarGallery />} />
          <Route path="/car/:id" element={<CarViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;