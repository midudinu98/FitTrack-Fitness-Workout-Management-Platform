import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("access_token");

        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        API.get("/users/me", {
            headers: {
                Authorization: `Bearer ${storedToken}`,
            },
        })
            .then(() => {
                setToken(storedToken);
                setIsAuthenticated(true);
            })
            .catch(() => {
                localStorage.removeItem("access_token");
                setToken(null);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const login = (accessToken) => {
        localStorage.setItem("access_token", accessToken);
        setToken(accessToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated, isLoading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);