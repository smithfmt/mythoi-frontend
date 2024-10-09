"use client"

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

// Validation schema
const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters"),
});

const SignupForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/signup", data);
      console.log(response)
      alert("Signup successful");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        alert("Error: " + (error.response?.data?.message || "Something went wrong"));
      } else if (error instanceof Error) {
        // Generic Error handling
        alert("Error: " + error.message);
      } else {
        // Fallback for unexpected error types
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 relative z-50 bg-black">
      <input
        {...register("name")}
        type="text"
        placeholder="Name"
        className="border p-2"
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        className="border p-2"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="border p-2"
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2">
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
