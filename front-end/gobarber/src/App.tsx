import GlobalStyles from "./styles/global";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { AppProvider } from "./hook";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <AppProvider>
        <Router />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
