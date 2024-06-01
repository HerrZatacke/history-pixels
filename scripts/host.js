/* eslint-disable import/extensions */
import chalk from 'chalk';
import path from 'node:path';
import express from 'express';

const port = 3000;
const app = express();

app.use(express.static(path.join(process.cwd(), 'dist')));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(chalk.green(`Example app listening at http://localhost:${port}`));
});
