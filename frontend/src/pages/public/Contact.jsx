import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setToast({ isVisible: true, message: 'Message sent successfully! We will respond within 24 hours.', type: 'success' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    { icon: MapPin, title: 'Visit Us', lines: ['123 Main Street', 'Springfield, IL 62701'] },
    { icon: Phone, title: 'Call Us', lines: ['(555) 123-4567', '(555) 987-6543'] },
    { icon: Mail, title: 'Email Us', lines: ['contact@dentalcare.com', 'appointments@dentalcare.com'] },
    { icon: Clock, title: 'Working Hours', lines: ['Mon-Fri: 9:00 AM - 5:00 PM', 'Saturday: 10:00 AM - 2:00 PM', 'Sunday: Closed'] },
  ];

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="section-container">
          <span className="section-tag">Get in Touch</span>
          <h1 className="contact-hero__title">Contact Us</h1>
          <p className="contact-hero__description">
            Have a question or want to schedule a visit? We are here to help. 
            Reach out through any of the channels below.
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="section-container">
          <div className="contact-grid">
            <div className="contact-info-section">
              <h2 className="contact-info__title">Contact Information</h2>
              <div className="contact-info-list">
                {contactInfo.map((info, idx) => {
                  const Icon = info.icon;
                  return (
                    <div key={idx} className="contact-info-item">
                      <div className="contact-info-item__icon">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="contact-info-item__title">{info.title}</h4>
                        {info.lines.map((line, i) => (
                          <p key={i} className="contact-info-item__line">{line}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="contact-map">
                <div className="contact-map__placeholder">
                  <MapPin size={32} />
                  <p>Map integration will be added here</p>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2 className="contact-form__title">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                />
                <div className="input-group">
                  <label className="input__label">Message</label>
                  <textarea
                    className="input__field contact-textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="contact-form__submit"
                >
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Contact;