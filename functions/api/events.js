export async function onRequestPost({ request }) {
  try {
    await request.json();
  } catch (error) {
    return new Response(null, { status: 204 });
  }
  return new Response(null, { status: 204 });
}
