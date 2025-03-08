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
  category: string;
  url: string;
  publishedAt: string;
  author: string;
  content: {
    en: string;
    nus: string;
    din: string;
  }
}

export const sendNewPostNotification = functions.firestore
  .document("articles/{articleId}")
  .onCreate(async (snapshot, context) => {
    try {
      const article = snapshot.data() as Article;

      if (!article.imageUrl || !article.title || !article.source || !article.description) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing required article fields"
        );
      }
    
      functions.logger.log("Article data:", article);

      const message: admin.messaging.Message = {
        notification: {
          title: String(article.title.en),
          body: String(article.description),
          imageUrl: String(article.imageUrl)
        },
        data: {
          id: String(snapshot.id),
          title: String(article.title),
          source: String(article.source),
          description: String(article.description),
          imageUrl: String(article.imageUrl),
          content: String(article.content),
          url: String(article.url),
          publishedAt: String(article.publishedAt),
          category: String(article.category),
          author: String(article.author)
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