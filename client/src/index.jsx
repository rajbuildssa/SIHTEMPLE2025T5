import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ClerkProvider } from '@clerk/clerk-react';
import "./styles/tailwind.css";
import "./styles/index.css";

// Clerk publishable key from Vite env
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>
);
