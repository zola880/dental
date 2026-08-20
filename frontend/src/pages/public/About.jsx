import React from 'react';
import { Heart, Target, Eye, Users, Award, Shield } from 'lucide-react';
import './About.css';

const About = () => {
  const values = [
    { icon: Heart, title: 'Compassion', desc: 'Every patient is treated with empathy, patience, and genuine care.' },
    { icon: Award, title: 'Excellence', desc: 'We pursue the highest standards in clinical practice and patient outcomes.' },
    { icon: Shield, title: 'Integrity', desc: 'Transparent pricing, honest diagnoses, and ethical treatment recommendations.' },
    { icon: Target, title: 'Innovation', desc: 'Embracing modern technology and techniques for better results.' },
  ];

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Lead Dentist', specialty: 'General & Cosmetic Dentistry', experience: '12 years' },
    { name: 'Dr. Michael Torres', role: 'Orthodontist', specialty: 'Braces & Aligners', experience: '9 years' },
    { name: 'Dr. Lisa Park', role: 'Pediatric Dentist', specialty: 'Children\'s Dental Care', experience: '8 years' },
    { name: 'Dr. Ahmed Hassan', role: 'Oral Surgeon', specialty: 'Implants & Extractions', experience: '15 years' },
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="section-container">
          <span className="section-tag">Our Story</span>
          <h1 className="about-hero__title">Caring for Smiles Since 2010</h1>
          <p className="about-hero__description">
            DentalCare Pro was founded with a simple belief: dental care should be 
            comfortable, honest, and accessible to everyone. What started as a small 
            family practice has grown into a trusted community clinic serving over 
            10,000 patients.
          </p>
        </div>
      </section>

      <section className="mission-section">
        <div className="section-container">
          <div className="mission-grid">
            <div className="mission-card">
              <Target size={32} />
              <h3>Our Mission</h3>
              <p>
                To provide exceptional, patient-centered dental care that transforms 
                lives one smile at a time. We strive to make every visit comfortable, 
                informative, and effective.
              </p>
            </div>
            <div className="mission-card">
              <Eye size={32} />
              <h3>Our Vision</h3>
              <p>
                To be the most trusted dental care provider in our community, known 
                for clinical excellence, genuine compassion, and a commitment to 
                lifelong oral health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">What Guides Us</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="values-grid">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="value-card">
                  <div className="value-card__icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="value-card__title">{value.title}</h3>
                  <p className="value-card__desc">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Meet the Team</span>
            <h2 className="section-title">Our Dental Professionals</h2>
            <p className="section-description">
              Experienced, board-certified dentists dedicated to your oral health
            </p>
          </div>
          <div className="team-grid">
            {team.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-card__avatar">
                  {member.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <h3 className="team-card__name">{member.name}</h3>
                <span className="team-card__role">{member.role}</span>
                <p className="team-card__specialty">{member.specialty}</p>
                <span className="team-card__experience">{member.experience} experience</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="facilities-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Our Clinic</span>
            <h2 className="section-title">Modern Facilities</h2>
            <p className="section-description">
              State-of-the-art equipment in a calm, welcoming environment
            </p>
          </div>
          <div className="facilities-grid">
            <div className="facility-item">
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=400&h=300&fit=crop"
                alt="Modern dental equipment"
                loading="lazy"
              />
              <span>Digital X-Ray Technology</span>
            </div>
            <div className="facility-item">
              <img
                src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&h=300&fit=crop"
                alt="Comfortable treatment room"
                loading="lazy"
              />
              <span>Comfortable Treatment Rooms</span>
            </div>
            <div className="facility-item">
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop"
                alt="Sterilization area"
                loading="lazy"
              />
              <span>Sterilization Standards</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;