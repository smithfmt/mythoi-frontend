"use client"

import { useRef } from "react";

const RegisterForm = () => {

    const emailRef = useRef(null);
    const nameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <form className="flex flex-col gap-2 relative z-50 bg-slate-600 bg-opacity-90 p-16 rounded-xl text-slate-50 [&>input]:text-slate-900" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input ref={emailRef} type="email" />
            <label htmlFor="name">Name</label>
            <input ref={nameRef} type="email" />
            <label htmlFor="password">Password</label>
            <input ref={passwordRef} type="password" />
            <label htmlFor="password-confirmation">Confirm Password</label>
            <input ref={confirmPasswordRef} type="password" />
        </form>
    )
};

export default RegisterForm;