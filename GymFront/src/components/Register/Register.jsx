import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import backg from "../../assets/wallpaper.jpg";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from './../../../node_modules/@hookform/resolvers/zod/src/zod';
import { registerUser } from './../../services/authservice';



export default function Register() {
const [isloading, setisloading] = useState(false)


  const schema = z
      .object({
        email: z.email("invalid email address"),
        password: z
          .string()
          .regex(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "password is at least 8 chars with at least 1 uppercase letter and 1 lowercase letter and a number and 1 special chars {#?!@$%^&*-}"
      )}) 

  const form =useForm({
    defaultValues:{
      email:"",
      password:"",
  },resolver:zodResolver(schema)
})

  let {register,handleSubmit,formState} = form

async function handleregister(data) {
  try {
    const res = await registerUser(data);

    console.log("Response:", res);

    // خزّن التوكن
    localStorage.setItem("token", res.token);

    alert("Registered successfully");
  } catch (err) {
    alert(err.message);
  }
}

  return (
    <div
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-white flex items-center justify-center h-full">
        <form
          onSubmit={handleSubmit(handleregister)}
          className="flex w-full max-w-80 flex-col gap-4 bg-white/10 p-6 rounded-xl backdrop-blur"
        >
          <h2 className="text-xl font-bold text-center">Register</h2>

          <Input   {...register("name")} placeholder="Enter name" />
            {formState.errors.name && (
          <p className="text-red-500 text-sm">{formState.errors.name.message}</p>
      )}
 

          <Input {...register("email")} placeholder="Enter email" />
 {formState.errors.email && (
          <p className="text-red-500 text-sm">{formState.errors.email.message}</p>
      )}

          <Input {...register("password")} placeholder="Enter password" />
          {formState.errors.password && (
          <p className="text-red-500 text-sm">{formState.errors.password.message}</p>
      )}

          <Input {...register("phone")} placeholder="Enter phone" />

           <Button disabled={isloading} className="hover:bg-yellow-300" type="submit">
              {isloading ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
            </Button>
        </form>
      </div>
    </div>
  );
}