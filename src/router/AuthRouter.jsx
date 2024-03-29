import { Routes, Route } from "react-router-dom"

import Auth from "../layout/Auth.jsx"

import LandingPage from "../screens/LandingPage.jsx"
import LogIn from "../screens/LogIn.jsx"
import SignIn from "../screens/SignIn.jsx"

export default function SystemRouter() {
  return (
    <Routes>
      <Route path="/" element={<Auth />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LogIn />} />
        <Route path="signin" element={<SignIn />} />
      </Route>
    </Routes>
  )
}
