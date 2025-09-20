import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/index.js';
import database from './config/database.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';

class App {
  constructor() {
    this.app = express();
    this.port = config.PORT;
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }
  
  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    
    // CORS configuration
    this.app.use(cors({
      origin: [
        config.FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:19006', // Expo dev server
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    
    // Rate limiting
    if (config.isProduction()) {
      this.app.use(generalLimiter);
    }
    
    // Logging
    if (config.isDevelopment()) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'TailorApp API is running',
        data: {
          timestamp: new Date().toISOString(),
          environment: config.NODE_ENV,
          version: '1.0.0',
        },
      });
    });
  }
  
  initializeRoutes() {
    // API routes
    this.app.use('/api/auth', authRoutes);
    
    // API base route
    this.app.get('/api', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Welcome to TailorApp API',
        data: {
          version: '1.0.0',
          environment: config.NODE_ENV,
          endpoints: {
            auth: '/api/auth',
            health: '/health',
          },
        },
      });
    });
  }
  
  initializeErrorHandling() {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(globalErrorHandler);
  }
  
  async start() {
    try {
      // Connect to database
      await database.connect();
      
      // Start server
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 TailorApp API server running on port ${this.port}`);
        console.log(`📊 Environment: ${config.NODE_ENV}`);
        console.log(`🌐 Frontend URL: ${config.FRONTEND_URL}`);
        console.log(`📱 SMS Service: ${config.TWILIO_ACCOUNT_SID ? 'Configured' : 'Development mode'}`);
        console.log(`📚 API Documentation: http://localhost:${this.port}/api`);
      });
      
      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));
      
    } catch (error) {
      console.error('❌ Failed to start server:', error.message);
      process.exit(1);
    }
  }
  
  async gracefulShutdown() {
    console.log('🔄 Starting graceful shutdown...');
    
    if (this.server) {
      this.server.close(async () => {
        console.log('✅ HTTP server closed');
        await database.close();
      });
    } else {
      await database.close();
    }
  }
  
  getApp() {
    return this.app;
  }
}

export default App;