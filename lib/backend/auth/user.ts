export const getUser = async (uuid: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user/${uuid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const user = await response.json();
    return user.user;
}