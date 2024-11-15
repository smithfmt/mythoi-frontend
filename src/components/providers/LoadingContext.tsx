"use client"
import LoadingIndicator from '@components/utils/LoadingIndicator';
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = useCallback(() => {
    setIsLoading(true);
  },[]);
  const stopLoading = useCallback(() => {
    setIsLoading(false);
  },[]);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      <LoadingIndicator />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
