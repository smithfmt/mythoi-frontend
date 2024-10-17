"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useState } from "react";

// Validation schema for signup
const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

// Validation schema for login
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

// Define the shape of the form data
type FormData = {
  name?: string;
  email: string;
  password: string;
};

interface AuthFormProps {
  signup: boolean;
  onSuccess: () => void;
}

const AuthForm = ({ signup, onSuccess }: AuthFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(signup ? signupSchema : loginSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const url = signup ? "/api/users/signup" : "/api/users/login";
      const response = await axios.post(url, data);
      const { token } = response.data;

      // Store the token in local storage
      localStorage.setItem("token", token);
      onSuccess(); // Call the onSuccess callback
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert("Error: " + (error.response?.data?.message || "Something went wrong"));
      } else if (error instanceof Error) {
        alert("Error: " + error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 relative z-50 bg-black">
      {signup && (
        <>
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            className="border p-2"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </>
      )}

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

      <button type="submit" className="bg-blue-500 text-white p-2" disabled={loading}>
        {loading ? "Loading..." : signup ? "Sign Up" : "Log In"}
      </button>
    </form>
  );
};

export default AuthForm;
