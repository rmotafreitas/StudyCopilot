import { WorkspaceParams } from "@/App";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWorkspace } from "@/lib/api";
import api from "@/lib/api/api";
import { hankoApi } from "@/lib/hanko";
import { IWorkspace, useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
        <section className="flex flex-col justify-center items-center mt-8 gap-4 p-8">
          <img
            src={`${api.getUri()}/uploads/${workspace.image}`}
            className="w-9/12 h-48 object-cover rounded-lg shadow-md"
            alt="Banner"
          />
          <p className="text-center text-2xl font-semibold">{workspace.name}</p>
          <p className="text-center text-lg">{workspace.description}</p>
          <Tabs defaultValue="homework" className="w-9/12">
            <TabsList className="flex justify-center gap-4">
              <TabsTrigger className="flex-1" value="homework">
                Homework
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="chat">
                Chat
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="files">
                Files
              </TabsTrigger>
            </TabsList>
            <TabsContent value="homework">
              <p>Homework!</p>
              <Link
                to={`/me/workspaces/${workspace.id}/board-session`}
                className="text-primary"
              >
                Click here to Start a new homework session!
              </Link>
              <p>Old homeworks!</p>
              <div className="flex flex-col gap-2">
                {workspace.Homework.map(
                  (homework) =>
                    homework.questions.length > 0 && (
                      <Link
                        to={`/me/workspaces/${workspace.id}/board-session/${homework.id}`}
                        key={homework.id}
                        className="text-primary"
                      >
                        {homework.created_at}
                      </Link>
                    )
                )}
              </div>
            </TabsContent>
            <TabsContent value="chat">Chat</TabsContent>
            <TabsContent value="files">Files</TabsContent>
          </Tabs>
        </section>
      </div>
    )
  );
}
