const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;  // ✅ Use dynamic port for Render

const API_KEY = "AIzaSyB_FwkOBgqQqwPJ5W3dHaM7QsLfJZC9XRk";  // Replace with your actual API key
const CX = "35aae80a53e434e54";    // Replace with your actual CSE ID

app.use(cors());
app.use(express.json());

app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Missing query parameter" });

    try {
        const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
            params: {
                q: query,
                cx: CX,
                key: API_KEY,
                searchType: "image",
                num: 5,
            },
        });

        const images = response.data.items.map(item => ({
            url: item.link,
            source: item.image.contextLink // ✅ Store source URL
        }));

        res.json({ images });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));