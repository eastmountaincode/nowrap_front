import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer">
      <Link to="/admin" className="d-block text-center mb-2">Go to Database Admin</Link>
    </div>
  );
}

export default Footer;
