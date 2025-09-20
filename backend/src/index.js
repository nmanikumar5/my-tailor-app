import App from './app.js';

// Create and start the application
const app = new App();

// Start the server
app.start().catch((error) => {
  console.error('❌ Application startup failed:', error);
  process.exit(1);
});