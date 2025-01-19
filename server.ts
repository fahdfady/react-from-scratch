const PORT = 2121

const server = Bun.serve({
    port: PORT,
    fetch: async (request) => {
        const url = new URL(request.url);
        const path = url.pathname;

        if (path === "/") {
            const html = await Bun.file('index.html').text();
            return new Response(html, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html'
                }
            })
        }

        const js = await Bun.file("build/index.js")
            .text();

        return new Response(
            js,
            {
                status: 200,
                statusText: "loaded js successfully ✪ ω ✪",
                headers: {
                    'Content-Type': 'application/javascript'
                }
            }
        )
    }
})

console.log(`Server running on port ${PORT} ...(*￣０￣)ノ`)
console.log(`http://localhost:${PORT}`)