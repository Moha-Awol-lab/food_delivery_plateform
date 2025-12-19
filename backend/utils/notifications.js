const { Expo } = require('expo-server-sdk');
let expo = new Expo();

exports.sendNotification = async (targetToken, message) => {
    if (!Expo.isExpoPushToken(targetToken)) return;

    let messages = [{
        to: targetToken,
        sound: 'default',
        body: message,
        data: { withSome: 'data' },
    }];

    try {
        await expo.sendPushNotificationsAsync(messages);
    } catch (error) {
        console.error("Notification Error:", error);
    }
};