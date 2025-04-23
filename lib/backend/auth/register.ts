import api from "../api/axiosConfig";

interface RegisterUser {
    email: string;
    password: string;
    name: string;
    passwordConfirm: string;
    acceptTerms: boolean;
}

export const Register = async (user: RegisterUser) => {
    if (user.password !== user.passwordConfirm) {
        throw new Error("Passwords do not match");
    }
    const response = await api.post(`/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: user.email,
            password: user.password,
            name: user.name,
        }),
    });
    return response.data
};