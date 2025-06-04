import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import WaitingConfirmationPopUp from "./components/PopUp/WaitingConfirmationPopUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/teste" element={<WaitingConfirmationPopUp/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
