import axios from "axios";

const OPENMIC_BASE = "https://api.openmic.ai";
const OPENMIC_API_KEY = process.env.OPENMIC_API_KEY;
if(!OPENMIC_API_KEY) console.warn("OPENMIC_API_KEY is not set in environment variables");

export const openmic = axios.create({
    baseURL: OPENMIC_BASE,
    timeout: 10000,
    headers:{
        Authorization : `Bearer omic_b869fdc8539ca9b17e41bcb0a07049e46576`,
        'Content-Type' : 'application/json'
    }
})