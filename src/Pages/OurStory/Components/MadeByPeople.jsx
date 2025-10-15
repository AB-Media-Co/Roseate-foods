import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'

function MadeByPeople() {
  return (
    <div>
        <div className="text-center lg:mt-40 mb-10">
        <BrandHeading accentWord="(MEET THE ROSEATE TEAM)" >
          MADE BY PEOPLE <br></br>
        </BrandHeading>
        <div className="flex flex-col w-full content lg:flex-row justify-between items-center lg:mt-20">
          <div className="w-full mb-10 lg:w-[47%]">
            <img src="./Home\Assets\people.svg" alt="" />
          </div>
          <div className="w-full text-[18px] text-left lg:text-xl lg:w-[45%]">
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
