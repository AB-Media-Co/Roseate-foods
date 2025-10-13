import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'

function Banner() {
  return (
    <div className="px-4 aspect-[3/5] md:aspect-[16/7] bg-cover bg-center md:bg-[url('./Contact/contact-banner.webp')] bg-[url('./Contact/contact-banner-m.webp')] flex justify-start py-10 flex-col items-center">
      <BrandHeading accentWord="Help!" className="text-[27px] uppercase text-white mb-2">We’re Happy to</BrandHeading>
      <p className='text-center text-white text-[17px]'>Have any queries or feedback? we would be happy to assist you.</p>
      <div className='h-[80%] w-[90%] bg-white mt-10 rounded-4xl px-4 text-brand-500 font-medium md:flex justify-center items-center'>
            <div className='h-[30%] w-full border-b-1 flex justify-center items-end p-4'>
                <a href="">info@roseatefarms.com</a>
            </div>
            <div className='h-[30%] w-full border-b-1 md:border-r-1'></div>
            <div className='h-[30%] w-full flex justify-center items-end p-1 text-center '>
                <a href="">Plot No. 137, Ground Floor, Pkt N, Sec 2, Bawana DSIIDC, North West, Delhi-110039</a>
            </div>
      </div>
    </div>
  )
}

export default Banner
