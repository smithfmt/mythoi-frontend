"use client"
import AuthForm from "@components/forms/AuthForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/profile");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex gap-16">
            <AuthForm signup={true} onSuccess={handleSuccess} />
            <AuthForm signup={false} onSuccess={handleSuccess} />
          </div>
      </main>
    </div>
  );
}
  