'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { SectionTitle, Body, Heading3 } from './Text/Text'
import styles from './FAQ.module.css'

const faqs = [
  {
    question: 'How do I know how much my home is worth?',
    answer:
      "We provide a free home valuation service that considers recent sales in your area, current market trends, and unique features of your property. This gives you a realistic estimate of your home's value before listing.",
  },
  {
    question: 'What costs should I expect when buying a home?',
    answer:
      'Typical costs include the down payment, closing costs (usually 2-5% of the purchase price), home inspection fees, appraisal fees, and earnest money deposit. We will provide a detailed estimate early in the process.',
  },
  {
    question: 'How long does it usually take to sell a house?',
    answer:
      'The timeframe varies based on market conditions, property location, and pricing. On average, a home might be on the market for 30-45 days, followed by a 30-45 day closing period. We employ aggressive marketing strategies to minimize this time.',
  },
  {
    question: 'Do I need a real estate agent to buy or sell a home?',
    answer:
      'While not legally required, a real estate agent provides invaluable expertise in market analysis, negotiation, legal paperwork, and navigating complex issues, ultimately saving you time, stress, and potentially money.',
  },
  {
    question: "What's the difference between pre-qualification and pre-approval for a mortgage?",
    answer:
      'Pre-qualification is a basic estimate of what you might borrow based on unverified information you provide. Pre-approval is a firm commitment from a lender after verifying your financial documents, making your offer much stronger to sellers.',
  },
  {
    question: 'Can I buy a home if I have bad credit?',
    answer:
      'Yes, it is possible. There are specialized loan programs like FHA loans that accept lower credit scores. However, improving your credit score before applying can help you secure better interest rates.',
  },
]

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={`${styles.faqSection} fluid-container`}>
      <div className="wrapper">
        <SectionTitle>FAQ</SectionTitle>
        <div className={styles.contentWrapper}>
          <div className={styles.imageContainer}>
            <div className={styles.imagePlaceholder}>
              <Image 
                src="/faq-illustration.svg" 
                alt="FAQ Illustration" 
                width={400} 
                height={400} 
                className={styles.illustration}
              />
            </div>
          </div>
          <div className={styles.accordionContainer}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={index} className={styles.accordionItem}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                  >
                    <Heading3 className={styles.questionText}>{faq.question}</Heading3>
                  </button>
                  <div
                    className={styles.accordionContent}
                    style={{
                      height: isOpen ? 'auto' : '0px',
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className={styles.answerWrapper}>
                      <Body className={styles.answerText}>{faq.answer}</Body>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}