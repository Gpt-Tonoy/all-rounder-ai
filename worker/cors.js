export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Content-Type": "application/json"
};

export function json(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: CORS
    }
  );

}
