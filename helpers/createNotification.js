// import Notification from "../models/Notification/Notification.js";


// const createNotification = async (
//   user,
//   title,
//   message
// ) => {
//   return Notification.create({
//     user,
//     title,
//     message,
//   });
// };

// export default createNotification;

import Notification from "../models/Notification/Notification.js";
import { emitNotification } from "../socket/socketEmitter.js";

const createNotification = async (
  user,
  title,
  message
) => {

  try {

    const notification = await Notification.create({
      user,
      title,
      message,
    });

    // Send real-time notification
    emitNotification(
      user,
      notification
    );

    return notification;

  } catch (error) {

    console.error(
      "Notification Error:",
      error.message
    );

    return null;

  }

};

export default createNotification;