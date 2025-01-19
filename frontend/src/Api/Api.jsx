export async function sendPredictionRequest(features) {
    const API_URL = "https://<api_gateway_url>/predict"; // Replace
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return { prediction: "Error occurred" };
    }
  }
  