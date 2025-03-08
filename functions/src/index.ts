import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

interface Article {
  title: {
    en: string;
    nus: string;
    din: string;
  };
  source: string;
  imageUrl: string;
  description: string;
}

export const sendNewPostNotification = functions.firestore
  .document("articles/{articleId}")
  .onCreate(async (snapshot, context) => {
    try {
      const article = snapshot.data() as Article;
      const articleId = context.params.articleId;

      if (!article.imageUrl || !article.title || !article.source || !article.description) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing required article fields"
        );
      }
    
      functions.logger.error("Article data:", article);

      const message: admin.messaging.Message = {
        notification: {
          title: 'New Message',
          body: 'Hello Subscribed Users!',
        },
        data: { // Optional custom data payload
          key1: 'value1',
          key2: 'value2',
        },
        topic: "articles"
      };
      
      // Send message
      const response = await admin.messaging().send(message);
      functions.logger.log("Notification sent successfully", response);
      return null;
    } catch (error) {
      functions.logger.error("Error sending notification:",error);
      throw new functions.https.HttpsError(
        "internal",
        `Notification failed to send`,
        error
      );
    }
  });