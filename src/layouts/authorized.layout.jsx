import { Outlet, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function AuthorizedLayout() {
  const { user, isLoaded } = useUser();

  // Show loading while checking authorization
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Redirect if user is not admin
  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}