import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignupPage from "./pages/SignupPage"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import PageNotFound from "./pages/PageNotFound"
import RepoPage from "./pages/RepoPage"
import LandingPage from "./pages/LandingPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/:username" element={<Home />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/:username/:reponame" element={<RepoPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default App
