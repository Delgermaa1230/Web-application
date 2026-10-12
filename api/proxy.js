export default {
  async fetch(request) {
    const base = process.env.RENDER_API_URL;
    if (!base) return Response.json({ error: 'API is not configured.' }, { status: 503 });
    const incoming = new URL(request.url);
    const path = incoming.searchParams.get('path') || '';
    if (!/^[a-z0-9/_-]*$/i.test(path) || path.split('/').includes('..')) {
      return Response.json({ error: 'Invalid API path.' }, { status: 400 });
    }
    const target = new URL(`/api/${path}`, base);
    incoming.searchParams.delete('path');
    target.search = incoming.searchParams.toString();
    const headers = new Headers();
    for (const name of ['accept', 'content-type', 'cookie']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    try {
      const response = await fetch(target, {
        method: request.method,
        headers,
        body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        duplex: 'half',
        redirect: 'manual',
      });
      const responseHeaders = new Headers();
      for (const name of ['content-type', 'cache-control', 'set-cookie']) {
        const value = response.headers.get(name);
        if (value) responseHeaders.set(name, value);
      }
      responseHeaders.set('cache-control', 'no-store');
      return new Response(response.body, { status: response.status, headers: responseHeaders });
    } catch {
      return Response.json({ error: 'API is temporarily unavailable.' }, { status: 502 });
    }
  },
};
