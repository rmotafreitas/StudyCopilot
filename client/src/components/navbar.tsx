import { useAuth } from "@/lib/hooks/useAuth";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="flex px-8 py-4 justify-between w-full items-center border-border border-b-2">
      <Link to="/" className="text-primary font-bold text-2xl">
        Study Copilot
      </Link>
      <ul className="flex gap-5 items-center">
        <ModeToggle />
        <li className="text-lg font-semibold">
          <Button>
            <Link to={user ? "/me/workspaces" : "/auth"}>
              {user ? "My Space" : "Login"}
            </Link>
          </Button>
        </li>
        {user && (
          <li className="text-lg font-semibold">
            <Button className="bg-red-500">
              <Link to="/auth" onClick={signOut}>
                Logout
              </Link>
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
}
