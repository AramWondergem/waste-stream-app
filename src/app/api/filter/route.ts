import {FilterBody} from "@/interfaces/body/filterBody";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {

        const body: FilterBody = request.json() as FilterBody;

        return new Response(`Hello from ${process.env.VERCEL_REGION}`);

    } catch (error) {
        return new Response('Invalid request body', {status: 400});
    }

}