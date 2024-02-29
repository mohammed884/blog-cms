import { Routes, Route, Navigate } from "react-router-dom";
import { useGetProfileQuery } from "./store/services/user";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
const Home = lazy(() => import("./pages/home/index"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const Profile = lazy(() => import("./pages/user/profile/index"));
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";
function App() {
  const { data: userData, isLoading, isError, error } = useGetProfileQuery({});
  if (isLoading) return <Loader />;
  if (isError) {
    console.log("log error from home", error);
  }
  console.log("user data ->", userData);

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
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
