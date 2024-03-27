import { Routes, Route, Navigate } from "react-router-dom";
import { useGetUserQuery } from "./store/services/user";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";
const Home = lazy(() => import("./pages/home/index"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const Profile = lazy(() => import("./pages/user/profile/index"));
const Following = lazy(() => import("./pages/user/profile/pages/following"));
const Followers = lazy(() => import("./pages/user/profile/pages/followers"));
function App() {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useGetUserQuery({ username: "profile" });
  if (isLoading) return <Loader />;
  if (isError) {
    console.log("log error from home", error);
  }
  return (
    <>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={userData ? <Navigate to={`/feed`} /> : <Home />}
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/auth/">
            <Route
              path="register"
              element={!userData ? <Register /> : <Navigate to="/feed" />}
            />
            <Route
              path="login"
              element={!userData ? <Login /> : <Navigate to={`/feed`} />}
            />
          </Route>
          <Route path="/user/">
            <Route path=":username" element={<Profile />} />
            <Route path=":username/following" element={<Following />} />
            <Route path=":username/followers" element={<Followers />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
