import app from './index'

const PORT = process.env.PORT || 6969;

if (!process.env.PORT) console.warn('>> PORT from env not found then use static port instated <<');

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT} : run on ${process.env.NODE_ENV} server`);
})
