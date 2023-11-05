
import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { LoadingPage } from "./loading-page";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = (props: { children: React.ReactElement }) => {
    const { user } = useAuth();
    return (
        <>
            <Suspense fallback={<LoadingPage />}>
                {
                    user ? props.children :
                    <Navigate to={"/login"} replace />
                }
            </Suspense>
        </>
    )
};