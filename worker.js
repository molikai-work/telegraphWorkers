/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
        return handleOptionsRequest();
    }

    let targetURL = 'https://telegra.ph';

    const htmlResponse = await fetch('https://molikai-work.github.io/telegraphWorkers/index.html');
    const htmlContent = await htmlResponse.text();

    if (request.url.includes('/file')) {
        const newRequest = new Request(targetURL + new URL(request.url).pathname, request);

        newRequest.headers.delete('Host');
        newRequest.headers.delete('Referer');

        return handleCorsRequest(newRequest);
    } else if (request.url.includes('/upload')) {
        const newRequest = new Request(targetURL + new URL(request.url).pathname, request);

        newRequest.headers.delete('Host');
        newRequest.headers.delete('Referer');

        return handleCorsRequest(newRequest);
    } else {
        return new Response(htmlContent, {
            headers: {
                "Content-Type": "text/html;charset=utf-8",
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

async function handleCorsRequest(request) {
    const response = await fetch(request);
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers
    });
}

function handleOptionsRequest() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}
