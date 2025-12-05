import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Github, Home, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="absolute flex items-center justify-center h-screen w-screen">
      <h1 className="absolute flex items-center top-4 left-4 text-2xl font-bold">
        <Logo className="w-8 h-8 mr-2" />
        BuildIT
      </h1>
      <div className="absolute flex items-center top-4 right-4 text-2xl font-bold">
        <ThemeTogglerButton modes={["light", "dark"]} />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-8xl mb-4">404</h2>
        <p className="font-light text-lg uppercase tracking-widest px-12 pb-4 mb-4 border-b border-dashed border-foreground">
          Oops! Nothing was found
        </p>
        <p className="text-center max-w-2xl mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.{" "}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors underline decoration-dotted">Return to homepage</Link>
        </p>
        <div className="flex gap-4 items-center justify-center">
        <Button size="icon-lg">
                <Home />
            </Button>
            <Button size="icon-lg">
                <Github />
            </Button>
            <Button size="icon-lg">
                <Linkedin />
            </Button>
            <Button size="icon-lg">
                <Mail />
            </Button>
        </div>
      </div>
    </div>
  );
}
