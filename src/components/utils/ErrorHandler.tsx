"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ErrorHandler = ({ errors, deleteError }) => {
    const router = useRouter();
    useEffect(() => {
        errors.forEach((error, index) => {
            if (error.redirect) {
                router.push(error.redirect);
            } 
            const timer = setTimeout(() => {
                deleteError(index);
            }, 5000);
            return () => clearTimeout(timer);
            
        });
    }, [errors, deleteError,]);
    

    return (
        <div className="fixed top-16 left-16 flex flex-col w-64 gap-2 z-50">
            {errors.map((error, i) => (
                <div
                    key={`error-${i}`}
                    className={`${error.status===200?"bg-green-400":"bg-red-400"} text-neutral-50 rounded-lg border border-neutral-50 px-4 py-8 w-full flex justify-between items-center gap-4 animate-errorEnter`}
                >
                    <p>{`${error.status ? `${error.status} ${error.status===200?"":"ERROR"}: ` : ""}${error.message}`}</p>
                    <button
                        className="flex justify-center items-center rounded-full hover:text-neutral-300 transition-all mr-2 text-lg"
                        onClick={() => deleteError(i)}
                    >
                        x
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ErrorHandler;
