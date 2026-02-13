module.exports = {
  apps: [

    {
        name: "integracao-intersig-mobile",
        // O script principal agora é o executável CLI do tsx
       // script: "node_modules/tsx/dist/cli.cjs", // Use o caminho relativo correto ou absoluto
       script: "node",
       //   interpreter: "node",
          // Os argumentos para o "script" (cli.js do tsx)
          args: [
            "--env-file", // Argumento para o tsx
            ".env",       // Valor do argumento --env-file
            "--experimental-strip-types", // Outro argumento para o tsx
            "src/index.ts" // O arquivo que o tsx deve processar, passado como argumento final para o tsx
          ],
         
          exec_mode: "fork",
          watch: false,
          max_memory_restart: "1G",
          instances: 1,
          autorestart: true,
          restart_delay: 5000,
          error_file: "logs/api-backup-err.log",
          out_file: "logs/api-backup-out.log",
          log_date_format: "YYYY-MM-DD HH:mm:ss"
        } , 
    ]
}