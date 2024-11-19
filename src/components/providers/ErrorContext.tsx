"use client";

import ErrorHandler from "@components/utils/ErrorHandler";
import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";

type Error = { message: string; status?: number, redirect?:string };

type ErrorContextType = {
  errors: Error[];
  addError: (error: Error) => void;
  deleteError: (index: number) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const errorsRef = useRef<Error[]>([]);
  const [, forceRender] = useState(false);
  const router = useRouter();

  const deleteError = useCallback((index: number) => {
    errorsRef.current = errorsRef.current.filter((_, i) => i !== index);
    forceRender((prev) => !prev);
  }, []);

  const addError = useCallback((error: Error) => {
    if (!errorsRef.current.some((e) => e.message === error.message)) {
      const index = errorsRef.current.length;
      errorsRef.current.push(error);
      forceRender((prev) => !prev);

      if (error.redirect) {
        setTimeout(() => {
          router.push(error.redirect as string); 
        }, 0);
      }

      setTimeout(() => {
        deleteError(index);
      }, 5000);
    }
  }, [deleteError, router]);

  return (
    <ErrorContext.Provider value={{ errors: errorsRef.current, addError, deleteError }}>
      {children}
      <ErrorHandler errors={errorsRef.current} deleteError={deleteError} />
    </ErrorContext.Provider>
  );
};

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorHandler must be used within an ErrorProvider");
  }
  return context;
};
