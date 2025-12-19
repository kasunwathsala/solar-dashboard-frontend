import { Link } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
  
  /**
   * Only JS expressions are allowed in return statement => js code that evaluates to a value
   * Function calls
   * primitive value
   * variables
   * ternary statements
   */

  return (
    <nav className={"px-12 py-6 flex justify-between items-center bg-background border-b border-border transition-colors"}>
      <Link to="/" className={"flex items-center gap-3 group"}>
        <img 
          src="/assets/images/sun.png" 
          alt="SunLeaf Energy Logo" 
          className="h-10 w-auto object-contain transition-transform group-hover:scale-110"
        />
        <span className="font-[Inter] text-xl font-semibold text-foreground">SunLeaf Energy</span>
      </Link>

      <div className={"flex items-center gap-12"}>
        <div className={"flex items-center gap-3 px-3 py-2"}>
          <SignedIn>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chart-column-icon lucide-chart-column logo w-4 h-4 block"
          >
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </svg>
          {/* <span className="font-[Inter] text-sm font-medium">Dashboard</span> */}
          
          <Link to="/dashboard" className="font-[Inter] text-sm font-medium">Dashboard</Link>
          </SignedIn>
          {/* <a href="/dashboard" className="font-[Inter] text-sm font-medium">Dashboard</a> */}
        </div>
        <div className={"flex items-center gap-4"}>
          <ThemeToggle />
          <SignedOut>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link
                to="/sign-in"
                className={"flex items-center gap-3 px-4 py-2"}
              >
                Sign In
              </Link>
            </Button>
            <Button asChild variant={"outline"} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link
                to="/sign-up"
                className={"flex items-center gap-3 px-4 py-2"}
              >
                Sign Up
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      
    </nav>
  );
};

export default Navigation;
