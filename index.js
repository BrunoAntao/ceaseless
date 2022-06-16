console.clear();

// const httpsServer = require('./server/httpsRoutes')(443);
const httpServer = require('./server/httpRoutes')(80);

// require('./server/socketRoutes')(httpsServer);