// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnnouncementBanner from "./components/AnnouncementBanner";
import Home from "./Pages/Home/Home";
import Nav from "./components/Nav";
import { StorefrontProvider } from "./context/StorefrontContext";
import { CartProvider } from "./state/CartProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OurStory from "./Pages/OurStory/OurStory";
import ProductPage from "./Pages/ProductPage/ProductPage";
import Footer from "./components/Footer";
import Collection from "./Pages/Collections/Collection";
import Contact from "./Pages/Contact/Contact";

function App() {
  return (
    <Router>
      <StorefrontProvider
        productsFirst={50}
        collectionsFirst={20}
        infiniteCollectionsPageSize={20}
        selectedCollectionHandle={null} // or a handle like "new-arrivals"
        collectionProductsFirst={24}
      >
        <CartProvider>
          <AnnouncementBanner />
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/collection/:handle" element={<Collection />} />
            <Route path="/collection/product/:handle" element={<ProductPage />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer/>
        </CartProvider>
      </StorefrontProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
    </Router>
  );
}
export default App;
