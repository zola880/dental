import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__card">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__message">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="not-found__suggestions">
          <h3 className="not-found__suggestions-title">You can try:</h3>
          <ul className="not-found__suggestions-list">
            <li>Double-checking the URL</li>
            <li>Returning to the previous page</li>
            <li>Going to the home page</li>
          </ul>
        </div>

        <div className="not-found__actions">
          <button 
            className="not-found__btn not-found__btn--primary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <Link to="/" className="not-found__btn not-found__btn--secondary">
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;