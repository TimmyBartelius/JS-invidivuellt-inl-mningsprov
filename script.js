async function getApiKey() {
  const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Hejsan, jag funkar!");
    }

    const data = await response.json();
    console.log("API key:", data);
  } catch (error) {
    console.error("Error fetching api key", error);
  }
}
