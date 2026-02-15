import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import {
    apiLogin,
    apiSignup,
    apiGetMe,
    apiOAuthCallback,
    type UserData,
} from "@/lib/api";

interface AuthContextType {
    user: UserData | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    handleOAuthCallback: (
        provider: "google" | "facebook",
        code: string
    ) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("token")
    );
    const [isLoading, setIsLoading] = useState(true);

    // Persist token
    const saveToken = useCallback((newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }, []);

    // On mount — try to restore session from stored token
    useEffect(() => {
        const restoreSession = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const userData = await apiGetMe();
                setUser(userData);
            } catch {
                // Token expired or invalid
                localStorage.removeItem("token");
                setToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        restoreSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, password: string) => {
        const res = await apiLogin(email, password);
        saveToken(res.access_token);
        setUser(res.user);
    };

    const signup = async (email: string, password: string) => {
        const res = await apiSignup(email, password);
        saveToken(res.access_token);
        setUser(res.user);
    };

    const handleOAuthCallback = async (
        provider: "google" | "facebook",
        code: string
    ) => {
        const res = await apiOAuthCallback(provider, code);
        saveToken(res.access_token);
        setUser(res.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("condition");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                signup,
                handleOAuthCallback,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
