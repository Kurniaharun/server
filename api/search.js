// api/search.js

const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: "Query is required (use ?query=...)" });
  }

  try {
    const apiUrl = `https://scriptblox-api-proxy.vercel.app/api/search?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

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

    res.status(200).json({
      success: true,
      total: scripts.length,
      query,
      results: scripts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching data", error: error.message });
  }
};
