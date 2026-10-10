import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function mockBackendMiddleware() {
  return {
    name: 'mock-backend',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            
            // 1. Handle Login (/api/login)
            if (req.url.includes('/api/login')) {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                status: 'success',
                token: 'admin-jwt-token-12345',
                user: {
                  id: 1,
                  username: 'admin',
                  role: 'admin',
                  name: 'Dr. Muhammad Umer Farooq'
                },
                message: 'Login successful'
              }));
            }

            // 2. Handle Content & all other /api routes
            res.statusCode = 200;
            return res.end(JSON.stringify({
              success: true,
              status: 'success',
              message: 'OK',
              data: {
                doctorName: "Dr. Muhammad Umer Farooq",
                title: "Neurologist",
                degree: "MBBS, FCPS (Neurology)"
              }
            }));
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), mockBackendMiddleware()],
  server: {
    port: 5173
  }
});
