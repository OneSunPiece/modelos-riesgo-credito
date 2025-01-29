export async function sendPredictionRequest(features) {
    const API_URL = 'https://p23mvua4bs6ikuxs4us4cbfh3m0tsiue.lambda-url.us-east-1.on.aws/'

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: features
        }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }
      return await response.json();

    } catch (error) {
      console.error("Error:", error);
      return { prediction: "Error occurred" };
    }
  }
  