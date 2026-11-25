import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { KanthaBand } from '../../bengali-art/KanthaBorder';
import { useAvatar } from '../../bengali-art/avatarConfig';
import { BengaliAvatar } from '../../bengali-art/BengaliAvatar';
import { placesForRole } from '../../features';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from './Logo';

export const TopNav: React.FC = () => {
  const { user } = useAuth();
  const items = placesForRole(user?.role ?? 'student').filter((f) => f.nav);
  const [avatar] = useAvatar(user?.id);

  return (
    <header className="sticky top-0 z-40 bg-[#FBF3E6]/95">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-x-6 gap-y-1 pt-3 pb-1">
        <Logo to="/home" />

        <nav aria-label="Main" className="order-3 md:order-none w-full md:w-auto md:flex-1 overflow-x-auto -mx-1 px-1">
          <ul className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
            <li>
              <NavLink
                to="/note-requests"
                className={({ isActive }) =>
                  `block px-3 py-2 text-[15px] rounded-lg transition-colors no-underline ${
                    isActive ? 'text-[#C84B31] stitch-underline font-medium' : 'text-[#6B5344] hover:text-[#2D1B0E]'
                  }`
                }
              >
                Notes Marketplace
              </NavLink>
            </li>
            {items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  title={it.bn}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-[15px] rounded-lg transition-colors no-underline ${
                      isActive ? 'text-[#C84B31] stitch-underline font-medium' : 'text-[#6B5344] hover:text-[#2D1B0E]'
                    }`
                  }
                >
                  {it.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <Link to="/profile" aria-label="My profile" title="My profile" className="rounded-full ring-2 ring-[#EAD5BC] hover:ring-[#C84B31] transition-shadow">
            <BengaliAvatar config={avatar} size={40} round title="Your character" />
          </Link>
        </div>
      </div>
      <KanthaBand />
    </header>
  );
};

