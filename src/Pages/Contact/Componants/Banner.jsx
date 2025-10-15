import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'

function Banner() {
  // 🔧 fill these with your real details
  const EMAIL = 'info@roseatefarms.com'
  const WHATSAPP = '+91 8178224814' // can include +91; link will normalize
  const WA_TEXT = 'Hi! I have a query regarding your products.'
  const ADDRESS =
    'Plot No. 137, Ground Floor, Pkt N, Sec 2, Bawana DSIIDC, North West, Delhi-110039'

  const waHref = `https://wa.me/${WHATSAPP.replace(/[^\d]/g, '')}?text=${encodeURIComponent(WA_TEXT)}`
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`

  return (
    <div
      className="
        relative px-4 py-10
        bg-cover bg-center
        bg-[url('/Contact/contact-banner-m.webp')]
        md:bg-[url('/Contact/contact-banner.webp')]
      "
    >
      {/* overlay for contrast */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/35 pointer-events-none" />

      <div className="content relative z-10 flex flex-col items-center justify-center">
        <BrandHeading accentWord="Help!" className="text-white text-heading uppercase text-center">
          We’re Happy to
        </BrandHeading>

        <p className="text-white/95 text-body text-center max-w-2xl">
          Have any queries or feedback? We would be happy to assist you.
        </p>

        {/* Info cards container */}
        <div className="mt-6 w-full max-w-[1100px]">
          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 rounded-xl bg-white/95 backdrop-blur p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            {/* Email */}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 md:border-r md:border-gray-200 py-4">
              <div
                className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center"
                aria-hidden="true"
              >
                {/* mail icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" role="img" aria-label="Email icon">
                  <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" stroke="currentColor" className="text-white" strokeWidth="1.5" />
                  <path d="M4 7l8 6 8-6" stroke="currentColor" className="text-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <a
                href={`mailto:${EMAIL}`}
                className="text-brand-600 font-medium hover:underline text-center break-all"
                aria-label={`Email us at ${EMAIL}`}
              >
                {EMAIL}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-2 md:border-r md:border-gray-200 py-4">
              <img src="/whatsapIcon.svg" alt="WhatsApp" className="w-16 h-16" />
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="items-center justify-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-5  text-body text-center"
                aria-label="Chat with us on WhatsApp"
              >
                WhatsApp
                <br />
                <span className="text-[#4DE340]">Click to chat</span>
              </a>
         
            </div>

            {/* Address */}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 py-4">
              <div
                className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center"
                aria-hidden="true"
              >
                {/* location icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" role="img" aria-label="Location icon">
                  <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" stroke="currentColor" className="text-white" strokeWidth="1.5" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" className="text-white" strokeWidth="1.5" />
                </svg>
              </div>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-brand-600 text-body max-w-[360px] hover:underline"
                aria-label="Open address in Google Maps"
              >
                {ADDRESS}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
