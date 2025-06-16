import express from 'express';
import { sendNotification } from './notification';

const app = express();
app.use(express.json());

app.post('/sendNotification', async (req, res) => {
  const {  title, body, image } = req.body as {
    title: string;
    body: string;
    image: string;
  };

  try {
    const payload = { title, body, image };
    const topic = 'news_titles';

    const response = await sendNotification(payload, topic);

    console.log('Notification sent:', response);
    res.status(200).json({ message: 'Notification sent', id: response });
  } catch (err: any) {
    console.error('Error sending:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 listening on ${PORT}`));
