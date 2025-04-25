const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const proxAPI = "https://scriptblox-api-proxy.vercel.app/api/fetch";
const searchproxAPI = "https://scriptblox-api-proxy.vercel.app/api/search";

app.use(express.json());

// Route untuk mendapatkan script berdasarkan halaman
app.get('/api/scripts', async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const response = await axios.get(`${proxAPI}?page=${page}`);
        const data = response.data;
        
        if (!data.result || !data.result.scripts.length) {
            return res.status(404).json({ error: "No scripts found." });
        }

        const scripts = data.result.scripts.map(script => ({
            title: script.title,
            description: script.description,
            game: script.game?.name || "Universal",
            verified: script.verified ? "Verified" : "Not Verified",
            scriptType: script.scriptType.charAt(0).toUpperCase() + script.scriptType.slice(1),
            views: script.views,
            createdAt: new Date(script.createdAt).toLocaleDateString(),
            updatedAt: new Date(script.updatedAt).toLocaleDateString(),
            keyRequired: script.key ? true : false,
            keyLink: script.keyLink || null
        }));

        res.json(scripts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route untuk melakukan pencarian
app.get('/api/search', async (req, res) => {
    try {
        const { query, mode, page = 1 } = req.query;
        const url = new URL(searchproxAPI);
        url.searchParams.append("q", query);
        if (mode) url.searchParams.append("mode", mode);
        url.searchParams.append("page", page);

        const response = await axios.get(url.toString());
        const data = response.data;

        if (!data.result || !data.result.scripts.length) {
            return res.status(404).json({ error: "No search results found." });
        }

        const scripts = data.result.scripts.map(script => ({
            title: script.title,
            description: script.description,
            game: script.game?.name || "Universal",
            verified: script.verified ? "Verified" : "Not Verified",
            scriptType: script.scriptType.charAt(0).toUpperCase() + script.scriptType.slice(1),
            views: script.views,
            createdAt: new Date(script.createdAt).toLocaleDateString(),
            updatedAt: new Date(script.updatedAt).toLocaleDateString(),
            keyRequired: script.key ? true : false,
            keyLink: script.keyLink || null
        }));

        res.json(scripts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
