import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'

function OurKitchen() {
  return (
    <div className="content">
          <div className="text-center mt-40 mb-14">
            <BrandHeading accentWord="our kitchen">What You’ll Find In</BrandHeading>
          </div>
          <iconcard className="flex justify-between mb-20">
            <icard className="flex justify-center flex-col items-center h-full w-[25%]">
                <img src="./Home/farms/almond-icon.png" alt="" className="w-[60%] pb-5 " />
                <h3 className="text-[24px] text-[#137D67] font-semibold pb-1 capitalize">dry fruits</h3>
                <p className="text-center text-[18px] font-medium capitalize w-[80%]">fresh-crop crunch, hand-sorted.</p>
            </icard>
            <icard className="flex justify-center flex-col items-center h-full w-[25%]">
                <img src="./Home/farms/pickle-jar.png" alt="" className="w-[60%] pb-5 " />
                <h3 className="text-[24px] text-[#137D67] font-semibold pb-1 capitalize">pickle</h3>
                <p className="text-center text-[18px] font-medium capitalize w-[80%]">traditional, clean-label recipes with home-style character.</p>
            </icard>
            <icard className="flex justify-center flex-col items-center h-full w-[25%]">
                <img src="./Home/farms/spices-jar.png" alt="" className="w-[60%] pb-5 " />
                <h3 className="text-[24px] text-[#137D67] font-semibold pb-1 capitalize">Spices</h3>
                <p className="text-center text-[18px] font-medium capitalize w-[80%]">pure, potent, and honestly made.</p>
            </icard>
            
          </iconcard>
    
          
        </div>
  )
}

export default OurKitchen
