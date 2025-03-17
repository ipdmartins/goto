import React from "react";
import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/themeContext";
import { store, persistor } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
