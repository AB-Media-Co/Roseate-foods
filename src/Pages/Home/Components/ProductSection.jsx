import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'
import { useStorefront } from "../../../context/StorefrontContext";
import UniversalCarousel from '../../../components/UniversalCarousel';

// import your background images
import bg1 from '/Home/products/bg1.png';
import bg2 from '/Home/products/bg2.png';
import bg3 from '/Home/products/bg3.png';
import Button from '../../../components/ui/Button';

const ProductSection = () => {
    const { collections, collectionsLoading } = useStorefront();

    if (collectionsLoading) return <div>Loading...</div>;

    // fallback if no collections
    if (!collections?.items?.length) return null;

    const bgs = [bg1, bg2, bg3]; // array of your 3 backgrounds

    return (
        <div className="my-10">
            <div className="text-center mb-10 md:mb-14">
                <BrandHeading accentWord="PRODUCTS">
                    Meet our ROSEATE
                </BrandHeading>
            </div>

            <UniversalCarousel
                visibleItemsCount={3}
                isInfinite
                activeDotColor="#ffffff"
                closeDotColor="#a1e3b4"
                farDotColor="#d6f5e0"
                arrowBgColor="#ffffff"
                arrowIconColor="#0d9488"
                arrowHoverBgColor="#e0f2f1"
            >
                {collections.items.map((collection, index) => {
                    const bg = bgs[index % bgs.length]; // repeat bg1,bg2,bg3...
                    return (
                        <div
                            key={collection.id}
                            className="flex flex-col items-center justify-between rounded-xl p-6"
                            style={{
                                backgroundImage: `url(${bg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '480px',
                                color: 'white',
                            }}
                        >
                            <div className="flex flex-col items-center justify-center h-full">
                                <img
                                    src={collection.image?.url}
                                    alt={collection.title}
                                    className="h-[300px] object-contain mb-6"
                                />
                                {collection.description && (
                                    <p className="text-sm mb-2">{collection.description}</p>
                                )}
                                <h3 className="text-2xl font-semibold mb-4">
                                    {collection.title}
                                </h3>
                                {/* <button
                                    className="bg-white text-teal-700 font-medium px-5 py-2 rounded-md hover:bg-teal-50 transition-all"
                                    onClick={() => window.location.href = `/collections/${collection.handle}`}
                                >
                                    Explore Now
                                </button> */}

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-brand-500 hover:text-brand-600 hover:bg-transparent"
                                    onClick={() => window.location.href = `/collections/${collection.handle}`}
                                >
                                    Explore Now
                                </Button>


                            </div>
                        </div>
                    );
                })}
            </UniversalCarousel>
        </div>
    );
};

export default ProductSection;
