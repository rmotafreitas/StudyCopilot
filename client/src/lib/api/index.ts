// @ts-expect-error Because we are using js-cookie
import Cookies from "js-cookie";
import { IHomeWork, IWorkspace, User } from "../hooks/useAuth";
import api from "./api";

const auth = async (login: string, password: string): Promise<boolean> => {
  const res = await api.post("/auth/me", { login, auth: password });

  if (res.status !== 200) {
    return false;
  }

  api.defaults.headers.Authorization = `Bearer ${res.data.token}`;
  Cookies.set("token", res.data.accessToken);

  return true;
};

const me = async () => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  const res = await api.get("/auth/me");

  if (res.status !== 200) {
    return null;
  }

  return res.data;
};

const update = async (data: User): Promise<boolean> => {
  try {
    api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
    const res = await api.put("/auth/me", data);

    if (res.status !== 200) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

const getWorkspace = async (id: string): Promise<IWorkspace | null> => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  const res = await api.get(`/auth/me/workspaces/${id}`);

  if (res.status !== 200) {
    return null;
  }

  return res.data;
};

const getHomework = async (id: string): Promise<IHomeWork | null> => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  const res = await api.get(`/auth/me/homeworks/${id}`);

  if (res.status !== 200) {
    return null;
  }

  return res.data;
};

const createHomeworkSession = async (
  workspace: IWorkspace
): Promise<IHomeWork | null> => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  const res = await api.post(`/auth/me/homeworks`, {
    workspaceId: workspace.id,
  });

  if (res.status !== 200) {
    return null;
  }

  return res.data;
};

const createWorkspace = async (
  name: string,
  description: string,
  image: File
) => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  // Upload the image
  const formData = new FormData();
  formData.append("image", image);
  const res = await api.post("/screenshots", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (res.status !== 200) {
    return null;
  }
  const filename = res.data.filename;

  // Create the workspace
  const workspaceRes = await api.post("/auth/me/workspaces", {
    name,
    description,
    image: filename,
  });

  if (workspaceRes.status !== 200) {
    return null;
  }

  return workspaceRes.data;
};

const updateWorkspace = async (
  workspace: IWorkspace,
  name: string,
  description: string,
  image: File | undefined
) => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  // Upload the image
  let filename = workspace.image;
  if (image) {
    const formData = new FormData();
    formData.append("image", image);
    const res = await api.post("/screenshots", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status !== 200) {
      return null;
    }
    filename = res.data.filename;
  }

  // Update the workspace
  const workspaceRes = await api.put(`/auth/me/workspaces`, {
    id: workspace.id,
    name,
    description,
    image: filename,
  });

  if (workspaceRes.status !== 200) {
    return null;
  }

  return workspaceRes.data;
};

const deleteWorkspace = async (id: string) => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  const res = await api.delete(`/auth/me/workspaces`, {
    data: { id },
  });

  if (res.status !== 200) {
    return false;
  }

  return true;
};

const deleteHomework = async (id: string) => {
  api.defaults.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  const res = await api.delete(`/auth/me/homework`, {
    data: { id },
  });

  if (res.status !== 200) {
    return false;
  }

  return true;
};

export {
  auth,
  me,
  update,
  getWorkspace,
  getHomework,
  createHomeworkSession,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  deleteHomework,
};
