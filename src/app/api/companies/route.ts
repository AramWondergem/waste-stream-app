import {FilterBody} from "@/interfaces/body/filterBody";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'nodejs';


// based on the selected filters, the companies are returned with the selected resources
export async function POST(request: Request) {
    try {
        const body: FilterBody = await request.json() as FilterBody;

        return new Response(JSON.stringify(body));

    } catch (error) {
        return new Response('Invalid request body', {status: 400});
    }

}