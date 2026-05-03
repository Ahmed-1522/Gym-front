import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import NotFound from './components/NotFound/NotFound'
import '@fortawesome/fontawesome-free/css/all.min.css'
import AdminHome from './components/Admin/AdminHome'
import MemberHome from './components/Member/MemberHome'
import ProtectedRoute from './ProtectedRoute'
import { MygetAuth } from './services/authservice'
import UserContextProvider from './context/UserContext'
import Logout from './logout/Logout'





const x = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/logout", element: <Logout /> },

      {
        path: "/admin",
        element: (
          <ProtectedRoute role="ADMIN">
            <AdminHome />
          </ProtectedRoute>
        ),
      },

      {
        path: "/member",
        element: (
          <ProtectedRoute role="MEMBER">
            <MemberHome />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
function App() {
  

  return (<>
   <>
   <UserContextProvider>
    <RouterProvider router={x}></RouterProvider>
   </UserContextProvider>
   </>
  </>
  )
}

export default App
