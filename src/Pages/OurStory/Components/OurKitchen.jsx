import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'

function OurKitchen() {
  
  return (
    <div className="content">
          <div className="text-center  mb-14 mt-20">
            <BrandHeading accentWord="our kitchen" >What You’ll Find In <br /></BrandHeading>
          </div>
          <iconcard className="flex justify-between mb-20 flex-col lg:flex-row">
            <icard   onClick={() => window.location.href = `/collection/dry-fruits`} className="flex cursor-pointer justify-center flex-col items-center h-full w-full mb-16 ">
                <img src="./Home/farms/almond-icon.png" alt="" className="w-[60%] pb-5 " />
                <h3 className="text-[24px] text-[#137D67] font-semibold pb-1 capitalize">dry fruits</h3>
                <p className="text-center text-[18px] font-medium capitalize w-[80%]">fresh-crop crunch, hand-sorted.</p>
            </icard>
            <icard  onClick={() => window.location.href = `/collection/pickles`} className="flex cursor-pointer justify-center flex-col items-center h-full w-full mb-16 ">
                <img src="./Home/farms/pickle-jar.png" alt="" className="w-[60%] pb-5 " />
                <h3 className="text-[24px] text-[#137D67] font-semibold pb-1 capitalize">pickle</h3>
                <p className="text-center text-[18px] font-medium capitalize w-[80%]">traditional, clean-label recipes with home-style character.</p>
            </icard>
            <icard  onClick={() => window.location.href = `/collection/spices`} className="flex cursor-pointer justify-center flex-col items-center h-full w-full mb-16 ">
                <img src="./Home/farms/spices-jar.png" alt="" className="w-[60%] pb-5 " />
                <h3 className="text-[24px] text-[#137D67] font-semibold pb-1 capitalize">Spices</h3>
                <p className="text-center text-[18px] font-medium capitalize w-[80%]">pure, potent, and honestly made.</p>
            </icard>
            
          </iconcard>
    
          
        </div>
  )
}

export default OurKitchen
