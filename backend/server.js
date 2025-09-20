const axios = require('axios');

// --- IMPORTANT ---
// Replace this placeholder with your actual OpenMic API key for this test.
const OPENMIC_API_KEY = "omic_b869fdc8539ca9b17e41bcb0a07049e46576"; 

// Create an axios client exactly like the one in your project
const openmic = axios.create({
    baseURL: "https://api.openmic.ai",
    timeout: 15000, // Increased timeout to 15 seconds for the test
    headers: {
        'Authorization': `Bearer ${OPENMIC_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

// The exact same payload your frontend sends
const botPayload = {
    name: 'Connectivity Test Bot',
    prompt: 'This is a test to check the network connection.',
    first_message: 'Hello, test.',
};

// An async function to run our test
const runTest = async () => {
    console.log("--- Starting Standalone API Test ---");
    console.log("Sending request to OpenMic API...");

    try {
        const response = await openmic.post('/v1/bots', botPayload);
        console.log("\n✅ SUCCESS!");
        console.log("Status:", response.status);
        console.log("Data:", response.data);
    } catch (error) {
        console.log("\n❌ FAILED!");
        console.log("An error occurred during the API call.");
        // Log the entire error object to get maximum detail
        console.error(error);
    } finally {
        console.log("\n--- Test Finished ---");
    }
};

// Execute the test
runTest();