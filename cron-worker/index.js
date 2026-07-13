const axios = require("axios");

async function run() {
    try {
        const res = await axios.get(process.env.CRON_ENDPOINT_URL, {
            headers: {
                Authorization: `Bearer ${process.env.CRON_SECRET}`,
            },
        });

        console.log(res.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
    }

    process.exit(0);
}

run();