import React from 'react'
import Button from './ui/Button'
import { BrandHeading } from './BrandHeading'

const Footer = () => {
  return (
    <footer className="relative bg-cover bg-center" style={{ backgroundImage: 'url(/footer.png)' }}>
      {/* Green overlay */}
      {/* <div className="absolute inset-0 bg-brand-500 bg-opacity-80"></div> */}

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

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
              {/* 100% Organic */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                  {/* Leaf icon placeholder */}
                  <div className="w-10 h-10 bg-brand-500 rounded"></div>
                </div>
                <h3 className="text-white font-semibold text-small uppercase tracking-wide">100% ORGANIC</h3>
              </div>

              {/* Traditionally Handcrafted */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                  {/* Jar icon placeholder */}
                  <div className="w-10 h-10 bg-brand-500 rounded"></div>
                </div>
                <h3 className="text-white font-semibold text-small uppercase tracking-wide text-center">TRADITIONALLY<br />HANDCRAFTED</h3>
              </div>

              {/* Farm to Table */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                  {/* Farm to table icon placeholder */}
                  <div className="w-10 h-10 bg-brand-500 rounded"></div>
                </div>
                <h3 className="text-white font-semibold text-small uppercase tracking-wide text-center">FARM TO TABLE<br />FRESHNESS</h3>
              </div>

              {/* No Preservatives */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                  {/* Leaf icon placeholder */}
                  <div className="w-10 h-10 bg-brand-500 rounded"></div>
                </div>
                <h3 className="text-white font-semibold text-small uppercase tracking-wide">NO PRESERVATIVES</h3>
              </div>

              {/* Sustainable Farming */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
                  {/* Sustainable icon placeholder */}
                  <div className="w-10 h-10 bg-brand-500 rounded"></div>
                </div>
                <h3 className="text-white font-semibold text-small uppercase tracking-wide text-center">SUSTAINABLE<br />FARMING</h3>
              </div>
            </div>
          </div>
        </div>


        {/* Newsletter Section */}
        <div className="bg-brand-600 py-8 mx-8 rounded-4xl">
          <div className="content">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className='flex flex-col gap-2 '>
                <div className="text-white text-center lg:text-left">
                  <h3 className="text-body font-semibold uppercase tracking-wide">SUBSCRIBE TO OUR NEWSLETTER FOR UPDATES AND SPECIAL OFFERS!</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 bg-white justify-between p-2 rounded-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className=" py-2 rounded-full text-gray-800 w-64 text-body focus:outline-none focus:ring-2 focus:ring-brand-300"
                  />
                  <Button variant="default" size="btn">
                    Subscribe
                  </Button>
                </div>

              </div>
              <div className="text-white text-small text-center  lg:text-right">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-4 h-4 bg-white rounded-full mt-0.5 flex-shrink-0"></div>
                  <span>Plot No. 137, Ground Floor, Plot St. Sec 2, Bawana Delhi,<br />North West - Delhi-110039</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white rounded-full flex-shrink-0"></div>
                  <span>info@roseatefarms.com</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Left Column - Certification and Description */}
              <div className="md:col-span-1">
                <div className="my-6">
                  {/* FSSAI Logo placeholder */}
                  <div className="w-24 h-16 bg-white rounded mb-4 flex items-center justify-center">
                    <span className="text-brand-500 text-xs font-bold">FSSAI</span>
                  </div>
                  <p className="text-white text-small">LIC NO: 13325008000620</p>
                </div>

                {/* Social Media */}
                <div className="my-6">
                  <h4 className="text-white font-semibold mb-3 text-body uppercase tracking-wide">FOLLOW US</h4>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                    <div className="w-8 h-8 bg-white rounded-full hover:bg-brand-300 transition-colors cursor-pointer"></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3 text-body uppercase tracking-wide">ORGANIC GOODNESS, NATURALLY GROWN</h4>
                  <p className="text-white text-small leading-relaxed">
                    We Believe That Good Food Should Make People Healthier And Happier. That's Why We Are Dedicated To Selecting Only The Finest Ingredients And Crafting Each Recipe With Expertise And Care.
                  </p>
                </div>
              </div>

              {/* More Info Column */}
              <div className='my-3'>
                <h4 className="text-white font-semibold mb-4 text-body uppercase tracking-wide">MORE INFO</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Refund Policy</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Shipping Policy</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Terms Of Service</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Customer Support</a></li>
                </ul>
              </div>

              {/* Quick Links Column */}
              <div className='my-3'>
                <h4 className="text-white font-semibold mb-4 text-body uppercase tracking-wide">QUICK LINKS</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Home</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Products</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-white text-small hover:text-brand-300 transition-colors">Blogs</a></li>
                </ul>
              </div>

              {/* Logo Column */}
              <div className="flex flex-col items-center md:items-end">
                {/* Roseate Farms Logo placeholder */}
                <div className="w-32 h-32 bg-white rounded mb-6 flex items-center justify-center">
                  <span className="text-brand-500 font-knewave text-xl">ROSEATE<br />FARMS</span>
                </div>

                {/* WhatsApp button */}
                <Button
                  variant="solid"
                  size="btn"
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 bg-brand-500 rounded-full"></div>
                  <span>Whatsapp</span>
                </Button>
              </div>
            </div>


            <div className="content text-center">
              <p className="text-white text-small">© 2025 Roseate farms . All Rights Reserved.</p>
            </div>
          </div>
        </div>



      </div>
    </footer>
  )
}

export default Footer
