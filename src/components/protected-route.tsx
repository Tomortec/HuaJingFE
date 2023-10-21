
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = (props: { children: React.ReactElement }) => {
    const { user } = useAuth();
    return (
        <>
            {
                user ? props.children :
                <Navigate to={"/login"} replace />
            }
        </>
    )
};