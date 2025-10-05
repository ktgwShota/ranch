export async function GET() {
  return new Response(JSON.stringify({ message: "Hello from API Route!" }), {
    headers: { "Content-Type": "application/json" }
  });
}
