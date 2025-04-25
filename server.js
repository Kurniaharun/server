const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/search/:query", async (req, res) => {
    const query = req.params.query;

    try {
        const apiUrl = `https://scriptblox-api-proxy.vercel.app/api/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Format hasil agar lebih bersih
        const scripts = data.result?.scripts?.map(script => ({
            title: script.title,
            description: script.description || "No description",
            game: script.game?.name || "Universal",
            views: script.views,
            verified: script.verified,
            patched: script.isPatched,
            type: script.scriptType,
            keyRequired: script.key,
            createdAt: script.createdAt,
            updatedAt: script.updatedAt,
            url: `https://scriptblox.com/script/${script.slug}`
        })) || [];

        res.json({
            success: true,
            total: scripts.length,
            query,
            results: scripts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching data",
            error: error.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("Gunakan endpoint: /search/:query");
});

app.listen(PORT, () => {
    console.log(`API is running on http://localhost:${PORT}`);
});
