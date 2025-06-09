import { useTheme } from "./theme-provider";

export default function Logo() {
  
    const { theme, setTheme } = useTheme()

    function toggleTheme()  {
      setTheme(theme === "light" ? "dark" : "light");
    }

    return (
      <div className="flex items-center justify-center" onClick={toggleTheme}>
        <svg
          viewBox="0 0 100 100"


          className="w-12 h-12 text-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
            <path
                d="M0 62.5 V37.5 L50 0 L100 37.5 V62.5 C100 77.5 87.5 90 72.5 90 H27.5 C12.5 90 0 77.5 0 62.5 Z"
                fill="currentColor"/>
            <rect x="18.75" y="43.75" width="25" height="25" rx="9" fill="var(--secondary)" />
            <rect x="56.25" y="43.75" width="25" height="25" rx="9" fill="var(--secondary)" />
        </svg>
      </div>
    );
  }
  