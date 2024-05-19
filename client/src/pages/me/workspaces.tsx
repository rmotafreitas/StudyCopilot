import { Navbar } from "@/components/navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { WorkspaceCard } from "@/components/workspace-card";
import { createWorkspace } from "@/lib/api";
import { hankoApi } from "@/lib/hanko";
import { useAuth } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
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

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleCreateWorkspace = () => {
    setIsDialogOpen(true);
  };

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleConfirmCreateWorkspace = () => {
    setIsDialogOpen(false);
    if (!file || !name || !description) {
      return;
    }
    createWorkspace(name, description, file as File).then((res) => {
      if (res) {
        fetchUserFromCookies();
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      const img = document.getElementById("preview") as HTMLImageElement;
      img.src = URL.createObjectURL(files[0]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex-1 flex flex-col items-center my-4 w-9/12 self-center">
        <h2 className="text-2xl font-bold pb-2 text-center">My workspaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          {user?.Workspace.map((workspace) => (
            <div key={workspace.id}>
              <WorkspaceCard {...workspace} />
            </div>
          ))}
        </div>
        <div className="text-white absolute bottom-4 self-end bg-primary rounded-full flex flex-row gap-2 p-4 justify-center items-center">
          <PlusCircle size={24} />
          <button
            onClick={handleCreateWorkspace}
            className="text-white text-lg font-semibold"
          >
            Create workspace
          </button>
        </div>
      </section>
      <Dialog
        onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
        open={isDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new workspace</DialogTitle>
            <DialogDescription>
              <p>
                You can create a new workspace by providing a name, a
                description and an image.
              </p>
              <div className="flex flex-col gap-4 rounded-md my-4">
                <Input
                  type="text"
                  placeholder="Workspace name"
                  className="p-2 rounded-md"
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Workspace description"
                  className="p-2 rounded-md"
                  onChange={(e) => setDescription(e.target.value)}
                />
                <input
                  onChange={handleFileChange}
                  type="file"
                  id="file"
                  className="sr-only"
                />
                <label
                  htmlFor="file"
                  className="bg-muted text-white rounded-md font-semibold cursor-pointer h-48 overflow-hidden flex flex-col justify-center items-center border-2 border-primary"
                >
                  <img
                    id="preview"
                    src=""
                    className={`w-full h-full object-cover ${
                      file ? "block" : "hidden"
                    }`}
                  />
                  <p
                    className={`text-center text-primary font-semibold text-lg
                  ${file ? "hidden" : "block"}
                  `}
                  >
                    Upload workspace image
                  </p>
                </label>
              </div>
              <div className="flex flex-row gap-4 justify-end">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-red-500 text-white p-2 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCreateWorkspace}
                  className="bg-primary text-white p-2 rounded-md font-semibold"
                >
                  Create
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
