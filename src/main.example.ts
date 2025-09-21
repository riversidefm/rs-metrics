import { BootstrapFactory } from '@riversidefm/bootstrap';

// Import your modules from the modules directory
// import { UserModule } from './modules/user/user.module';
// import { ProductModule } from './modules/product/product.module';
// import { OrderModule } from './modules/order/order.module';

async function bootstrap() {
  await BootstrapFactory.create({
    // Add your application modules here
    modules: [
      // UserModule,
      // ProductModule,
      // OrderModule,
    ],

    // Customize Swagger documentation (optional)
    swagger: {
      title: 'My API',
      description: 'API Documentation',
      version: '1.0',
      path: 'api', // Swagger UI will be available at /api
    },

    // Customize port (optional, defaults to process.env.PORT or 3000)
    // port: 3000,
  });
}

void bootstrap();

/**
 * The Bootstrap Factory provides the following out of the box:
 *
 * ✅ Custom Logger Service
 * ✅ Validation Pipes with whitelist and transform
 * ✅ Global Logging Interceptor
 * ✅ Swagger/OpenAPI Documentation
 * ✅ Health Check Endpoint (/healthz)
 * ✅ Environment Configuration and Validation
 * ✅ Database Module
 * ✅ Feature Flags Service
 *
 * Simply import your modules and add them to the modules array above.
 */
