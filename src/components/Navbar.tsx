import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/blog', label: 'Blog' },
  { to: '/interests', label: 'Interests' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">AZ</NavLink>
      <button
        className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
              end={to === '/'}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
