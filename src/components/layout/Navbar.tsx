import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        // Logic for 'HORARIOS'
        if (target === 'horarios') {
            if (location.pathname === '/') {
                scrollToSection('horarios-general');
            } else if (location.pathname.startsWith('/disciplina/')) {
                scrollToSection('horarios-disciplina');
            } else {
                // Determine fallback, maybe go home and scroll
                navigate('/');
                setTimeout(() => scrollToSection('horarios-general'), 100);
            }
            return;
        }

        // Logic for other anchors (NOSOTROS, DISCIPLINAS)
        if (location.pathname === '/') {
            scrollToSection(target);
        } else {
            navigate('/');
            // Use setTimeout to allow navigation to complete before scrolling
            // Ideally, pass state and handle in LandingPage useEffect, but this is a simpler quick impl
            setTimeout(() => {
                scrollToSection(target);
            }, 100);
        }
    };

    const navLinks = [
        { name: 'INICIO', path: '/', isLink: true },
        { name: 'MAESTROS', path: '#', isLink: false }, // Placeholder behavior
        { name: 'NOSOTROS', target: 'nosotros', isLink: false }, // Added based on context
        { name: 'DISCIPLINAS', target: 'disciplinas', isLink: false },
        { name: 'HORARIOS', target: 'horarios', isLink: false },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 shadow-md py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo(0, 0)}>
                    {/* Logo Placeholder Icon */}
                    <div className="h-8 w-8 bg-brand-red rounded transform skew-x-[-10deg]" />
                    <span className="text-2xl font-heading font-bold text-white uppercase tracking-wider">
                        LOMAS <span className="text-brand-red">FIGHT</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        if (link.isLink && link.path === '/') {
                            return (
                                <Link
                                    key={link.name}
                                    to="/"
                                    className="text-white font-heading font-bold uppercase tracking-wide text-sm hover:text-brand-red transition-colors"
                                    onClick={() => window.scrollTo(0, 0)}
                                >
                                    {link.name}
                                </Link>
                            )
                        }
                        if (link.name === 'MAESTROS') return null; // Removing placeholder if not in sections

                        return (
                            <a
                                key={link.name}
                                href={`#${link.target}`}
                                onClick={(e) => handleNavClick(e, link.target!)}
                                className="text-white font-heading font-bold uppercase tracking-wide text-sm hover:text-brand-red transition-colors cursor-pointer"
                            >
                                {link.name}
                            </a>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="hidden md:block">
                    <Button variant="whatsapp" size="sm">
                        WHATSAPP
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black border-t border-gray-800 p-4 md:hidden flex flex-col gap-4 shadow-xl">
                    {navLinks.map((link) => {
                        if (link.isLink && link.path === '/') {
                            return (
                                <Link
                                    key={link.name}
                                    to="/"
                                    className="text-white font-heading font-bold uppercase tracking-wide text-lg py-2 border-b border-gray-800 hover:text-brand-red"
                                    onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}
                                >
                                    {link.name}
                                </Link>
                            )
                        }
                        if (link.name === 'MAESTROS') return null;

                        return (
                            <a
                                key={link.name}
                                href={`#${link.target}`}
                                onClick={(e) => handleNavClick(e, link.target!)}
                                className="text-white font-heading font-bold uppercase tracking-wide text-lg py-2 border-b border-gray-800 hover:text-brand-red"
                            >
                                {link.name}
                            </a>
                        );
                    })}
                    <Button variant="whatsapp" className="w-full mt-4">
                        WHATSAPP
                    </Button>
                </div>
            )}
        </nav>
    );
}
