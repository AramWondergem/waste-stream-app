import {FilterBody} from "@/interfaces/body/filterBody";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request
export const runtime = 'nodejs';


// based on the selected filters, the amount of resources per types of disposal are send back differentiated by material types
export async function POST(request: Request) {
    try {
        const body: FilterBody = await request.json() as FilterBody;

        return new Response(JSON.stringify(body));

    } catch (error) {
        return new Response('Invalid request body', {status: 400});
    }

}