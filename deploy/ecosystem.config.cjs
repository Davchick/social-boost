/** PM2: запуск из корня репозитория: pm2 start deploy/ecosystem.config.cjs */
module.exports = {
  apps: [
    {
      name: "social-boost-api",
      cwd: "./server",
      script: "src/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
