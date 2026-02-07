import { admin } from "../lib/firebase.js";

export const sendFCM = async (req, res) => {
    try {
        const fcmToken =
            "dLK528oDQ_OB23OBiV9TNG:APA91bEU-CkHhlZNNoolxfBCTcttwPUg9zre28eg6VWnd0CQ1KLxj9jFfmdeg8lEdX97Aq41BfzsZGaHV0myt8ws-NupZsAxON5mJTjwdnBPpyG9_7oeIBw";

        const message = {
            token: fcmToken,
            notification: {
                title: "🚀 Hello from Your Backend",
                body: "This is a static test notification from Node.js + Firebase Admin",
            },
            android: {
                notification: {
                    sound: "default",
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: "default",
                    },
                },
            },
            data: {
                screen: "home",
                customParam: "123",
            },
        };

        const response = await admin.messaging().send(message);
        console.log("✅ Notification sent successfully:", response);
        res.json({ success: true, message: "Notification sent!", response });
    } catch (error) {
        console.error("❌ Error sending notification:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
