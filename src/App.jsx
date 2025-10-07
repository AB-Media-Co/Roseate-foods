// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnnouncementBanner from "./components/AnnouncementBanner";
import Home from "./Pages/Home/Home";
import Nav from "./components/Nav";
import { StorefrontProvider } from "./context/StorefrontContext";
import OurStory from "./Pages/OurStory/OurStory";

function App() {
  return (
    <Router>
      <StorefrontProvider
        productsFirst={12}
        collectionsFirst={20}
        infiniteCollectionsPageSize={20}
        selectedCollectionHandle={null} // or a handle like "new-arrivals"
        collectionProductsFirst={24}
      >
        <AnnouncementBanner />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          {/* add more routes here */}
        </Routes>
      </StorefrontProvider>
    </Router>
  );
}
export default App;
