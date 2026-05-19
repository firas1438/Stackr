import { Layers, History, Github } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const nav = [
    { to: '/build', label: 'Build', icon: Layers },
    { to: '/history', label: 'History', icon: History },
    { to: 'https://github.com/firas1438/Stackr', label: 'Repo', icon: Github, className: 'hidden sm:flex' },
]

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-4">
                <Link to="/" className="flex items-center gap-2 font-semibold text-md sm:text-lg tracking-tight">
                    <img src="/favicon.svg" alt="Stackr" className="h-7 w-7" />
                    Stackr
                </Link>
                <nav className="flex items-center gap-0 sm:gap-1">
                    {nav.map(({ to, label, icon: Icon, className }) => (
                        <NavLink key={to} to={to}
                            className={({ isActive }) =>
                                cn('flex items-center gap-2 rounded-lg px-2.5 sm:px-3 py-2 text-sm font-medium transition-colors',
                                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                                    className
                                )
                            }
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    )
}
