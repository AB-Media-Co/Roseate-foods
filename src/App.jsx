import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// moved Tailwind and styles into index.css
import Cart from './components/Cart';
import ProductGrid from './components/ProductGrid';
import AnnouncementBanner from "./components/AnnouncementBanner";
import Home from "./Pages/Home/Home";

function App() {
  return (
    <Router>
      <AnnouncementBanner />
      {/* <nav style={{ margin: "10px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Products</Link>
        <Link to="/cart">Cart</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/cart" element={<Cart />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
