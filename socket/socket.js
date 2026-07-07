// socket/socket.js

const connectedUsers = new Map();

let ioInstance = null;

/**
 * Initialize Socket.IO
 */
export const initializeSocket = (io) => {

    // Save io instance so other files can use it
    ioInstance = io;

    io.on("connection", (socket) => {

        console.log("Socket Connected:", socket.id);

        /**
         * Register authenticated user
         */
        socket.on("register", (userId) => {

            connectedUsers.set(
                userId.toString(),
                socket.id
            );

            console.log(
                `User ${userId} registered with socket ${socket.id}`
            );

        });

        /**
         * Remove disconnected user
         */
        socket.on("disconnect", () => {

            for (const [userId, socketId] of connectedUsers.entries()) {

                if (socketId === socket.id) {

                    connectedUsers.delete(userId);

                    console.log(
                        `User ${userId} disconnected`
                    );

                    break;

                }

            }

            console.log(
                "Socket Disconnected:",
                socket.id
            );

        });

    });

};

/**
 * Get Socket.IO instance
 */
export const getIO = () => ioInstance;

/**
 * Get socket ID of a connected user
 */
export const getUserSocket = (userId) => {

    return connectedUsers.get(
        userId.toString()
    );

};

/**
 * Check whether a user is online
 */
export const isUserOnline = (userId) => {

    return connectedUsers.has(
        userId.toString()
    );

};

/**
 * Get all connected users (useful for debugging/admin)
 */
export const getConnectedUsers = () => {

    return Array.from(
        connectedUsers.entries()
    );

};