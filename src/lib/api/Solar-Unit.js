const baseUrl = "/api";

export const getSolarUnitById = async (id) => {
  try {
    // Avoid setting Content-Type for GET to prevent unnecessary CORS preflight
    const res = await fetch(`${baseUrl}/solar-units/${id}`, {
      method: "GET",
      // credentials: 'include', // uncomment if your API uses cookies
    });

    if (!res.ok) {
      // Surface backend error details if available
      const text = await res.text().catch(() => "");
      throw new Error(`Request failed ${res.status} ${res.statusText} ${text}`);
    }

    const data = await res.json();
    console.log("Solar unit data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching solar unit:", error);
    throw error;
  }
};