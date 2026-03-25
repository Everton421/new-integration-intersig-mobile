module.exports = {
  apps: [

    {
        name: "integracao-mobile",
       script: "node",
          args: [
            "--env-file", // Argumento para o tsx
            ".env",       // Valor do argumento --env-file
            "--experimental-strip-types", // Outro argumento para o tsx
            "src/index.ts" // O arquivo que o tsx deve processar, passado como argumento final para o tsx
          ],
         
          exec_mode: "fork",
          watch: false,
          max_memory_restart: "250M",
          instances: 2,
          autorestart: true,
          restart_delay: 5000,
          error_file: "logs/api-backup-err.log",
          out_file: "logs/api-backup-out.log",
          log_date_format: "YYYY-MM-DD HH:mm:ss"
        } , 
    ]
}