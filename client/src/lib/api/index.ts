// @ts-expect-error Because we are using js-cookie
import Cookies from "js-cookie";
import { IWorkspace, User } from "../hooks/useAuth";
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

export { auth, me, update, getWorkspace };
