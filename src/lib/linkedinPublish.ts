import axios from "axios";
import fs from "node:fs";

const POSTS_API =
    "https://api.linkedin.com/rest/posts";

const IMAGE_API =
    "https://api.linkedin.com/rest/images";

const LINKEDIN_VERSION =
    process.env.LINKEDIN_VERSION ?? "202603";

function headers(token: string) {
    return {
        Authorization: `Bearer ${token}`,
        "LinkedIn-Version": LINKEDIN_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
    };
}

async function uploadSingleImage(
    accessToken: string,
    personId: string,
    filePath: string,
) {
    console.log("PERSON ID");
    console.log(personId);

    console.log("OWNER");
    console.log(`urn:li:person:${personId}`);

    try {
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
    } catch (error: any) {
        console.log("INITIALIZE ERROR");
        console.dir(
            error.response?.data,
            {
                depth: null,
            },
        );

        console.log(
            error.response?.headers,
        );

        throw error;
    }
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

    let response;

    try {

        response =
            await axios.post(
                POSTS_API,
                {
                    author:
                        `urn:li:person:${personId}`,

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

    } catch (error: any) {

        const status =
            error.response?.status;

        const code =
            error.response?.data?.code;

        if (
            status === 401 ||
            code ===
            "INVALID_ACCESS_TOKEN" ||
            code ===
            "EXPIRED_ACCESS_TOKEN"
        ) {

            const authError =
                new Error(
                    "LINKEDIN_RECONNECT_REQUIRED",
                );

            throw authError;

        }

        throw error;

    }

    return {
        postId:
            response.headers[
            "x-restli-id"
            ],
    };
}