import { WorkspaceParams } from "@/App";
import { Navbar } from "@/components/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWorkspace } from "@/lib/api";
import api from "@/lib/api/api";
import { hankoApi } from "@/lib/hanko";
import { IWorkspace, useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { Pencil } from "lucide-react";
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
        <section className="flex flex-col flex-1 justify-start items-center mt-8 gap-4 m-8">
          <img
            src={`${api.getUri()}/uploads/${workspace.image}`}
            className="w-9/12 h-48 object-cover rounded-lg shadow-md border-border border-2"
            alt="Banner"
          />
          <div className="flex flex-col gap-4 w-9/12 bg-muted p-4 rounded-md">
            <p className="self-start text-2xl font-bold">{workspace.name}</p>
            <p className="self-start text-xl font-semibold">
              {workspace.description}
            </p>
          </div>
          <Tabs defaultValue="homework" className="w-9/12 flex-1 flex-col">
            <TabsList className="justify-center gap-4 hidden">
              <TabsTrigger className="flex-1" value="homework">
                Homework
              </TabsTrigger>
              {/* <TabsTrigger className="flex-1" value="chat">
                Chat
              </TabsTrigger> */}
              {/* <TabsTrigger className="flex-1" value="files">
                Files
              </TabsTrigger> */}
            </TabsList>
            <TabsContent
              value="homework"
              className="flex flex-col flex-1 justify-center items-start bg-muted p-4 rounded-md"
            >
              <Link
                to={`/me/workspaces/${workspace.id}/board-session`}
                className="text-white absolute bottom-4 self-end bg-primary rounded-full flex flex-row gap-2 p-4 justify-center items-center"
              >
                <Pencil size={24} />
                <p className="text-white text-lg font-semibold">
                  Start homeworking
                </p>
              </Link>
              <p className="text-xl font-bold mb-4">My previous homeworks ✏️</p>
              <div className="flex flex-col gap-2">
                {workspace.Homework.map(
                  (homework) =>
                    homework.questions.length > 0 && (
                      <Link
                        to={`/me/workspaces/${workspace.id}/board-session/${homework.id}`}
                        key={homework.id}
                        className="text-primary"
                      >
                        <p className="text-lg font-semibold">
                          Homework from{" "}
                          {new Date(homework.created_at).toLocaleDateString()}
                          {" 📅 "}
                          with {homework.questions.length} questions
                        </p>
                      </Link>
                    )
                )}
              </div>
            </TabsContent>
            {/* <TabsContent value="chat">Chat</TabsContent> */}
            {/* <TabsContent value="files">Files</TabsContent> */}
          </Tabs>
        </section>
      </div>
    )
  );
}
