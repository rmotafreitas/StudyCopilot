import { WorkspaceParams } from "@/App";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  deleteHomework,
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
} from "@/lib/api";
import api from "@/lib/api/api";
import { hankoApi } from "@/lib/hanko";
import { IWorkspace, useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { Pencil, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export function MyWorkspacePage() {
  const router = useNavigate();
  const { id } = useParams<WorkspaceParams>();
  const { fetchUserFromCookies } = useAuth();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [newWorkspace, setNewWorkspace] = useState<IWorkspace | null>(null);

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
      setNewWorkspace(res);
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
            id="banner"
          />
          <div className="flex flex-col gap-4 w-9/12 bg-muted p-4 rounded-md">
            <p className="self-start text-2xl font-bold">{workspace.name}</p>
            <p className="self-start text-xl font-semibold">
              {workspace.description}
            </p>
          </div>
          <Tabs defaultValue="homework" className="w-9/12 flex-1 flex-col">
            <TabsList className="justify-center gap-4 w-full">
              <TabsTrigger className="flex-1" value="homework">
                Homework
              </TabsTrigger>
              {/* <TabsTrigger className="flex-1" value="chat">
                Chat
              </TabsTrigger> */}
              {/* <TabsTrigger className="flex-1" value="files">
                Files
              </TabsTrigger> */}
              <TabsTrigger className="flex-1" value="settings">
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="homework"
              className="justify-center items-start bg-muted p-4 rounded-md"
            >
              <div className="flex flex-col">
                <Link
                  to={`/me/workspaces/${workspace.id}/board-session`}
                  className="text-white absolute bottom-4 self-end bg-primary rounded-full flex flex-row gap-2 p-4 justify-center items-center"
                >
                  <Pencil size={24} />
                  <p className="text-white text-lg font-semibold">
                    Start homeworking
                  </p>
                </Link>
              </div>
              <p className="text-xl font-bold mb-4">My previous homeworks ✏️</p>
              <div className="flex flex-col gap-2">
                {workspace.Homework.map(
                  (homework) =>
                    homework.questions.length > 0 && (
                      <div
                        key={homework.id}
                        className="flex flex-row gap-4 p-4 justify-between items-center"
                      >
                        <Link
                          to={`/me/workspaces/${workspace.id}/board-session/${homework.id}`}
                          className="text-lg font-semibold text-primary underline"
                        >
                          Homework from{" "}
                          {new Date(homework.created_at).toLocaleDateString()}
                          {" 📅 "}
                          with {homework.questions.length} questions
                        </Link>
                        <button
                          onClick={() => {
                            deleteHomework(homework.id).then((res) => {
                              window.location.reload();
                            });
                          }}
                          className="text-red-500 font-bold flex flex-row gap-2 justify-center items-center"
                        >
                          <Trash size={24} />
                        </button>
                      </div>
                    )
                )}
              </div>
            </TabsContent>
            {/* <TabsContent value="chat">Chat</TabsContent> */}
            {/* <TabsContent value="files">Files</TabsContent> */}
            <TabsContent className="bg-muted p-4 rounded-md" value="settings">
              <p className="text-xl font-bold mb-4">Settings</p>
              <div className="flex flex-col gap-4 rounded-md my-4">
                <Input
                  type="text"
                  placeholder="Workspace name"
                  className="p-2 rounded-md"
                  value={newWorkspace?.name}
                  onChange={(e) => {
                    if (newWorkspace)
                      setNewWorkspace({
                        ...newWorkspace,
                        name: e.target.value,
                      });
                  }}
                />
                <Input
                  placeholder="Workspace description"
                  className="p-2 rounded-md"
                  value={newWorkspace?.description}
                  onChange={(e) => {
                    if (newWorkspace)
                      setNewWorkspace({
                        ...newWorkspace,
                        description: e.target.value,
                      });
                  }}
                />
                <input
                  onChange={(e) => {
                    if (e.target.files && newWorkspace) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        if (newWorkspace)
                          setNewWorkspace({
                            ...newWorkspace,
                            image: e.target?.result as string,
                          });
                      };
                      reader.readAsDataURL(file);
                      const img = document.getElementById(
                        "banner"
                      ) as HTMLImageElement;
                      img.src = URL.createObjectURL(file);
                    }
                  }}
                  type="file"
                  id="file"
                  className="sr-only"
                />
                <label
                  htmlFor="file"
                  className="flex items-center justify-center w-full h-12 p-4 gap-2 rounded-full bg-primary cursor-pointer text-white font-semibold"
                >
                  Change workspace image
                </label>
                <div className="absolute bottom-4 flex flex-row gap-4 self-end">
                  <button
                    onClick={() => {
                      const file = document.getElementById(
                        "file"
                      ) as HTMLInputElement;

                      if (newWorkspace?.name && newWorkspace?.description)
                        updateWorkspace(
                          workspace,
                          newWorkspace.name,
                          newWorkspace?.description,
                          file.files?.[0]
                        ).then((res) => {
                          window.location.reload();
                        });
                    }}
                    className="text-white self-end bg-primary rounded-full flex flex-row gap-2 p-4 justify-center items-center"
                  >
                    <Save size={24} />
                    <p className="text-white text-lg font-semibold">
                      Save workspace
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      deleteWorkspace(workspace.id).then((res) => {
                        router("/me/workspaces");
                      });
                    }}
                    className="text-white bg-red-500  self-end bg-primary rounded-full flex flex-row gap-2 p-4 justify-center items-center"
                  >
                    <Trash size={24} />
                    <p className="text-white text-lg font-semibold">
                      Delete workspace!
                    </p>
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    )
  );
}
