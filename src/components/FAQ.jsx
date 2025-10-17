import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Button from './ui/Button'
import { BrandHeading } from './BrandHeading'

const FAQ = ({
  title = "FREQUENTLY ASKED",
  accentWord = "QUESTIONS",
  faqs = [],
  showSeeAll = true,
  className = "",
  showHeading = true
}) => {
  // Single-open behavior
  const [openIndex, setOpenIndex] = useState(null)
  const [showAllFAQs, setShowAllFAQs] = useState(false)
  const defaultFAQs = [
    {
      id: 1,
      question: "Are Your Dry Fruits 100% Natural?",
      answer: "Yes, all our dry fruits are 100% natural without any artificial preservatives, colors, or additives. We source directly from trusted farmers who practice organic farming methods."
    },
    {
      id: 2,
      question: "Are Your Dry Fruits Safe For Kids?",
      answer: "Absolutely! Our dry fruits are completely safe for children and are actually recommended as a healthy snacking option. They provide essential nutrients, vitamins, and minerals needed for growing kids."
    },
    {
      id: 3,
      question: "How Should I Store Dry Fruits?",
      answer: "Store dry fruits in a cool, dry place away from direct sunlight. For best results, keep them in airtight containers in the refrigerator. They can last 6–12 months when stored properly."
    },
    {
      id: 4,
      question: "Do You Provide Bulk/Wholesale Orders?",
      answer: "Yes, we offer bulk and wholesale orders for businesses, retailers, and bulk buyers. Contact our sales team for special pricing and minimum order quantities."
    },
    {
      id: 5,
      question: "What Is The Shelf Life Of Your Products?",
      answer: "The shelf life varies by product but typically ranges from 6–12 months from the manufacturing date when stored properly. Each package includes the best before date for your reference."
    },
    {
      id: 6,
      question: "Do You Add Preservatives Or Refined Vinegar/Oil?",
      answer: "No, we never add preservatives or refined vinegar. In select products, we use only natural cold-pressed oils, which are clearly stated on the product label."
    },
    {
      id: 7,
      question: "Is It Suitable For My Dietary Needs?",
      answer: "Yes, our products are suitable for most dietary preferences — they are naturally Vegan, Gluten-Free, and Keto-friendly. We always mention the exact dietary suitability on each product label so you can be sure."
    },
    {
      id: 8,
      question: "Do You Offer International Shipping?",
      answer: "Currently, we ship within India only. We are working on expanding our shipping capabilities to international markets. Please subscribe to our newsletter for updates on international shipping availability."
    },
    {
      id: 9,
      question: "What Payment Methods Do You Accept?",
      answer: "We accept all major payment methods including credit/debit cards, net banking, UPI, mobile wallets, and cash on delivery (COD) for eligible locations. All transactions are secure and encrypted."
    }
  ];

  const faqData = faqs.length > 0 ? faqs : defaultFAQs
  const displayedFAQs = showAllFAQs ? faqData : faqData.slice(0, 6)

  // Split into two columns (even/odd)
  const leftFAQs = displayedFAQs.filter((_, i) => i % 2 === 0)
  const rightFAQs = displayedFAQs.filter((_, i) => i % 2 !== 0)

  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  const renderItem = (faq, absoluteIndex, isLastInColumn) => {
    const isOpen = openIndex === absoluteIndex

    return (
      <div
        key={faq.id}
        className={`${!isLastInColumn ? 'border-b border-white/20 pb-6' : ''}`}
      >
        <button
          onClick={() => toggle(absoluteIndex)}
          className="w-full py-4 flex cursor-pointer items-start justify-between text-left group hover:bg-white/5 transition-colors rounded px-2"
        >
          <span className="text-white text-body font-medium pr-4 leading-relaxed">
            {faq.question}
          </span>
          <span className="mt-1 text-white/90 transition-transform duration-200">
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </span>
        </button>

        {/* Answer */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="px-2 pt-2">
            <p className="text-white/90 text-small leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="content">
        <div className="bg-brand-500 rounded-2xl p-8 md:p-12">
          {showHeading && (
            <div className="text-center mb-12">
              <BrandHeading
                className="text-subheading text-white uppercase"
                accentClassName="font-knewave text-white"
                accentWord={accentWord}
              >
                {title}
              </BrandHeading>
            </div>
          )}

          {/* Two columns */}
          <div className="grid grid-cols-1  lg:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-6">
              {leftFAQs.map((faq, i) => {
                const absoluteIndex = i * 2
                const isLast = i === leftFAQs.length - 1
                return renderItem(faq, absoluteIndex, isLast)
              })}
            </div>

            <div className="space-y-6">
              {rightFAQs.map((faq, i) => {
                const absoluteIndex = i * 2 + 1
                const isLast = i === rightFAQs.length - 1
                return renderItem(faq, absoluteIndex, isLast)
              })}
            </div>
          </div>

          {/* See All Button */}
          {showSeeAll && faqData.length > 6 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                size="btn"
                className="min-w-32"
                onClick={() => setShowAllFAQs(prev => !prev)}
              >
                {showAllFAQs ? 'Show Less' : 'See All'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FAQ
