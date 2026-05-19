import { cn } from "@/lib/utils";

export function BackgroundPattern({ className }: { className?: string }) {
    return (
        <div className={cn("absolute inset-0 -z-10 overflow-hidden bg-background", className)}>
            <svg className="absolute inset-0 h-full w-full stroke-primary/[0.08] [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)] pointer-events-none" aria-hidden="true" >
                <defs>
                    <pattern id="hero-grid-pattern" width={48} height={48} patternUnits="userSpaceOnUse" x="50%" y={-1} >
                        <path d="M.5 48V.5H48" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" strokeWidth={0} />
            </svg>
        </div>
    );
}
