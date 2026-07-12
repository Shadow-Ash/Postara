import axios from "axios";

const LINKEDIN_POSTS_API =
    "https://api.linkedin.com/rest/posts";

export async function publishTextPost({
    accessToken,
    personId,
    text,
}: {
    accessToken: string;
    personId: string;
    text: string;
}) {
    const response = await axios.post(
        LINKEDIN_POSTS_API,
        {
            author: `urn:li:person:${personId}`,

            commentary: text,

            visibility: "PUBLIC",

            distribution: {
                feedDistribution:
                    "MAIN_FEED",

                targetEntities: [],

                thirdPartyDistributionChannels:
                    [],
            },

            lifecycleState:
                "PUBLISHED",

            isReshareDisabledByAuthor:
                false,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,

                "Linkedin-Version":
                    "202506",

                "X-Restli-Protocol-Version":
                    "2.0.0",

                "Content-Type":
                    "application/json",
            },
        },
    );

    return {
        postId:
            response.headers[
            "x-restli-id"
            ],

        data: response.data,
    };
}