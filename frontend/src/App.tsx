import "./assets/App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Books from "./pages/SearchBooks";
import Legal from "./pages/Legal";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profil from "./pages/Profil";
import BookPage from "./pages/BookPage";
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
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/legal" element={<Legal />} />
                        <Route path="/livres" element={<Books />} />
                        <Route path="/livres/:slug" element={<BookPage />} />
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
