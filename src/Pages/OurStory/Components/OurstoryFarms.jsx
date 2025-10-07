import React from 'react'
import { StarburstBadge } from '../../../components/StarburstBadge';
import { BrandHeading } from '../../../components/BrandHeading';


const FEATURES = [
    { title: "100% ORGANIC", icon: "/Home/farms/organic.svg" },
    { title: "TRADITIONALLY HANDCRAFTED", icon: "/Home/farms/handC.svg" },
    { title: "FARM TO TABLE FRESHNESS", icon: "/Home/farms/freshness.svg" },
    { title: "NO PRESERVATIVES", icon: "/Home/farms/preservation.svg" },
    { title: "SUSTAINABLE FARMING", icon: "/Home/farms/farming.svg" },
];
const OurstoryFarms = () => {
    return (
        <section className=" py-12 md:py-16">
            {/* Heading */}
            <div className="text-center mb-10 md:mb-14">
                <BrandHeading accentWord="FARMS">
                    WHY ROSEATE
                </BrandHeading>
            </div>

            {/* Grid of badges */}
            <div className="flex items-center no-scrollbar justify-between gap-10 overflow-hidden overflow-x-auto content">
                {FEATURES.map((feature) => (
                    <StarburstBadge
                        
                        key={feature.title}
                        title={feature.title}
                        icon={feature.icon}
                    />
                ))}
            </div>

        </section>
    )
}

export default OurstoryFarms
