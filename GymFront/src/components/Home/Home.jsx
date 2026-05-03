import React from 'react'
import { Button } from "@/components/ui/button"
import backg from "../../assets/wallpaper.jpg"
export default function Home() {
  return (

    <>
    <div className="h-screen bg-cover bg-center relative" style={{ backgroundImage: `url(${backg})` }}>
  
  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative z-10 text-white">
  
  </div>

</div>
    </>
  )
}
