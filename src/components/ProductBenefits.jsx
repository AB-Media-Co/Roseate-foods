import React from 'react'

const ProductBenefits = ({benefits}) => {


  return (
    <section className="py-8 bg-white ">
      <div className="content">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.id}
              className={`flex md:items-center flex-col md:flex-row gap-4 p-4 ${
                index < benefits.length - 1 ? 'lg:border-r lg:border-gray-200' : ''
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 border border-gray-100 shadow-lg bg-gray-50 rounded-full flex items-center justify-center">
                  <img 
                    src={benefit.icon} 
                    alt={benefit.title}
                    className="w-8 h-8"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-body font-semibold text-brand-500 mb-1">
                  {benefit.title}
                </h3>
                <p className="text-small text-gray-600">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductBenefits