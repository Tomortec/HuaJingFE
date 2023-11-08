
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import log from "loglevel";
globalThis.log = log;

import { App } from './App';
import './App.scss';

import MainPage from "./pages/main";
import LoginPage from "./pages/login";
// import InstructionsPage from "./pages/instructions";
// import IntroductionPage from "./pages/introduction";
// import ModelPage from "./pages/model";
// import PorcelainPage from "./pages/porcelain";
// import UserPage from "./pages/user";
import { introductionPagePaths } from "./pages/introduction/index";
import { ProtectedRoute, LoadingPage } from "./components";

// const LoginPage =        lazy(() => import(/* webpackChunkName: "LoginPage" */ "./pages/login/index"));
const InstructionsPage = lazy(() => import(/* webpackChunkName: "InstructionsPage" */ "./pages/instructions/index"));
const IntroductionPage = lazy(() => import(/* webpackChunkName: "IntroductionPage" */ "./pages/introduction/index"));
const ModelPage =        lazy(() => import(/* webpackChunkName: "ModelPage" */ "./pages/model/index"));
const PorcelainPage =    lazy(() => import(/* webpackChunkName: "PorcelainPage" */ "./pages/porcelain/index"));
const UserPage =         lazy(() => import(/* webpackChunkName: "UserPage" */ "./pages/user/index"));

const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

const queryClient = new QueryClient();

const root = createRoot(rootElement as HTMLElement);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <MainPage />
            },
            {
                path: "/user",
                element: <ProtectedRoute><UserPage /></ProtectedRoute>
            },
            {
                path: "/porcelain/:porcelainId",
                element: <ProtectedRoute><PorcelainPage /></ProtectedRoute>
            },
            {
                path: "/model/:modelId",
                element: <ProtectedRoute><ModelPage /></ProtectedRoute>
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/instructions",
                element: <ProtectedRoute><InstructionsPage /></ProtectedRoute>
            }
        ].concat(
            introductionPagePaths.map((pathName) => ({
                path: pathName,
                element: <ProtectedRoute><IntroductionPage /></ProtectedRoute>
            }))
        )
    }
]);

root.render(
    // <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    // </React.StrictMode>
);