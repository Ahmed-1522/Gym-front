import React, { useContext } from "react";
import logo from "../../assets/gymlogo.png"
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Navbar() {

  let { userLogin,setuserLogin }=useContext(UserContext)
  
  return <>
  <nav className="bg-[#1C1C1C] max-w-screen relative flex items-center justify-between">
     <div className="flex justify-between items-center w-full">
      <Link
            to=""
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-yellow-400 flex items-center">
              <img src={logo} alt="Logo" className="w-20 h-20 ps-3" />
              <h1>GOLD'S GYM</h1>
            </span>
          </Link>

          <div className="pe-20">
                  <ul className="flex gap-3.5 text-white ps-6">
                   {userLogin !==null ? <>
                   <li>
                      <Link to="logout">
                        logout{" "}
                        <i className="fa-solid fa-arrow-right-to-bracket "></i>
                      </Link>
                    </li>
                   </>:<>
                   <li>
                      <Link to="login">
                        login{" "}
                        <i className="fa-solid fa-arrow-right-to-bracket "></i>
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="register">
                        Register <i className="fa-solid fa-user-plus"></i>
                      </Link>
                    </li>
                  </>}
                  </ul>
                </div>
     </div>

  

  </nav>
 </>
}
