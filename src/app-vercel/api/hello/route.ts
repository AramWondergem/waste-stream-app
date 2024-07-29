export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'nodejs';

export function GET(request: Request) {
    return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}