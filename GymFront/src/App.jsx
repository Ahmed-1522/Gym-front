import Subscription from './components/Subscription';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NotFound from './components/NotFound/NotFound';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminHome from './components/Admin/AdminHome';
import MemberHome from './components/Member/MemberHome';
import UserContextProvider from './context/UserContext';
import Logout from './logout/Logout';

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/logout", element: <Logout /> },
      { path: "/subscription", element: <Subscription /> },

      // 👇 الميمبر من غير حماية مؤقتًا
      { path: "/member", element: <MemberHome /> },

      // 👇 الادمن (ممكن تسيبيه أو تشيليه لو مش محتاجاه دلوقتي)
      { path: "/admin", element: <AdminHome /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}

export default App;