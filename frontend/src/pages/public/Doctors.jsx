import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Clock, ArrowRight } from 'lucide-react';
import './Doctors.css';

const Doctors = () => {
  const doctors = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Lead Dentist',
      specialty: 'General & Cosmetic Dentistry',
      experience: '12 years',
      education: 'DDS, Harvard School of Dental Medicine',
      bio: 'Dr. Johnson specializes in comprehensive family dentistry and cosmetic smile makeovers. She is passionate about making patients feel comfortable.',
      available: true,
    },
    {
      name: 'Dr. Michael Torres',
      role: 'Orthodontist',
      specialty: 'Braces, Aligners & TMJ',
      experience: '9 years',
      education: 'DMD, MS Orthodontics, UCLA',
      bio: 'Dr. Torres helps patients of all ages achieve perfectly aligned smiles using both traditional braces and modern clear aligner technology.',
      available: true,
    },
    {
      name: 'Dr. Lisa Park',
      role: 'Pediatric Dentist',
      specialty: 'Children\'s Dental Care',
      experience: '8 years',
      education: 'DDS, MS Pediatric Dentistry, Columbia',
      bio: 'Dr. Park creates a fun, gentle environment for young patients. She focuses on building healthy habits from an early age.',
      available: true,
    },
    {
      name: 'Dr. Ahmed Hassan',
      role: 'Oral Surgeon',
      specialty: 'Implants, Extractions & Jaw Surgery',
      experience: '15 years',
      education: 'DDS, MD, Oral & Maxillofacial Surgery',
      bio: 'Dr. Hassan is a board-certified oral surgeon with extensive experience in complex implant placements and reconstructive procedures.',
      available: false,
    },
  ];

  return (
    <div className="doctors-page">
      <section className="doctors-hero">
        <div className="section-container">
          <span className="section-tag">Our Team</span>
          <h1 className="doctors-hero__title">Meet Our Dental Experts</h1>
          <p className="doctors-hero__description">
            Board-certified professionals dedicated to providing you with 
            the highest quality dental care in a comfortable setting.
          </p>
        </div>
      </section>

      <section className="doctors-list-section">
        <div className="section-container">
          <div className="doctors-grid">
            {doctors.map((doctor, idx) => (
              <div key={idx} className="doctor-card">
                <div className="doctor-card__avatar">
                  {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div className="doctor-card__info">
                  <h3 className="doctor-card__name">{doctor.name}</h3>
                  <span className="doctor-card__role">{doctor.role}</span>
                  <p className="doctor-card__specialty">{doctor.specialty}</p>
                  <p className="doctor-card__bio">{doctor.bio}</p>
                  <div className="doctor-card__meta">
                    <span className="doctor-card__meta-item">
                      <Award size={14} />
                      {doctor.education}
                    </span>
                    <span className="doctor-card__meta-item">
                      <Clock size={14} />
                      {doctor.experience} experience
                    </span>
                  </div>
                  <div className="doctor-card__footer">
                    <span className={`doctor-card__status ${doctor.available ? 'doctor-card__status--available' : ''}`}>
                      {doctor.available ? 'Accepting Patients' : 'Currently Unavailable'}
                    </span>
                    <Link to="/book-appointment" className="doctor-card__book">
                      <Calendar size={14} />
                      Book Visit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="doctors-cta">
        <div className="section-container">
          <div className="cta-card">
            <h2>Ready to Meet Your New Dentist?</h2>
            <p>Schedule a consultation and find the perfect dental professional for your needs.</p>
            <Link to="/book-appointment" className="hero__btn hero__btn--primary">
              Book a Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;