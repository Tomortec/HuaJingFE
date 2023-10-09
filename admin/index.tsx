
import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

const root = createRoot(rootElement as HTMLElement);

root.render(
    <App />
);