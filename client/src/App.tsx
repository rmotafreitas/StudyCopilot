import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { useMemo, useState } from "react";
import { MessageDialog } from "./components/message-dialog";
import { ThemeProvider } from "./components/theme-provider";
import { ErrorContext } from "./lib/contexts/error.context";
import { SuccessContext } from "./lib/contexts/success.context";
import { AuthProvider } from "./lib/hooks/useAuth";
import { HomePage } from "./pages";
import { LoginPage } from "./pages/Login";
import { MyAccountPage } from "./pages/me/account";
import { NotFoundPage } from "./pages/NotFound";
import { MyWorkspacesPage } from "./pages/me/workspaces";
import { MyWorkspacePage } from "./pages/me/workspace";
import { MyHomeworkPage } from "./pages/me/homework";
import { MyBoardSessionPage } from "./pages/me/board-session";

export type WorkspaceParams = {
  id: string;
};

export type HomeworkParams = {
  id: string;
};

export function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const errorMessageProvider = useMemo(
    () => ({ errorMessage, setErrorMessage }),
    [errorMessage, setErrorMessage]
  );

  const successMessageProvider = useMemo(
    () => ({ successMessage, setSuccessMessage }),
    [successMessage, setSuccessMessage]
  );

  return (
    <SuccessContext.Provider value={successMessageProvider}>
      <ErrorContext.Provider value={errorMessageProvider}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<LoginPage />} />
                <Route path="/me/account" element={<MyAccountPage />} />
                <Route path="/me/workspaces" element={<MyWorkspacesPage />} />
                <Route
                  path="/me/workspaces/:id"
                  element={<MyWorkspacePage />}
                />
                <Route
                  path="/me/workspaces/:id/board-session"
                  element={<MyBoardSessionPage />}
                />
                <Route path="/me/homeworks/:id" element={<MyHomeworkPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </AuthProvider>
        <MessageDialog />
      </ErrorContext.Provider>
    </SuccessContext.Provider>
  );
}
