import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
