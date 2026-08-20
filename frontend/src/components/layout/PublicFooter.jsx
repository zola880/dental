import React from 'react';
import { Link } from 'react-router-dom';
import { Tooth, MapPin, Phone, Mail, Clock } from 'lucide-react';
import './PublicFooter.css';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="public-footer">
      <div className="public-footer__container">
        <div className="public-footer__grid">
          <div className="public-footer__brand">
            <div className="public-footer__logo">
              <Tooth size={24} color="var(--color-primary)" />
              <span>DentalCare Pro</span>
            </div>
            <p className="public-footer__description">
              Providing exceptional dental care with a gentle touch. 
              Your smile is our priority.
            </p>
          </div>

          <div className="public-footer__section">
            <h4 className="public-footer__heading">Quick Links</h4>
            <ul className="public-footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/doctors">Our Doctors</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="public-footer__section">
            <h4 className="public-footer__heading">Services</h4>
            <ul className="public-footer__links">
              <li><Link to="/services">Dental Cleaning</Link></li>
              <li><Link to="/services">Teeth Whitening</Link></li>
              <li><Link to="/services">Root Canal</Link></li>
              <li><Link to="/services">Dental Implants</Link></li>
              <li><Link to="/services">Orthodontics</Link></li>
            </ul>
          </div>

          <div className="public-footer__section">
            <h4 className="public-footer__heading">Contact Info</h4>
            <ul className="public-footer__contact">
              <li>
                <MapPin size={16} />
                <span>123 Main Street, Springfield, IL 62701</span>
              </li>
              <li>
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </li>
              <li>
                <Mail size={16} />
                <span>contact@dentalcare.com</span>
              </li>
              <li>
                <Clock size={16} />
                <span>Mon-Fri: 9AM-5PM, Sat: 10AM-2PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="public-footer__bottom">
          <p>&copy; {currentYear} DentalCare Pro. All rights reserved.</p>
          <div className="public-footer__bottom-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;