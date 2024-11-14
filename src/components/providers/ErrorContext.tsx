"use client";

import ErrorHandler from "@components/utils/ErrorHandler";
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
  const [, forceRender] = useState(false); // Dummy state to force re-renders

  const addError = useCallback((error: Error) => {
    if (!errorsRef.current.some((e) => e.message === error.message)) {
      errorsRef.current.push(error);
      forceRender((prev) => !prev); // Trigger a re-render
    }
  }, []);

  const deleteError = useCallback((index: number) => {
    errorsRef.current = errorsRef.current.filter((_, i) => i !== index);
    forceRender((prev) => !prev); // Trigger a re-render
  }, []);

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
