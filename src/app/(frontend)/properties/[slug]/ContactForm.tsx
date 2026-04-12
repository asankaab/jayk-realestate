'use client'
import React, { useState, FormEvent } from 'react'
import { Heading3 } from '../../components/Text/Text'
import styles from './ContactForm.module.css'

interface ContactFormProps {
  propertyTitle?: string
}

export const ContactForm: React.FC<ContactFormProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      console.log('Form submitted:', formData)
      setSubmitMessage('Thank you! We will get back to you soon.')
      setFormData({ name: '', email: '', phone: '', message: '' })

      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('Error submitting form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.contactFormSection}>
      <div className={styles.formWrapper}>
        <Heading3 className={styles.formTitle}>Request a callback for more details</Heading3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="Enter your name"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                E-mail Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your phone"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter your message"
              rows={5}
            />
          </div>

          <div className={styles.buttonWrapper}>
            <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
              {isSubmitting ? 'Sending...' : 'Get In Touch'}
            </button>
          </div>

          {submitMessage && <p className={styles.submitMessage}>{submitMessage}</p>}
        </form>
      </div>
    </div>
  )
}
