import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import backg from "../../assets/wallpaper.jpg";
import { useForm } from "react-hook-form";
import z, { set } from "zod";
import { zodResolver } from "./../../../node_modules/@hookform/resolvers/zod/src/zod";
import { loginUser } from "../../services/authservice";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

export default function Login() {
  const [isloading, setisloading] = useState(false);

  let { userLogin, setuserLogin } = useContext(UserContext);

  const navigate = useNavigate();

  const schema = z.object({
    email: z.email("invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "password is at least 8 chars with at least 1 uppercase letter and 1 lowercase letter and a number and 1 special chars {#?!@$%^&*-}",
      ),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, formState } = form;

  async function handlelogin(data) {
    setisloading(true);

    try {
      const res = await loginUser(data);

      localStorage.setItem(
        "role",
        JSON.stringify({
          role: res.role,
        }),
      );

      localStorage.setItem(
        "auth",
        JSON.stringify({
          role: res.role,
          token: res.token,
        }),
      );

      localStorage.setItem(
        "token",
        JSON.stringify({
          token: res.token,
        }),
      );

      setuserLogin({
        token: res.token,
        role: res.role,
      });

      if (res.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/member"); // MEMBER
      }

      setisloading(false);
      console.log(res);

      alert("Login success");
    } catch (err) {
      setisloading(false);
      alert(err.message);
    }
  }

  // async function handlelogin(data) {
  //   setisloading(true);

  //   try {
  //     const res = await axios.post(
  //       "http://localhost:8080/api/auth/login",
  //       data
  //     );

  //     console.log(res.data);

  //     localStorage.setItem(
  //       "role",
  //       JSON.stringify({
  //         role: res.data.role,
  //       })
  //     );

  //     localStorage.setItem(
  //       "token",
  //       JSON.stringify({
  //         token: res.data.token,
  //       })
  //     );

  //     setuserLogin({
  //       token: res.data.token,
  //     });

  //     if (res.data.role === "ADMIN") {
  //       navigate("/admin");
  //     } else {
  //       navigate("/member");
  //     }

  //     alert("Login success");
  //   } catch (err) {
  //     console.log(err);

  //     alert(
  //       err.response?.data?.message ||
  //       err.message ||
  //       "Login failed"
  //     );
  //   } finally {
  //     setisloading(false);
  //   }
  // }

  return (
    <div
      className="h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backg})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-white flex items-center justify-center h-full">
        <form
          onSubmit={handleSubmit(handlelogin)}
          className="flex w-full max-w-80 flex-col gap-4 bg-white/10 p-6 rounded-xl backdrop-blur"
        >
          <h2 className="text-xl font-bold text-center">Login</h2>

          <Input {...register("email")} placeholder="Enter email" />
          {formState.errors.email && (
            <p className="text-red-500 text-sm">
              {formState.errors.email.message}
            </p>
          )}

          <Input {...register("password")} placeholder="Enter password" />
          {formState.errors.password && (
            <p className="text-red-500 text-sm">
              {formState.errors.password.message}
            </p>
          )}

          <Button
            disabled={isloading}
            className="hover:bg-yellow-300"
            type="submit"
          >
            {isloading ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
