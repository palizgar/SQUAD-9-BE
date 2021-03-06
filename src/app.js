const config = require('config').get('service');
const express = require('express');
const logger = require('./helpers/logger');
const path = require('path');
const requestLogger = require('./middleware/requestLogger');
const migration = require('./models/migration');
const { apiRoutes } = require('./routes');
const { routeErrorHandler, routeNotFoundHandler } = require('./middleware/errorHandlers');
const { asyncRouteHandler } = require('./middleware/routeHandlers');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../public/swagger.json');

const app = express();

// Register Application middleware
app.use(express.json());
app.use(requestLogger);
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Register Application routes
apiRoutes(app);

// Register API fallback route and error handler
app.use('/api/*', asyncRouteHandler(routeNotFoundHandler));
app.use('/api', routeErrorHandler);

// Migrate DB
migration(logger);

// Start express server
app.listen(config.port, () => {
	logger.info('Service is running', { port: config.port });
});
