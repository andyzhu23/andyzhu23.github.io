import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/photos', label: 'Photos' },
  { to: '/interests', label: 'Interests' },
];

const avatarSrc = `${import.meta.env.BASE_URL}images/avatar.png`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    if (!avatarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAvatarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [avatarOpen]);

  return (
    <>
    <nav className="navbar">
      <div className="navbar-brand">
        <button
          type="button"
          className="navbar-avatar-btn"
          onClick={() => setAvatarOpen(true)}
          aria-label="Open avatar"
        >
          <img
            src={avatarSrc}
            alt="Andy Zhu avatar"
            className="navbar-avatar"
          />
        </button>
        <NavLink to="/" className="navbar-brand-text">AZ</NavLink>
      </div>
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
    {avatarOpen && createPortal(
      <div
        className="avatar-modal"
        onClick={() => setAvatarOpen(false)}
        role="dialog"
        aria-modal="true"
      >
        <img
          src={avatarSrc}
          alt="Andy Zhu avatar"
          className="avatar-modal-img"
          onClick={(e) => e.stopPropagation()}
        />
      </div>,
      document.body
    )}
    </>
  );
}
