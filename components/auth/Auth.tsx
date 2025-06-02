"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { headerConfigKeyName } from "@/services/app.config";

export const Auth = () => {
  return function AuthWrapper(WrappedComponent: any) {
    return function WrappedWithAuth(props: any) {
      const router = useRouter();
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const accessToken = localStorage.getItem(headerConfigKeyName);
        if (!accessToken) {
          router.push("/auth/login");
        } else {
          setLoading(false); // Allow rendering only after checking token
        }
      }, []);

      if (loading) {
        return null; // Or return a loading spinner
      }

      return <WrappedComponent {...props} />;
    };
  };
};
