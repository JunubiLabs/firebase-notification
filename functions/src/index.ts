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

      // Construct FCM message
      const message: admin.messaging.Message = {
        data: {
          title: article.title.en,
          source: article.source,
          image: article.imageUrl,
          description: article.description,
          article_id: articleId,
          click_action: "FLUTTER_NOTIFICATION_CLICK"
        },
        android: {
          priority: "high",
          notification: {
            imageUrl: article.imageUrl
          }
        },
        apns: {
          payload: {
            aps: {
              "mutable-content": 1
            }
          },
          fcmOptions: {
            imageUrl: article.imageUrl
          }
        },
        topic: "new_articles"
      };

      // Send message
      const response = await admin.messaging().send(message);
      functions.logger.log("Notification sent successfully", response);
      return null;
    } catch (error) {
      functions.logger.error("Error sending notification:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Notification failed to send",
        error
      );
    }
  });