import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Tooth, Phone } from 'lucide-react';
import './PublicHeader.css';

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`public-header ${isScrolled ? 'public-header--scrolled' : ''}`}>
      <div className="public-header__container">
        <Link to="/" className="public-header__logo">
          <Tooth size={28} color="var(--color-primary)" />
          <span className="public-header__brand">DentalCare Pro</span>
        </Link>

        <nav className={`public-header__nav ${isMenuOpen ? 'public-header__nav--open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `public-header__link ${isActive ? 'public-header__link--active' : ''}`
              }
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/book-appointment" className="public-header__cta">
            Book Appointment
          </Link>
        </nav>

        <div className="public-header__actions">
          <a href="tel:+15551234567" className="public-header__phone">
            <Phone size={16} />
            <span>(555) 123-4567</span>
          </a>
          <Link to="/login" className="public-header__login">
            Staff Login
          </Link>
        </div>

        <button
          className="public-header__toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default PublicHeader;