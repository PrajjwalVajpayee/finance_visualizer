// src/components/Navbar.jsx

import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HiOutlineMenu } from 'react-icons/hi';

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const linkClass = (path) =>
    `block px-4 py-2 md:py-0 rounded transition-colors duration-200 ${
      pathname === path
        ? 'text-blue-600 dark:text-blue-400 font-semibold'
        : 'text-slate-700 dark:text-slate-300'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <NavLink
          to="/"
          className="text-xl font-bold text-slate-900 dark:text-white tracking-wide"
        >
          Finance Visualizer
        </NavLink>

        <button
          className="md:hidden text-slate-700 dark:text-slate-300"
          onClick={() => setOpen(!open)}
        >
          <HiOutlineMenu size={24} />
        </button>

        <div
          className={`${
            open ? 'block' : 'hidden'
          } md:flex md:items-center gap-6 mt-3 md:mt-0`}
        >
          <NavLink to="/" className={linkClass('/')} onClick={() => setOpen(false)}>
            Transactions
          </NavLink>
          <NavLink
            to="/dashboard"
            className={linkClass('/dashboard')}
            onClick={() => setOpen(false)}
          >
            Dashboard
          </NavLink>

          <button
            onClick={() => setDark(!dark)}
            className="ml-2 mt-2 md:mt-0 rounded px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:opacity-90"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
      </nav>
    </header>
  );
}
