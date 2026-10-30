import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import TokenExpirationHandler from './TokenExpirationHandler'

function App() {
  return (
    <BrowserRouter>
      <TokenExpirationHandler />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;