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
import Cart from "./Pages/Cart/Cart";
import NotFound from "./Pages/NotFound";
import PrivacyPolicy from "./Pages/PolicyPages/PrivacyPolicy";
import RefundPolicy from "./Pages/PolicyPages/RefundPolicy";
import ShippingPolicy from "./Pages/PolicyPages/ShippingPolicy";
import TermsOfServices from "./Pages/PolicyPages/TermsOfServices";
import CustomerSupport from "./Pages/PolicyPages/CustomerSupport";
import BestSellerPage from "./Pages/BestSeller/BestSellerPage";

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
            <Route path="/cart" element={<Cart />} />
            <Route path="/best-sellers" element={<BestSellerPage />} />
            <Route path="/privacy-policies" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfServices />} />
            <Route path="/customer-support" element={<CustomerSupport />} />

            <Route path="*" element={<NotFound />} />
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
