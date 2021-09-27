import express from 'express';
import bodyParser from 'body-parser';
import adminRoutes from './handlers/admin';
import userRoutes from './handlers/user';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

adminRoutes(app);
userRoutes(app);

app.listen(port, () => {
  console.log(`Server active and listening to port ${port}`);
});

export default app;