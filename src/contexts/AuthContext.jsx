import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import api from "../api/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "khanmoves_token";

const setAuthorizationHeader = token => {
    if (token) {
        api.defaults.headers.common.Authorization =
            `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const saveSession = useCallback(
        (token, authenticatedUser) => {
            localStorage.setItem(
                TOKEN_KEY,
                token
            );

            setAuthorizationHeader(token);
            setUser(authenticatedUser);
        },
        []
    );

    const logout = useCallback(() => {
        localStorage.removeItem(
            TOKEN_KEY
        );

        setAuthorizationHeader(null);
        setUser(null);
    }, []);

    useEffect(() => {
        const restoreSession = async () => {
            const token =
                localStorage.getItem(
                    TOKEN_KEY
                );

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setAuthorizationHeader(token);

                const response =
                    await api.get(
                        "/auth/me"
                    );

                setUser(
                    response.data?.user ||
                    null
                );
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, [logout]);

    const login = async credentials => {
        const response = await api.post(
            "/auth/login",
            credentials
        );

        const token =
            response.data?.token;

        const authenticatedUser =
            response.data?.user;

        if (
            !token ||
            !authenticatedUser
        ) {
            throw new Error(
                "Invalid login response."
            );
        }

        saveSession(
            token,
            authenticatedUser
        );

        return authenticatedUser;
    };

    const signup = async formData => {
        const response = await api.post(
            "/auth/signup",
            formData
        );

        const token =
            response.data?.token;

        const authenticatedUser =
            response.data?.user;

        if (
            !token ||
            !authenticatedUser
        ) {
            throw new Error(
                "Invalid signup response."
            );
        }

        saveSession(
            token,
            authenticatedUser
        );

        return authenticatedUser;
    };

    const forgotPassword =
        async email => {
            const response =
                await api.post(
                    "/auth/forgot-password",
                    { email }
                );

            return (
                response.data?.message ||
                "A new password has been sent."
            );
        };

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated:
                Boolean(user),
            isAdmin:
                user?.role === "admin",
            login,
            signup,
            forgotPassword,
            logout
        }),
        [
            user,
            loading,
            logout
        ]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
};