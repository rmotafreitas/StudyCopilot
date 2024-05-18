import { Navbar } from "@/components/navbar";
import { WorkspaceCard } from "@/components/workspace-card";
import { hankoApi } from "@/lib/hanko";
import { useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function MyWorkspacesPage() {
  const router = useNavigate();
  const { user, fetchUserFromCookies } = useAuth();

  useEffect(() => {
    fetchUserFromCookies().then((res) => {
      if (!res) {
        router("/auth");
        return;
      }
    });

    register(hankoApi).catch((error) => {
      console.error(error);
      // handle error
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex-1 flex flex-col items-center my-4">
        <h2 className="text-2xl font-bold pb-2 text-center">My workspaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          {user?.Workspace.map((workspace) => (
            <div key={workspace.id}>
              <WorkspaceCard {...workspace} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
