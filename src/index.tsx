
import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from './App';
import './App.scss';

import {
    MainPage,
    introductionPagePaths

    // InstructionsPage,
    // IntroductionPage, introductionPagePaths,
    // LoginPage,
    // MainPage,
    // ModelPage,
    // PorcelainPage,
    // UserPage
} from "./pages";
import { LoadingPage } from "./components";
const LoginPage = lazy(() => import("./pages/login/index"));
const InstructionsPage = lazy(() => import("./pages/instructions/index"));
const IntroductionPage = lazy(() => import("./pages/introduction/index"));
const ModelPage = lazy(() => import("./pages/model/index"));
const PorcelainPage = lazy(() => import("./pages/porcelain/index"));
const UserPage = lazy(() => import("./pages/user/index"));

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
                element: <UserPage />
            },
            {
                path: "/porcelain/:porcelainId",
                element: <PorcelainPage />
            },
            {
                path: "/model/:modelId",
                element: <ModelPage />
            },
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/instructions",
                element: <InstructionsPage />
            }
        ].concat(
            introductionPagePaths.map((pathName) => ({
                path: pathName,
                element: <IntroductionPage />
            }))
        )
    }
]);

root.render(
    // <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LoadingPage />}>
                <RouterProvider router={router} />
            </Suspense>
        </QueryClientProvider>
    // </React.StrictMode>
);