import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

export default function AuthCallback() {
    const navigate = useNavigate();

    const { handleOAuthCallback } = useAuth();
    const [error, setError] = useState("");

    useEffect(() => {
        // Parse hash: #access_token=...&token_type=Bearer&expires_in=...
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");

        if (!accessToken) {
            setError("No access token found");
            setTimeout(() => navigate("/login"), 2000);
            return;
        }

        handleOAuthCallback(accessToken)
            .then(() => navigate("/dashboard", { replace: true }))
            .catch((err) => {
                setError(err.message || "Authentication failed");
                setTimeout(() => navigate("/login"), 3000);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center animate-fade-in">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-7 h-7 text-primary" />
                </div>
                {error ? (
                    <>
                        <h2 className="text-xl font-bold text-destructive mb-2">
                            Authentication Failed
                        </h2>
                        <p className="text-muted-foreground text-sm">{error}</p>
                        <p className="text-muted-foreground/60 text-xs mt-2">
                            Redirecting to login...
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-foreground mb-2">
                            Completing sign in...
                        </h2>
                        <div className="flex justify-center gap-1 mt-4">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <span
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: "0.15s" }}
                            />
                            <span
                                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                                style={{ animationDelay: "0.3s" }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
