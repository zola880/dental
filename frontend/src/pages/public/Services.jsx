import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  Stethoscope,
  Activity,
  Scissors,
  Baby,
  AlertCircle,
  Scan,
  ArrowRight,
  Clock,
} from 'lucide-react';
import './Services.css';

const Services = () => {
  const services = [
    { icon: Shield, title: 'Dental Cleaning', desc: 'Professional scaling, polishing, and preventive care to keep your teeth healthy.', duration: '30 min', category: 'Preventive' },
    { icon: Sparkles, title: 'Teeth Whitening', desc: 'Safe, effective professional whitening for a noticeably brighter smile.', duration: '60 min', category: 'Cosmetic' },
    { icon: Scan, title: 'Dental Checkup', desc: 'Comprehensive oral examination including digital X-rays and assessment.', duration: '30 min', category: 'Preventive' },
    { icon: Stethoscope, title: 'Root Canal Treatment', desc: 'Painless endodontic therapy to save infected or damaged teeth.', duration: '90 min', category: 'Restorative' },
    { icon: Activity, title: 'Dental Filling', desc: 'Tooth-colored composite fillings that blend naturally with your smile.', duration: '45 min', category: 'Restorative' },
    { icon: Scissors, title: 'Tooth Extraction', desc: 'Gentle, precise extractions including wisdom teeth removal.', duration: '30 min', category: 'Surgical' },
    { icon: Activity, title: 'Dental Implants', desc: 'Permanent titanium implant solutions for missing teeth.', duration: '120 min', category: 'Surgical' },
    { icon: Scan, title: 'Orthodontics', desc: 'Braces, clear aligners, and orthodontic consultations for all ages.', duration: '45 min', category: 'Orthodontics' },
    { icon: Baby, title: 'Pediatric Dentistry', desc: 'Gentle, child-friendly dental care in a calm environment.', duration: '30 min', category: 'Pediatric' },
    { icon: AlertCircle, title: 'Emergency Dental Care', desc: 'Urgent treatment for toothaches, injuries, and dental emergencies.', duration: '45 min', category: 'Emergency' },
  ];

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="section-container">
          <span className="section-tag">Our Expertise</span>
          <h1 className="services-hero__title">Comprehensive Dental Services</h1>
          <p className="services-hero__description">
            From routine cleanings to complex surgical procedures, we offer a full 
            range of dental services under one roof.
          </p>
        </div>
      </section>

      <section className="services-list-section">
        <div className="section-container">
          <div className="services-list-grid">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="service-list-card">
                  <div className="service-list-card__header">
                    <div className="service-list-card__icon">
                      <Icon size={24} />
                    </div>
                    <span className="service-list-card__category">{service.category}</span>
                  </div>
                  <h3 className="service-list-card__title">{service.title}</h3>
                  <p className="service-list-card__desc">{service.desc}</p>
                  <div className="service-list-card__footer">
                    <span className="service-list-card__duration">
                      <Clock size={14} />
                      {service.duration}
                    </span>
                    <Link to="/book-appointment" className="service-list-card__link">
                      Book <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="services-cta">
        <div className="section-container">
          <div className="cta-card">
            <h2>Not Sure Which Service You Need?</h2>
            <p>Book a consultation and our team will recommend the best treatment plan for you.</p>
            <Link to="/book-appointment" className="hero__btn hero__btn--primary">
              Schedule Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;