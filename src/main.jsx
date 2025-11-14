import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter,Routes,Route } from "react-router";
import HomePage from "./pages/home/home.page.jsx";
import DashboardPage from "./pages/dashboard/dashboard.page.jsx";
import RootLayout from "./layouts/root.layout.jsx";
import { store } from './lib/redux/store'
import { Provider } from 'react-redux'
import MainLayout from "./layouts/main.layout.jsx";
import DashboardLayout from "./layouts/dashboard.layout.jsx";
import { ClerkProvider } from '@clerk/react-router'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Routes>
          <Route element={<RootLayout />}>
            {/* meka danne layout file eka hadanawa nam pamanai */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </ClerkProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
