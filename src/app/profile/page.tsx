"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string, name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/register"); 
        return;
      }

      try {
        const response = await axios.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user); 
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "An error occurred while fetching user data");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        router.push("/register"); 
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p className="text-red-500">User Not Found</p>;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="relative flex flex-col gap-16 z-50 bg-neutral-50 p-16">
              <h1>{`Welcome ${user.name}`}</h1>
              <div>
                <p>{user.email}</p>
              </div>
          </div>
      </main>
    </div>
  );
};

export default Profile;
