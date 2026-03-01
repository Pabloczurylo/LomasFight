import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loggedUser, setLoggedUser] = useState<{ nombre_usuario: string; rol: string } | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Read user from localStorage on mount and when location changes
    useEffect(() => {
        const usuarioStr = localStorage.getItem('usuario');
        const token = localStorage.getItem('token');
        if (token && usuarioStr) {
            try {
                setLoggedUser(JSON.parse(usuarioStr));
            } catch {
                setLoggedUser(null);
            }
        } else {
            setLoggedUser(null);
        }
    }, [location]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        if (target === 'horarios') {
            if (location.pathname === '/') {
                scrollToSection('horarios-general');
            } else if (location.pathname.startsWith('/disciplina/')) {
                scrollToSection('horarios-disciplina');
            } else {
                navigate('/');
                setTimeout(() => scrollToSection('horarios-general'), 100);
            }
            return;
        }

        if (location.pathname === '/') {
            scrollToSection(target);
        } else {
            navigate('/');
            setTimeout(() => {
                scrollToSection(target);
            }, 100);
        }
    };

    // Where to redirect when user clicks their name
    const getPanelPath = () => {
        if (!loggedUser) return '/login';
        return loggedUser.rol !== 'admin' ? '/admin/estados-alumnos' : '/admin';
    };

    const navLinks = [
        { name: 'INICIO', path: '/', isLink: true },
        { name: 'NOSOTROS', target: 'nosotros', isLink: false },
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

                {/* CTA — shows user name if logged in, otherwise login button */}
                <div className="hidden md:block">
                    {loggedUser ? (
                        <Link to={getPanelPath()}>
                            <button className="flex items-center gap-2 bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red text-white font-bold text-sm px-4 py-2 rounded-lg transition-all group cursor-pointer">
                                <User size={16} className="text-brand-red group-hover:scale-110 transition-transform" />
                                <span className="uppercase tracking-wide">
                                    {loggedUser.nombre_usuario}
                                </span>
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <Button variant="primary" size="sm">
                                INICIAR SESIÓN
                            </Button>
                        </Link>
                    )}
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

                    {loggedUser ? (
                        <Link to={getPanelPath()} onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full flex items-center justify-center gap-2 border border-brand-red text-white font-bold px-4 py-3 rounded-lg mt-4 hover:bg-brand-red/20 transition-all cursor-pointer">
                                <User size={16} className="text-brand-red" />
                                <span className="uppercase tracking-wide">{loggedUser.nombre_usuario}</span>
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="primary" className="w-full mt-4">
                                INICIAR SESIÓN
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
