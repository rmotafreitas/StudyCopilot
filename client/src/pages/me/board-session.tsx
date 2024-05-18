import { WorkspaceParams } from "@/App";
import { MicButton } from "@/components/mic-button";
import { Navbar } from "@/components/navbar";
import { getWorkspace } from "@/lib/api";
import { hankoApi } from "@/lib/hanko";
import { IWorkspace, useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Excalidraw } from "@excalidraw/excalidraw";

export function MyBoardSessionPage() {
  const router = useNavigate();
  const { id } = useParams<WorkspaceParams>();
  const { fetchUserFromCookies } = useAuth();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const excalidrawAPI = useRef(null);

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
        <section className="flex flex-col justify-center items-center mt-8 gap-4 p-8">
          <p>Workspace: {workspace?.name}</p>
          <p>Board</p>
          <div className="border-4 border-primary rounded-lg overflow-hidden h-[720px] w-full">
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            <Excalidraw ref={excalidrawAPI} />
          </div>
        </section>
        <div className="fixed bottom-4 right-4">
          <MicButton workspace={workspace} />
        </div>
      </div>
    )
  );
}
