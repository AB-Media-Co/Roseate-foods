import React from "react";
import Button from "./ui/Button";
import { BrandHeading } from "./BrandHeading";
import { StarburstBadge } from "./StarburstBadge";
import {
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const FEATURES = [
    { title: "100% ORGANIC", icon: "/ProductNature.svg" },
    { title: "TRADITIONALLY HANDCRAFTED", icon: "/productJars.svg" },
    { title: "FARM TO TABLE FRESHNESS", icon: "/farm.svg" },
    { title: "NO PRESERVATIVES", icon: "/productLeaf.svg" },
    { title: "SUSTAINABLE FARMING", icon: "/susFarming.svg" },
  ];

  return (
    <footer
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url(/footer.png)" }}
    >
      {/* Content container */}
      <div className="relative z-10">
        {/* Why Roseate Farms Section */}
        <div className="content py-16">
          <div className="text-center">
            <BrandHeading
              className="text-subheading text-white uppercase mb-12"
              accentClassName="font-knewave text-white"
              accentWord="FARMS"
            >
              WHY ROSEATE
            </BrandHeading>

            <div className="flex items-center no-scrollbar justify-between gap-10 overflow-hidden overflow-x-auto">
              {FEATURES.map((feature) => (
                <StarburstBadge
                  starburstImage="/footerBadge.svg"
                  key={feature.title}
                  title={feature.title}
                  icon={feature.icon}
                  titleClassName="text-small font-semibold text-white text-center tracking-wide"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-brand-600 py-8 lg:mx-8 mx-4 rounded-4xl">
          <div className="content">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8 mb-8">
              <div className="flex flex-col gap-4 flex-1">
                <div className="text-white">
                  <h3 className="text-body font-semibold uppercase tracking-wide text-center lg:text-left">
                    SUBSCRIBE TO OUR NEWSLETTER FOR UPDATES AND SPECIAL OFFERS!
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 bg-white justify-between rounded-full w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className=" py-2 px-4 rounded-full  text-gray-800 text-body focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                  <Button variant="default" size="btn" className="">
                    Subscribe
                  </Button>
                </div>

                {/* FSSAI Logo */}
                <div className="mt-4 flex gap-4 items-center">
                  <div className="w-20 h-16 bg-white rounded mb-2 flex items-center justify-center">
                    <img src="./fssai.png" alt="" className="rounded w-full" />
                    
                  </div>
                  <p className="text-white text-lg">
                    <b>LIC NO:</b> 13325008000620
                  </p>
                </div>
              </div>

              <div className="text-white text-small flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-white rounded-full mt-0.5 flex-shrink-0"></div>
                  <span>
                    Plot No. 137, Ground Floor, Plot St. Sec 2, Bawana Delhi,
                    <br />
                    North West - Delhi-110039
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded-full flex-shrink-0"></div>
                  <span>info@roseatefarms.com</span>
                </div>

                {/* WhatsApp button */}
                <Button
                  variant="solid"
                  size="btn"
                  className="flex items-center gap-2 mt-2"
                >
                  <div className="w-4 h-4 bg-brand-500 rounded-full"></div>
                  <span>Whatsapp</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-white border-opacity-20 pt-8">
              {/* Left Column - Social Media and Description */}
              <div className="md:col-span-1">
                {/* Social Media */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3 text-body uppercase tracking-wide">
                    FOLLOW US
                  </h4>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3 text-body uppercase tracking-wide">
                    ORGANIC GOODNESS, NATURALLY GROWN
                  </h4>
                  <p className="text-white text-small leading-relaxed">
                    We Believe That Good Food Should Make People Healthier And
                    Happier. That's Why We Are Dedicated To Selecting Only The
                    Finest Ingredients And Crafting Each Recipe With Expertise
                    And Care.
                  </p>
                </div>
              </div>

              {/* More Info Column */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-body uppercase tracking-wide">
                  MORE INFO
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Refund Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Shipping Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Terms Of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Customer Support
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Links Column */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-body uppercase tracking-wide">
                  QUICK LINKS
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Products
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white text-small hover:text-brand-300 transition-colors"
                    >
                      Blogs
                    </a>
                  </li>
                </ul>
              </div>

              {/* Logo Column */}
              <div className="flex flex-col items-center md:items-end">
                {/* Roseate Farms Logo */}
                <div className="rounded mb-6 flex items-center justify-center">
                  <img src="/roseateW.svg" alt="" />
                </div>
              </div>
            </div>

            <div className="content text-center mt-8 pt-6 border-t border-white border-opacity-20">
              <p className="text-white text-small">
                © 2025 Roseate farms . All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
