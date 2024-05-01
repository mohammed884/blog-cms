import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";
import { getUserQuery } from "./services/queries/user";
const Home = lazy(() => import("./pages/home/index"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const Profile = lazy(() => import("./pages/user/profile/index"));
const Following = lazy(() => import("./pages/user/profile/pages/Following"));
const Followers = lazy(() => import("./pages/user/profile/pages/Followers"));
function App() {
  const user = getUserQuery("profile");
  if (user.isLoading) return <Loader />;
  if (user.isError) {
    console.log(user.error);
  }
  return (
    <>
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              user.data?.isLoggedIn ? <Navigate to={`/feed`} /> : <Home />
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/auth/">
            <Route
              path="register"
              element={!user.data ? <Register /> : <Navigate to="/feed" />}
            />
            <Route
              path="login"
              element={
                !user.data?.isLoggedIn ? <Login /> : <Navigate to={`/feed`} />
              }
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
