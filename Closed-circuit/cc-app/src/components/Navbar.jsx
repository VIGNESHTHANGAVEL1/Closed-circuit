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
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
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
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-transform duration-300 group-hover:scale-105">
              <span className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative z-10">CC</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-xl font-bold text-white tracking-wide">Closed Circuit</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-indigo-400">Private Network</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 shadow-lg">
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
                        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 xl:px-5 py-2.5 text-[13px] xl:text-sm font-semibold transition-all duration-300 ${
                          activeDropdown === item.label || isSubActive
                            ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                            : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${
                            activeDropdown === item.label ? 'rotate-180 text-indigo-400' : 'text-slate-500'
                          }`}
                        />
                      </button>
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute left-0 top-[calc(100%+12px)] w-64 rounded-2xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl"
                        >
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.path}
                              to={subitem.path}
                              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                isActive(subitem.path)
                                  ? 'bg-gradient-to-r from-indigo-500/10 to-transparent text-indigo-400 border-l-2 border-indigo-500'
                                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-white/20'
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
                    <Link
                      to={item.path}
                      className={`block whitespace-nowrap rounded-full px-4 xl:px-5 py-2.5 text-[13px] xl:text-sm font-semibold transition-all duration-300 border ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                          : 'text-slate-400 border-transparent hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl"
            >
              <div className="space-y-1.5 px-6 py-6">
                {navItems.map((item) => (
                  <div key={item.label} className="bg-white/[0.02] rounded-2xl border border-white/5 p-1">
                    {item.submenu ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDropdownToggle(item.label)}
                          className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
                        >
                          {item.label}
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${
                              activeDropdown === item.label ? 'rotate-180 text-indigo-400' : 'text-slate-500'
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mx-2 mb-2 space-y-1 overflow-hidden"
                            >
                              {item.submenu.map((subitem) => (
                                <Link
                                  key={subitem.path}
                                  to={subitem.path}
                                  onClick={() => setIsOpen(false)}
                                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                                    isActive(subitem.path)
                                      ? 'bg-indigo-500/10 text-indigo-400'
                                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block w-full rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                          isActive(item.path)
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
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

      <div className="h-20" />
    </>
  );
}
