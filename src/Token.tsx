
export async function getTDXToken() {
    const res = await fetch("https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: "B11217046-c2e5c340-000d-4024",
            client_secret: "9fc0f629-69c4-46ea-818c-a8e7a963099a",
        }),
    });
    const data = await res.json();
    return data.access_token;
}