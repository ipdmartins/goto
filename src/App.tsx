import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/themeContext";
import Contributors from "./pages/contributors";
import Home from "./pages/home";
import "./App.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/contributors",
      element: <Contributors />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  const { theme } = useContext(ThemeContext);

  const appStyle = {
    backgroundColor: theme === "light" ? "#ffffff" : "#333333",
    color: theme === "light" ? "#000000" : "#ffffff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column" as "column",
  };
  
  return (
    <div style={appStyle}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
