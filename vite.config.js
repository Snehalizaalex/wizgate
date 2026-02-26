import { defineConfig } from 'vite'

import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
                courses: resolve(__dirname, 'courses.html'),
                test: resolve(__dirname, 'test.html')
            }
        }
    },
    server: {
        port: 5173,
        strictPort: true,
        open: true
    }
})
