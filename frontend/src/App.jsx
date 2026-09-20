import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import PasteView from "./pages/PasteView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:pasteId" element={<PasteView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;