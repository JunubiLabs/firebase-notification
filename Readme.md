# Nilean Firebase Notifications Server

## 1. 🧩 Setup & Dependencies

1. **Clone this repository**

   ```bash
   git clone https://github.com/JunubiLabs/firebase-notification.git
   ```

2. **Download Firebase service account JSON** from *Firebase Console → Project Settings → Service accounts*, save it as e.g. `fcmServiceAccountKey.json`, and **add to project folder.


## 2. Install Dependencies

```bash
  npm install
```

## 3. Run Your Server

```bash
npx ts-node src/index.ts
```

## 4. You can test using Postman:

```json
POST /sendNotification
Content-Type: application/json

{
  "fcmToken": "<DEVICE_TOKEN>",
  "topic": "topic",
  "title": "Hello!",
  "body": "This is a push notification.",
  "data": { "foo": "bar" }
}
```

## 5. Client-Side Considerations

* Ensure your client (web/mobile) collects and sends FCM registration tokens to this server.
* On web, you'll need `firebase-messaging-sw.js` and locate your VAPID key as shown in the \[Firebase web docs]\([github.com][1], [medium.com][2], [medium.com][3], [mindbowser.com][4], [firebase.google.com][5]).
* For mobile, use the platform SDK to retrieve the token and submit it.
