import "./assets/styles/App.css";
import "./assets/styles/globals.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import AdPage from "./pages/Ad";
import CategoryPage from "./pages/Category";
import AdFormPage from "./pages/AdForm";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import Profil from "./pages/Profil";
import AuthChecker from "./AuthChecker";
import { AuthState } from "./AuthChecker";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
    uri: "/api",
    cache: new InMemoryCache(),
    credentials: "same-origin",
});

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="ads/:id" element={<AdPage />} />
                        <Route
                            path="categories/:id"
                            element={<CategoryPage />}
                        />
                        <Route
                            path="/ads/:id/edit"
                            element={
                                <AuthChecker
                                    authState={[
                                        AuthState.user,
                                        AuthState.admin,
                                    ]}
                                    redirectTo="/signin"
                                >
                                    <AdFormPage />
                                </AuthChecker>
                            }
                        />
                        <Route
                            path="ads/newAd"
                            element={
                                <AuthChecker
                                    authState={[
                                        AuthState.user,
                                        AuthState.admin,
                                    ]}
                                    redirectTo="/signin"
                                >
                                    <AdFormPage />
                                </AuthChecker>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <AuthChecker
                                    authState={[AuthState.unauthenticated]}
                                    redirectTo="/"
                                >
                                    <SignUp />
                                </AuthChecker>
                            }
                        />
                        <Route
                            path="/signin"
                            element={
                                <AuthChecker
                                    authState={[AuthState.unauthenticated]}
                                    redirectTo="/"
                                >
                                    <SignIn />
                                </AuthChecker>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <AuthChecker
                                    authState={[AuthState.admin]}
                                    redirectTo="/"
                                >
                                    <Admin />
                                </AuthChecker>
                            }
                        />
                        <Route
                            path="/profil"
                            element={
                                <AuthChecker
                                    authState={[AuthState.user]}
                                    redirectTo="/"
                                >
                                    <Profil />
                                </AuthChecker>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
