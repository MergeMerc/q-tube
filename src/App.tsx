import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./styles/theme";
import { store } from "./state/store";
import { Provider } from "react-redux";
import GlobalWrapper from "./wrappers/GlobalWrapper";
import Notification from "./components/common/Notification/Notification";
import { Home } from "./pages/Home/Home";
import { VideoContent } from "./pages/VideoContent/VideoContent";
import DownloadWrapper from "./wrappers/DownloadWrapper";
import { IndividualProfile } from "./pages/IndividualProfile/IndividualProfile";
import { PlaylistContent } from "./pages/PlaylistContent/PlaylistContent";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

function App() {
  // const themeColor = window._qdnTheme

  const [theme, setTheme] = useState("dark");
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <Notification />
          <DownloadWrapper>
            <GlobalWrapper setTheme={(val: string) => setTheme(val)}>
              <CssBaseline />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video/:name/:id" element={<VideoContent />} />
                <Route
                  path="/playlist/:name/:id"
                  element={<PlaylistContent />}
                />
                <Route path="/channel/:name" element={<IndividualProfile />} />
              </Routes>
            </GlobalWrapper>
          </DownloadWrapper>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
