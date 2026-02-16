const API_BASE = "/api/v1";

// ─── Helpers ─────────────────────────────────────────────────
function getToken(): string | null {
    return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
    }

    return res.json();
}

// ─── Auth API ────────────────────────────────────────────────
export interface UserData {
    id: number;
    email: string;
    full_name: string | null;
    preferences: string | null;
    struggle_areas: string | null;
    granularity_level: number;
    auth_provider: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    user: UserData;
}

export async function apiLogin(
    email: string,
    password: string
): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function apiSignup(
    email: string,
    password: string,
    fullName?: string
): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, full_name: fullName }),
    });
}

export async function apiGetMe(): Promise<UserData> {
    return request<UserData>("/auth/me");
}

/** Exchange an OAuth code for a JWT via the backend */
export async function apiVerifyGoogleToken(
    accessToken: string
): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/google/verify-token", {
        method: "POST",
        body: JSON.stringify({ access_token: accessToken }),
    });
}


/** Get the OAuth login redirect URL */
/** Get the OAuth login redirect URL for Implicit Flow */
export function getOAuthLoginUrl(provider: "google"): string {
    // We construct the URL on the client to avoid backend dependency calls for simple redirects
    if (provider === "google") {
        // Ideally we should use the VITE_ env var.
        // For now, let's assume we use the VITE_GOOGLE_CLIENT_ID
        const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

        const options = {
            redirect_uri: `${window.location.origin}/auth/callback`,
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
            access_type: "online",
            response_type: "token",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ].join(" "),
            state: "google",
        };
        const qs = new URLSearchParams(options).toString();
        return `${rootUrl}?${qs}`;
    }
    return "";
}


// ─── Tasks API ───────────────────────────────────────────────
export interface SidebarTask {
    id: number;
    title: string;
}

export async function apiGetUserTasks(userId: number): Promise<SidebarTask[]> {
    return request<SidebarTask[]>(`/tasks/user/${userId}`);
}

export async function apiDecomposeStream(
    instruction: string,
    userId: number
): Promise<Response> {
    const res = await fetch(
        `${API_BASE}/tasks/decompose/stream?user_id=${userId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify({ instruction }),
        }
    );
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Stream request failed");
    }
    return res;
}

export interface TaskStep {
    id: number;
    action: string;
    is_completed: boolean;
    order: number;
}

export interface TaskDetails {
    id: number;
    title: string;
    goal: string;
    steps: TaskStep[];
}

export async function apiGetTaskDetails(taskId: number): Promise<TaskDetails> {
    return request<TaskDetails>(`/tasks/${taskId}`);
}

export async function apiUpdateProfile(userId: number, data: { full_name?: string }): Promise<UserData> {
    return request<UserData>(`/users/profile/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function apiDeleteTask(taskId: number): Promise<void> {
    await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
    });
}

export async function apiUpdateStepStatus(stepId: number, isCompleted: boolean): Promise<void> {
    await request<void>(`/tasks/microwins/${stepId}?is_completed=${isCompleted}`, {
        method: "PATCH",
    });
}
