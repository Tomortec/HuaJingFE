
import React from "react";
import { createRoot } from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { App } from './App';
import './App.scss';

import { MainPage } from './pages/main';
import { UserPage, loader as userLoader } from './pages/user';
import { PorcelainPage, loader as porcelainLoader } from './pages/porcelain';
import { ModelPage, loader as modelLoader } from './pages/model';
import { LoginPage } from './pages/login';
import { InstructionsPage } from './pages/instructions';
import { IntroductionPage, INTRODUCTION_PAGE_PATHS } from './pages/introduction';

const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

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
                element: <UserPage />,
                loader: userLoader
            },
            {
                path: "/porcelain/:porcelainId",
                element: <PorcelainPage />,
                loader: porcelainLoader
            },
            {
                path: "/model/:modelId",
                element: <ModelPage />,
                loader: modelLoader
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
            INTRODUCTION_PAGE_PATHS.map((pathName) => ({
                path: pathName,
                element: <IntroductionPage />
            }))
        )
    }
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);