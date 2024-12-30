const object_key = 'vote-count.json'; // R2 存储中的文件键名，请修改
const allowedOrigins = ['https://kaitou-ch.site', '*']; // 允许的来源
const r2BucketName = 'kaitou_ch';
const targetOrigin = 'https://kaitou-ch.srt.pub'; // The domain that should be proxied to


async function handleRequest(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the request path starts with /api
    if (url.pathname.startsWith('/api')) {
        return handleApiRequest(request, env, ctx);
    }

    // Handle preflight requests (OPTIONS) for CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', '),
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Origin, X-Requested-With, Accept',
            },
        });
    }

    if (request.method === 'POST') {
        try {
            const body = await request.json();
            const option = body.option;
            if (!option || !['Yes', 'No'].includes(option)) {
                return new Response('Bad Request', {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', '),
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                });
            }
            if (await updateVoteCount(option, env[r2BucketName])) {
                return new Response('Vote Count Updated', {
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', '),
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                });
            } else {
                return new Response('Error updating vote count', {
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', '),
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type',
                    },
                });
            }
        } catch (error) {
            return new Response('Bad Request', {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', '),
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }
    } else if (request.method === 'GET') {
        const voteCount = await getVoteCount(env[r2BucketName]);
        const responseBody = voteCount.statusCode === 200 ? JSON.stringify(voteCount.body) : voteCount.body;
        return new Response(responseBody, {
            status: voteCount.statusCode,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', '),
            },
        });
    } else {
        return new Response('Method Not Allowed', {
            status: 405,
            headers: {
                'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins.join(', '),
                'Access-Control-Allow-Methods': 'GET, POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}

async function handleApiRequest(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname, targetOrigin);
    const { method, headers, body } = request;

    const proxyRequest = new Request(targetUrl.toString(), {
        method,
        headers,
        body
    });

    try {
       const response = await fetch(proxyRequest);
        const responseBody = await response.text();
        const responseHeaders = Object.fromEntries(response.headers.entries())
        // Return the response as is
        return new Response(responseBody,{
          status:response.status,
          headers:responseHeaders
        });
    } catch (error) {
        // Handle any errors
        return new Response(`Proxy Error: ${error.message}`, { status: 500 });
    }
}


async function getVoteCount(bucket) {
    try {
        const object = await bucket.get(object_key);
        if (!object) {
            return {statusCode: 404, body: 'File not found'};
        }
        const voteCountJson = await object.text();
        const voteCountData = JSON.parse(voteCountJson);
        if ('Yes' in voteCountData && 'No' in voteCountData) {
            return {statusCode: 200, body: {Yes: voteCountData.Yes, No: voteCountData.No}};
        } else {
            return {statusCode: 500, body: 'Error: Yes and No keys not found in vote data'}
        }
    } catch (error) {
        return {statusCode: 500, body: 'Error getting the vote count'}
    }
}

async function updateVoteCount(vote_count, bucket) {
    try {
        const object = await bucket.get(object_key);
        if (!object) {
            return false;
        }
        const voteCountJson = await object.text();
        const voteCountData = JSON.parse(voteCountJson);
        if (vote_count in voteCountData) {
            voteCountData[vote_count] = (voteCountData[vote_count] || 0) + 1;
            const updatedVoteCountJson = JSON.stringify(voteCountData);
            await bucket.put(object_key, updatedVoteCountJson);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env, ctx);
    },
};
