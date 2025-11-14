import { Outlet, Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedLayout() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Show loading spinner while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if user is not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // User is authenticated, render the protected content
  return <Outlet />;
}