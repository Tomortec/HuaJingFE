
import React from "react";
import { createRoot } from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from './App';
import './App.scss';

import {
    InstructionsPage,
    IntroductionPage, introductionPagePaths,
    LoginPage,
    MainPage,
    ModelPage,
    PorcelainPage,
    UserPage
} from "./pages";

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
            <RouterProvider router={router} />
        </QueryClientProvider>
    // </React.StrictMode>
);