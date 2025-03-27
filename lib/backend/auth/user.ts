import axios from "axios";

export const getUser = async (uuid: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("No access token found");
    }
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL_PROTECTED}/auth/user/${uuid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const user = response.data.user;
    return user;
}