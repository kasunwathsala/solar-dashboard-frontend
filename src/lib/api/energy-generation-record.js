const baseUrl = "/api";

export const getEnergyGenerationRecordsBySolarUnit = async (solarUnitId) => {
  const res = await fetch(
    `${baseUrl}/energy-generation-records/solar-unit/${solarUnitId}`,
    {
      method: "GET",
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status} ${res.statusText} ${text}`);
  }
  const data = await res.json();
  return data;
};