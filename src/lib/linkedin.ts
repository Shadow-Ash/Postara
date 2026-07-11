const LINKEDIN_AUTH_URL =
    "https://www.linkedin.com/oauth/v2/authorization";

export function createLinkedInAuthUrl(
    state: string,
) {
    const params = new URLSearchParams({
        response_type: "code",

        client_id: process.env.LINKEDIN_CLIENT_ID!,

        redirect_uri:
            process.env.LINKEDIN_REDIRECT_URI!,

        state,

        scope:
            "openid profile email w_member_social",
    });

    return `${LINKEDIN_AUTH_URL}?${params}`;
}

const LINKEDIN_TOKEN_URL =
    "https://www.linkedin.com/oauth/v2/accessToken";

const LINKEDIN_USERINFO_URL =
    "https://api.linkedin.com/v2/userinfo";

export async function exchangeCodeForAccessToken(
    code: string,
) {
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret:
            process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri:
            process.env.LINKEDIN_REDIRECT_URI!,
    });

    const response = await fetch(
        LINKEDIN_TOKEN_URL,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
            body,
        },
    );

    if (!response.ok) {
        throw new Error(
            await response.text(),
        );
    }

    return response.json();
}

export async function getLinkedInUser(
    accessToken: string,
) {
    const response = await fetch(
        LINKEDIN_USERINFO_URL,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        },
    );

    if (!response.ok) {
        throw new Error(
            await response.text(),
        );
    }

    return response.json();
}