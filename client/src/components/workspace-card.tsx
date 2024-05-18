import api from "@/lib/api/api";
import { IWorkspace } from "@/lib/hooks/useAuth";
import { Link } from "react-router-dom";

export function WorkspaceCard({ id, name, description, image }: IWorkspace) {
  return (
    <Link
      to={`/me/workspaces/${id}`}
      className="flex flex-col items-center justify-center"
    >
      <div className="bg-muted rounded-lg shadow-md p-4">
        <img
          src={`${api.getUri()}/uploads/${image}`}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <h3 className="text-xl font-semibold mt-4">{name}</h3>
        <p className="text-foreground mt-2">{description}</p>
      </div>
    </Link>
  );
}
