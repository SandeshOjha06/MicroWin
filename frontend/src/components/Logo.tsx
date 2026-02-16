


interface LogoProps {
    className?: string;
    darkMode?: boolean;
}

export function Logo({ className = "h-8 w-auto", darkMode = false }: LogoProps) {
    // Use the specific dark mode icon if darkMode is true, otherwise use original
    const logoSrc = darkMode ? "/dashboard_brown.svg" : "/dashboard_light.svg";




    return (
        <img
            src={logoSrc}
            alt="MicroWins Logo"
            className={`object-contain transition-all duration-300 ${className}`}

            onError={(e) => {
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}
