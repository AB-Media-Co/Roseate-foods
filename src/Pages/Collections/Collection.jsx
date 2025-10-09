import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import Banner from "../../components/Banner";
import ProductBenefits from "../../components/ProductBenefits";
import WhyShopOurProduct from "../../components/WhyShopOurProduct";
import ShowProductsSection from "./Components/ShowProductsSection";
import ValueCombos from "./Components/ValueCombos";

const benefits = [
    { id: 1, icon: "/productPage/quality.svg", title: "Premium Quality", subtitle: "100% Quality Guarantee" },
    { id: 2, icon: "/productPage/shipping.svg", title: "Swift Shipping", subtitle: "Delivering Across PAN" },
    { id: 3, icon: "/productPage/easy-return.svg", title: "Easy Return", subtitle: "Hassle Return Policy" },
    { id: 4, icon: "/productPage/24by7.svg", title: "24/7 Support", subtitle: "Support every time" },
];

const stats = [
    { label: "OVER", value: "142K", description: "PRODUCTS SOLD" },
    { label: "WITH", value: "95%", description: "POSITIVE REVIEWS" },
    { label: "SELLING IN", value: "12", description: "TERRITORIES" },
];

const testimonials = [
    {
        id: 1,
        rating: 5,
        text: "Great, our stuff is the brand house and it's the real deal!",
        author: "Lane Burney",
        location: "Richmond, IN",
        avatar: "/api/placeholder/60/60",
    },
    {
        id: 2,
        rating: 5,
        text: "I like Shiny Estate more each day because it just works!",
        author: "Mrs. Van Hartmeyer",
        location: "Houston, TX",
        avatar: "/api/placeholder/60/60",
    },
    {
        id: 3,
        rating: 4,
        text: "You've saved our business! Our organic tomatoes are wonderful!",
        author: "Philip Dickens",
        location: "New Plymouth, OH",
        avatar: "/api/placeholder/60/60",
    },
];

const Collection = () => {


    return (
        <div>
            <Breadcrumb />
            <Banner
                desktopSrc="/collectionPage/banner.png"
                mobileSrc="/collectionPage/bannerM.png"
                alt="Collection Banner"
            />
            <ShowProductsSection />


            <Banner
                desktopSrc="/collectionPage/Premiumq.png"
                mobileSrc="/collectionPage/PremiumqM.png"
                alt="Premium Quality Banner"
            />

            <ValueCombos/>

            <WhyShopOurProduct stats={stats} testimonials={testimonials} />

            <ProductBenefits benefits={benefits} />


        </div>
    );
};

export default Collection;
