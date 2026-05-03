import React from 'react'
import logo from "../../assets/gymlogo.png"
export default function Footer() {
  return (
    <>
    <div className="container w-full p-5 text-center pb-0  bg-[#1C1C1C] flex flex-col md:flex-row items-center justify-between">
     <div className="w-1/3">
       <img src={logo} alt="Logo" className="w-30 h-30 ps-3" />
     </div>
     <div className="w-1/3 text-white pt-3">
     <i className="fa-regular fa-copyright"></i> 2024 Gold's Gym. All rights reserved.
     </div>
      <div  className="w-1/3 text-white pt-3 text-3xl">
      <i className="fa-brands fa-facebook"></i>
      <i className="fa-brands fa-twitter"></i>
      <i className="fa-brands fa-instagram"></i>
      </div>


     </div>
    </>
  )
}
