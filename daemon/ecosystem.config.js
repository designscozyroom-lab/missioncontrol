module.exports = {
  apps: [
    {
      name: "mc-notification-daemon",
      script: "./notification-daemon.ts",
      interpreter: "npx",
      interpreter_args: "tsx",
      cwd: __dirname,
      env: {
        CONVEX_URL: process.env.CONVEX_URL || "",
      },
      // Restart settings
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      // Logging
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      // Crash recovery
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
