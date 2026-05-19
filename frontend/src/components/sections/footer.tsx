import { Link } from 'react-router-dom'

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-6 sm:px-4 py-6 md:flex md:items-center md:justify-between">
                <div className="flex justify-center space-x-6 md:order-2">
                    <Link to="/build" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                        Build Stack
                    </Link>
                    <Link to="/history" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                        Preview History
                    </Link>
                    <Link to="https://github.com/firas1438/Stackr" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">
                        GitHub
                    </Link>
                </div>
                <div className="mt-8 md:order-1 md:mt-0 text-center md:text-left">
                    <p className="text-sm font-light text-muted-foreground">
                        &copy; {new Date().getFullYear()} Stackr. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
