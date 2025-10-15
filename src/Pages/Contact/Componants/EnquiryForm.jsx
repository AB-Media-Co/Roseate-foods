import React from 'react'
import { BrandHeading } from '../../../components/BrandHeading'

function EnquiryForm() {
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="content flex flex-col items-center">
        <BrandHeading accentWord="ENQUIRES" className="text-subheading text-center text-brand-500">
          CUSTOMER CARE &
        </BrandHeading>
        <p className="text-body text-center text-gray-600 mt-2">
          We&apos;re Here To Assist You. Find Answers, Check Your Order, Or Reach Out To Our Team.
        </p>

        <div className="mt-8 w-full max-w-[880px]">
          <div className="rounded-xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-5 md:p-8">
            <h3 className="text-center text-lg md:text-xl font-semibold text-gray-800">
              Roseate Farms Enquire From
            </h3>

            <form className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">First name*</label>
                  <input
                    type="text"
                    className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder=""
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Last name*</label>
                  <input
                    type="text"
                    className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Phone Number*</label>
                  <input
                    type="tel"
                    className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder=""
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Email*</label>
                  <input
                    type="email"
                    className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Subject*</label>
                <input
                  type="text"
                  className="h-10 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder=""
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Write Your Message*</label>
                <textarea
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder=""
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="rounded-md bg-brand-500 px-6 py-2.5 text-white font-medium hover:bg-brand-600 transition-colors"
                >
                  SUBMIT NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EnquiryForm


