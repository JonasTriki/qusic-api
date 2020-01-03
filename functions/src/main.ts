import 'module-alias/register';
import logger from '_logger';
import app from './app';

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`);
});

export default app;
