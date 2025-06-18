import {messaging} from "./firebase";

interface NotificationPayload {
  title: string;
  body: string;
  image: string;
  topic: string;
  fcmToken?: string;
  data?: Record<string, string>;
}

export async function sendNotification(
  payload: NotificationPayload,
): Promise<string> {

  const message = {
    notification: {
      title: payload.title
    },
    android: {
      notification: {
        imageUrl: payload.image
      }
    },
    apns: {
      payload: {
        aps: {
          'mutable-content': 1
        }
      },
      fcm_options: {
        image: payload.image
      }
    },
    webpush: {
      headers: {
        image: payload.image
      }
    },
    topic: payload.topic,
  };

  try {
    const response = await messaging.send(message);
    console.log('Successfully sent message:', response);
    return response; // message ID string
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
