import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorContext } from "@/lib/contexts/error.context";
import { SuccessContext } from "@/lib/contexts/success.context";
import { hankoApi } from "@/lib/hanko";
import { useAuth, User } from "@/lib/hooks/useAuth";
import { register } from "@teamhanko/hanko-elements";
import { LogOutIcon, SaveIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const router = useNavigate();
  const { user, signOut, fetchUserFromCookies, save, me } = useAuth();
  const [newUser, setNewUser] = useState<User | null>(null);

  const handleLogout = async () => {
    signOut();
    router("/auth");
  };

  const { setSuccessMessage } = useContext(SuccessContext);
  const { setErrorMessage } = useContext(ErrorContext);

  const handleSave = async () => {
    if (newUser) {
      const res = await save(newUser);
      if (res) {
        setSuccessMessage("User saved");
      } else {
        setErrorMessage("Failed to save user");
      }
    }
  };

  useEffect(() => {
    fetchUserFromCookies().then((res) => {
      if (!res) {
        router("/auth");
        return;
      }
      me().then((user) => {
        if (user) {
          setNewUser(user);
        }
      });
    });

    register(hankoApi).catch((error) => {
      console.error(error);
      // handle error
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-wrap justify-center items-center gap-4 border shadow rounded-lg p-3 dark:bg-gray-600">
          <h2 className="text-2xl font-bold pb-2">Account settings</h2>
          <div className="flex flex-col gap-2 w-full">
            <div>
              <Label>User name</Label>
              <Input
                type="text"
                value={newUser?.name}
                onChange={(e) => {
                  if (newUser) {
                    setNewUser({ ...newUser, name: e.target.value });
                  }
                }}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input disabled type="text" value={user?.email} />
            </div>
            <div className="flex justify-center items-center mt-4 gap-4">
              <Button
                className="flex flex-1 bg-red-500 hover:bg-red-600 max-sm:w-full justify-center items-center"
                onClick={handleLogout}
              >
                <LogOutIcon size={24} className="mr-2" />
                Logout
              </Button>
              <Button
                className="flex flex-1 max-sm:w-full justify-center items-center"
                onClick={handleSave}
              >
                <SaveIcon size={24} className="mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
