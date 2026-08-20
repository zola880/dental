import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Clock,
  Heart,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Stethoscope,
  Sparkles,
  Activity,
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const services = [
    { icon: Sparkles, title: 'Teeth Whitening', desc: 'Professional whitening for a brighter smile' },
    { icon: Shield, title: 'Dental Cleaning', desc: 'Thorough cleaning and preventive care' },
    { icon: Stethoscope, title: 'Root Canal', desc: 'Painless root canal therapy' },
    { icon: Activity, title: 'Dental Implants', desc: 'Permanent tooth replacement solutions' },
  ];

  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '10,000+', label: 'Happy Patients' },
    { value: '25+', label: 'Expert Dentists' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Patient since 2019',
      text: 'The most comfortable dental experience I have ever had. The team is incredibly gentle and professional.',
      rating: 5,
    },
    {
      name: 'James Rodriguez',
      role: 'Patient since 2021',
      text: 'Dr. Johnson explained every step of my implant procedure. I felt completely at ease throughout.',
      rating: 5,
    },
    {
      name: 'Emily Chen',
      role: 'Patient since 2020',
      text: 'Beautiful clinic, modern equipment, and the staff genuinely cares about your comfort. Highly recommend.',
      rating: 5,
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <span className="hero__badge">Trusted by 10,000+ Patients</span>
            <h1 className="hero__title">
              Your Smile Deserves
              <span className="hero__title--accent"> Exceptional Care</span>
            </h1>
            <p className="hero__description">
              Experience modern dentistry in a calm, comfortable environment. 
              Our expert team combines advanced technology with a gentle, 
              patient-first approach.
            </p>
            <div className="hero__actions">
              <Link to="/book-appointment" className="hero__btn hero__btn--primary">
                Book Appointment
                <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="hero__btn hero__btn--secondary">
                Our Services
              </Link>
            </div>
            <div className="hero__trust">
              <div className="hero__trust-item">
                <CheckCircle size={16} />
                <span>No hidden fees</span>
              </div>
              <div className="hero__trust-item">
                <CheckCircle size={16} />
                <span>Same-day appointments</span>
              </div>
              <div className="hero__trust-item">
                <CheckCircle size={16} />
                <span>Insurance accepted</span>
              </div>
            </div>
          </div>
          <div className="hero__image">
            <img
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=500&fit=crop"
              alt="Modern dental clinic interior"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-section__container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <span className="stat-item__value">{stat.value}</span>
              <span className="stat-item__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our Dental Services</h2>
            <p className="section-description">
              Comprehensive dental care tailored to your unique needs
            </p>
          </div>
          <div className="services-grid">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="service-card">
                  <div className="service-card__icon">
                    <Icon size={28} />
                  </div>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__desc">{service.desc}</p>
                  <Link to="/services" className="service-card__link">
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="section-cta">
            <Link to="/services" className="hero__btn hero__btn--secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <div className="section-container">
          <div className="why-grid">
            <div className="why-content">
              <span className="section-tag">Why Choose Us</span>
              <h2 className="section-title">Dentistry Built Around You</h2>
              <p className="section-description">
                We believe dental care should be comfortable, transparent, and accessible. 
                Every aspect of our practice is designed with your well-being in mind.
              </p>
              <div className="why-features">
                <div className="why-feature">
                  <Heart size={20} />
                  <div>
                    <h4>Patient-First Approach</h4>
                    <p>Your comfort and understanding guide every decision we make.</p>
                  </div>
                </div>
                <div className="why-feature">
                  <Award size={20} />
                  <div>
                    <h4>Board-Certified Team</h4>
                    <p>Our dentists hold the highest credentials and pursue continuous education.</p>
                  </div>
                </div>
                <div className="why-feature">
                  <Clock size={20} />
                  <div>
                    <h4>Flexible Scheduling</h4>
                    <p>Evening and weekend appointments available for your convenience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="why-image">
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&h=600&fit=crop"
                alt="Dentist consulting with patient"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Patient Stories</span>
            <h2 className="section-title">What Our Patients Say</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-card__stars">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                  ))}
                </div>
                <p className="testimonial-card__text">"{testimonial.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <span className="testimonial-card__name">{testimonial.name}</span>
                    <span className="testimonial-card__role">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <h2 className="cta-card__title">Ready for a Healthier Smile?</h2>
            <p className="cta-card__description">
              Schedule your appointment today and take the first step toward 
              the smile you deserve. New patients welcome.
            </p>
            <div className="cta-card__actions">
              <Link to="/book-appointment" className="hero__btn hero__btn--primary">
                <Calendar size={18} />
                Book Now
              </Link>
              <a href="tel:+15551234567" className="hero__btn hero__btn--secondary">
                <Phone size={18} />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;