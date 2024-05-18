import { WorkspaceParams } from "@/App";
import { MicButton } from "@/components/mic-button";
import { Navbar } from "@/components/navbar";
import { getWorkspace } from "@/lib/api";
import { hankoApi } from "@/lib/hanko";
import { IWorkspace, useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function MyWorkspacePage() {
  const router = useNavigate();
  const { id } = useParams<WorkspaceParams>();
  const { fetchUserFromCookies } = useAuth();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);

  useEffect(() => {
    fetchUserFromCookies().then((res) => {
      if (!res) {
        router("/auth");
        return;
      }
    });

    if (!id) {
      router("/me/workspaces");
      return;
    }

    getWorkspace(id).then((res) => {
      if (!res) {
        router("/me/workspaces");
        return;
      }

      setWorkspace(res);
    });

    register(hankoApi).catch((error) => {
      console.error(error);
      // handle error
    });
  }, []);

  return (
    workspace && (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <section className="flex-1 flex flex-col items-center my-4">
          <p>Workspace: {workspace?.name}</p>
          <p>Board</p>
          <iframe
            title="Excalidraw"
            className="w-[90%] flex-1 border-2 border-gray-300 rounded-lg"
            src="https://excalidraw.com/#room=3ec43011052d720bb0ed,cEW1u5-52c8jTaCpcGLFfQ"
          />
        </section>
        <div className="fixed bottom-4 right-4">
          <MicButton workspace={workspace} />
        </div>
      </div>
    )
  );
}
