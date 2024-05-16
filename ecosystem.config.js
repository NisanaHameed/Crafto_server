module.exports = {
    apps: [
        {
            name: "crafto",
            script: "./dist/server.js",
            instances: 1,
            autorestart: true,
            watch: true,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "development",
                PORT: 3000,
            },
        },
    ],
};