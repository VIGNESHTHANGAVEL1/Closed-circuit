import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  {
    label: 'Flow',
    submenu: [
      { label: 'Flow in Text', path: '/flow-text' },
      { label: 'Flow in Diagram', path: '/flow-diagram' },
      { label: 'Flow in Voice', path: '/flow-voice' },
    ],
  },
  {
    label: 'How We Differ',
    submenu: [
      { label: 'With Social Media', path: '/differ-social' },
      { label: 'With Facebook', path: '/differ-facebook' },
      { label: 'With WhatsApp', path: '/differ-whatsapp' },
    ],
  },
  { label: 'Top 10 Reasons', path: '/top-reasons' },
  { label: 'Gifts', path: '/gifts' },
  { label: 'Use Cases', path: '/use-cases' },
  { label: 'Taglines', path: '/taglines' },
  { label: 'Clients', path: '/clients' },
  { label: 'Contact', path: '/contact' },
];

const navLinkClass = (active) =>
  `block whitespace-nowrap rounded-full px-2.5 lg:px-3 py-1.5 text-[11px] lg:text-xs font-semibold transition-all duration-200 border ${
    active
      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border-indigo-500/30'
      : 'text-slate-400 border-transparent hover:text-white hover:bg-white/10'
  }`;

const dropdownBtnClass = (active) =>
  `flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 lg:px-3 py-1.5 text-[11px] lg:text-xs font-semibold transition-all duration-200 ${
    active
      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
      : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
  }`;

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleDropdownToggle = (label) => {
    if (isDesktop) return;
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleMouseEnter = (label) => {
    if (isDesktop) setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    if (isDesktop) setActiveDropdown(null);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#030712]/70 backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-2 px-3 sm:px-4 lg:px-5">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 group min-w-0">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm text-white font-bold shadow-[0_0_16px_rgba(99,102,241,0.4)] transition-transform duration-300 group-hover:scale-105">
              <span className="relative z-10">CC</span>
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="font-display text-base lg:text-lg font-bold text-white tracking-wide leading-tight truncate">
                Closed Circuit
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-indigo-400 leading-none">
                Private Network
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-center min-w-0 mx-1">
            <div className="flex items-center gap-0.5 bg-white/5 px-1 py-1 rounded-full border border-white/10">
              {navItems.map((item) => {
                const isSubActive = item.submenu?.some((sub) => isActive(sub.path));
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.submenu ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDropdownToggle(item.label)}
                          className={dropdownBtnClass(activeDropdown === item.label || isSubActive)}
                        >
                          {item.label}
                          <ChevronDown
                            size={12}
                            className={`shrink-0 transition-transform duration-200 ${
                              activeDropdown === item.label ? 'rotate-180 text-indigo-400' : 'text-slate-500'
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 top-[calc(100%+8px)] w-56 rounded-xl border border-white/10 bg-[#0f172a]/95 p-2 shadow-2xl backdrop-blur-xl z-50"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.path}
                                  to={subitem.path}
                                  className={`block rounded-lg px-3 py-2 text-xs font-medium transition ${
                                    isActive(subitem.path)
                                      ? 'bg-indigo-500/10 text-indigo-400'
                                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                                  }`}
                                >
                                  {subitem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link to={item.path} className={navLinkClass(isActive(item.path))}>
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-white/10 bg-[#0f172a]/95 backdrop-blur-xl"
            >
              <div className="space-y-1 px-4 py-4 max-h-[70vh] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.submenu ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDropdownToggle(item.label)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 hover:bg-white/5"
                        >
                          {item.label}
                          <ChevronDown
                            size={16}
                            className={activeDropdown === item.label ? 'rotate-180 text-indigo-400' : ''}
                          />
                        </button>
                        {activeDropdown === item.label && (
                          <div className="ml-2 mb-1 space-y-0.5 border-l border-white/10 pl-3">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.path}
                                to={subitem.path}
                                onClick={() => setIsOpen(false)}
                                className={`block rounded-lg px-3 py-2 text-sm ${
                                  isActive(subitem.path) ? 'text-indigo-400' : 'text-slate-400'
                                }`}
                              >
                                {subitem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                          isActive(item.path) ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className="h-16" />
    </>
  );
}
