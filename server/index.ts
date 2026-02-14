import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// ✅ Serve frontend from dist/public
const publicPath = path.join(__dirname, '../dist/public');
app.use(express.static(publicPath));

// ✅ SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Pure frontend server running on port ${port}`);
});
