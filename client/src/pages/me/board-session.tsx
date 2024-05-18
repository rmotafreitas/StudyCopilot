import { WorkspaceParams } from "@/App";
import { MicButton } from "@/components/mic-button";
import { Navbar } from "@/components/navbar";
import { getWorkspace } from "@/lib/api";
import { hankoApi } from "@/lib/hanko";
import { IWorkspace, useAuth } from "@/lib/hooks/useAuth";
import { Excalidraw } from "@excalidraw/excalidraw";
import { register } from "@teamhanko/hanko-elements";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function MyBoardSessionPage() {
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
        <section className="flex flex-col justify-center items-center gap-4 pt-8 px-8 pb-4">
          <div className="border-4 border-primary rounded-lg overflow-hidden h-[800px] w-full">
            <Excalidraw />
          </div>
        </section>
        <div className="flex flex-row justify-center items-center px-8 pb-4">
          <MicButton workspace={workspace} />
        </div>
      </div>
    )
  );
}
