import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'

function MadeByPeople() {
  return (
    <div>
        <div className="text-center mt-10 mb-10">
        <BrandHeading accentWord="(MEET THE ROSEATE TEAM)">
          MADE BY PEOPLE
        </BrandHeading>
        <div className="flex justify-between items-center w-full content mt-24">
          <div className="w-[45%]">
            <img src="./Home\Assets\people.svg" alt="" />
          </div>
          <div className="w-[48%] text-[20px] text-left">
            <p>
              We fundamentally believe that food simply tastes better when the
              people making it genuinely care. This isn't just a business
              philosophy; it's a personal guarantee from every member of our
              team. From the moment our field hands carefully tend the organic
              soil, to the detailed work of our sorters ensuring only the finest
              ingredients are selected, and finally to the practiced hands of
              our makers, the entire process is treated with reverence. Each
              batch is handled with the personal care and high quality they
              would demand for their own family table. That unwavering, human
              dedication is what you taste in every bite.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default MadeByPeople
