import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignupPage from "./pages/SignupPage"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Messages from "./pages/Messages"
import PageNotFound from "./pages/PageNotFound"
import RepoPage from "./pages/RepoPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:username" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/:username/:reponame" element={<RepoPage />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App
