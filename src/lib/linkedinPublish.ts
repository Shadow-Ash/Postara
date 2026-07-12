import axios from "axios";
import fs from "node:fs";

const POSTS_API =
    "https://api.linkedin.com/rest/posts";

const IMAGE_API =
    "https://api.linkedin.com/rest/images";

const headers = (
    token: string,
) => ({
    Authorization: `Bearer ${token}`,

    "Linkedin-Version":
        "202506",

    "X-Restli-Protocol-Version":
        "2.0.0",
});

async function uploadSingleImage(
    accessToken: string,
    personId: string,
    filePath: string,
) {
    const initialize =
        await axios.post(
            `${IMAGE_API}?action=initializeUpload`,
            {
                initializeUploadRequest: {
                    owner: `urn:li:person:${personId}`,
                },
            },
            {
                headers: {
                    ...headers(
                        accessToken,
                    ),
                    "Content-Type":
                        "application/json",
                },
            },
        );

    const uploadUrl =
        initialize.data.value.uploadUrl;

    const imageUrn =
        initialize.data.value.image;

    const file =
        fs.readFileSync(filePath);

    await axios.put(
        uploadUrl,
        file,
        {
            headers: {
                "Content-Type":
                    "application/octet-stream",
            },

            maxBodyLength:
                Infinity,
        },
    );

    return imageUrn;
}

async function uploadImages(
    accessToken: string,
    personId: string,
    imagePaths: string[],
) {
    const urns: string[] = [];

    for (const image of imagePaths) {
        const urn =
            await uploadSingleImage(
                accessToken,
                personId,
                image,
            );

        urns.push(urn);
    }

    return urns;
}

export async function publishPost({
    accessToken,
    personId,
    text,
    imagePaths = [],
}: {
    accessToken: string;
    personId: string;
    text: string;
    imagePaths?: string[];
}) {
    let content = undefined;

    if (imagePaths.length === 1) {
        const imageUrn =
            (
                await uploadImages(
                    accessToken,
                    personId,
                    imagePaths,
                )
            )[0];

        content = {
            media: {
                id: imageUrn,
            },
        };
    }

    if (imagePaths.length >= 2) {
        const imageUrns =
            await uploadImages(
                accessToken,
                personId,
                imagePaths,
            );

        content = {
            multiImage: {
                images:
                    imageUrns.map(
                        (urn) => ({
                            id: urn,
                        }),
                    ),
            },
        };
    }

    const response =
        await axios.post(
            POSTS_API,
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

                ...(content && {
                    content,
                }),
            },
            {
                headers: {
                    ...headers(
                        accessToken,
                    ),

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
    };
}