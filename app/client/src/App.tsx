import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profile from "./pages/user/Profile";
import { useGetProfileQuery } from "./store/services/user";
function App() {
  // const navigate = useNavigate();
  const { data: user, isLoading, isError, error } = useGetProfileQuery({});
  if (isLoading) return <div>Loading..</div>;
  if (isError) return <div>Error</div>;
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/">
          <Route
            path="register"
            element={!user ? <Register /> : <Navigate to="/user/profile" />}
          />
          <Route
            path="login"
            element={!user ? <Login /> : <Navigate to="/user/profile" />}
          />
        </Route>
        <Route path="/user/">
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
