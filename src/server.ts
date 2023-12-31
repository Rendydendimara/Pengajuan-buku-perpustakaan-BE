import bodyParser from 'body-parser';
import cors from 'cors';
import Debug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import mainRouter from './routes';
import logger from './libraries/Logger';
import connectDB from './db/mongo';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import config from './config';
import { createAdminSeeds } from './db/seed/admin';

require('dotenv').config();
const debug = Debug('backend-pengajuanbukuperpusunwina:server');
// init express app
const app = express();

const folders = ['uploads'];
for (const folder of folders) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
}

// Init MongoDB
connectDB(() => {
  console.log('Successfully connected to database');
  // createAdminSeeds();
  // createKategoriMakalahSeeds();
  // createAdminSeeds();
  // addVariabelSeed();
  // createAdminSeeds();
  // RunSeedsTableTemplateDBMaid();
  // console.log('TOKEN: ', createTempToken());
});

// Cors enable (include before routes)
app.use(cors());
// Protection http using helmet
app.use(helmet());
// app.use(
//   cors({
//     origin: FRONTEND_URL,
//   })
// );
// Protection from DDOS
// app.use(ExpressLimmiter);

// Set Public Folder
app.use('/uploads/makalah', express.static('uploads/makalah'));
app.use('/uploads/buktipembayaran', express.static('uploads/buktipembayaran'));
app.use('/uploads/userprofile', express.static('uploads/userprofile'));

// Logger Morgan
app.use(
  morgan(function (tokens, req, res) {
    const responseCode = tokens?.status(req, res) ?? '500';
    if (responseCode.charAt(0) === '4' || responseCode.charAt(0) === '5') {
      if (req.body.files) {
        req.body.files = undefined; // except files
      }
      console.log('request.body', req.body);
      console.log('request.query', req.query);
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        responseCode,
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }
  })
);

// Enable Json Body
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Mount routes
app.use('/api', mainRouter);

// 404
app.get('*', (req: Request, res: Response) => {
  res.status(404).send({
    success: false,
    data: null,
    message: 'Page Not found',
  });
});

// error handler
app.use(
  async (err: Error | any, req: Request, res: Response, next: NextFunction) => {
    let isDev =
      config.NODE_ENV === 'development' || config.NODE_ENV === 'staging';
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = isDev ? err : {};

    logger.error(err, 'general-error');
    // render the error page
    let errorMessage = err.message || err;
    if (errorMessage?.includes('Ukuran')) {
      isDev = true;
    }
    if (errorMessage?.includes('too large')) {
      isDev = true;
      errorMessage = 'Ukuran file terlalu besar';
    }
    res.status(err.status || 500);
    res.send({
      success: false,
      data: null,
      message: isDev ? errorMessage : 'Ooops ada kesalahan pada sistem.',
    });
  }
);

// Listen
const port = normalizePort(config.PORT || '8080');
app.set('port', port);

if (config.NODE_ENV === 'development') {
  // dummy server options (only for development)
  // const credentials = {
  //   key: fs.readFileSync('key.pem'),
  //   cert: fs.readFileSync('cert.pem'),
  // };
  // const httpsServer = https.createServer(credentials, app);
  const httpsServer = http.createServer(app);
  httpsServer.listen(port, () => {
    const addr: any = httpsServer.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug(`Listening on ${bind}`);
    console.log(
      `🚀 Server start on port ${port}`,
      `Running with ${config.NODE_ENV} environment...`
    );
  });
  httpsServer.on('error', onError);
} else {
  const server = http.createServer(app);
  server.listen(port);
  console.log('Running on', server.address());
  server.on('error', onError);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
