import {
    Server as HttpServer
} from "http";

import {
    Server as SocketIOServer
} from "socket.io";


let io: SocketIOServer | null = null;


/**
 * Initialize Socket.IO
 */
export function initializeSocket(
    server: HttpServer
) {

    if (io) {

        console.warn(
            "Socket.IO has already been initialized"
        );

        return io;

    }


    io = new SocketIOServer(

        server,

        {

            cors: {

                origin:
                    process.env.FRONTEND_URL ||
                    "http://localhost:5173",

                credentials: true,

                methods: [
                    "GET",
                    "POST",
                    "PATCH",
                    "PUT",
                    "DELETE"
                ]

            }

        }

    );


    io.on(
        "connection",
        (socket) => {

            console.log(
                `Socket connected: ${socket.id}`
            );


            /**
             * Join election room
             */
            socket.on(
                "join:election",
                (
                    electionId: string
                ) => {

                    if (!electionId) {
                        return;
                    }


                    const room =
                        `election:${electionId}`;


                    socket.join(room);


                    console.log(
                        `Socket ${socket.id} joined ${room}`
                    );


                    socket.emit(
                        "joined:election",
                        {
                            electionId
                        }
                    );

                }
            );


            /**
             * Leave election room
             */
            socket.on(
                "leave:election",
                (
                    electionId: string
                ) => {

                    if (!electionId) {
                        return;
                    }


                    const room =
                        `election:${electionId}`;


                    socket.leave(room);


                    console.log(
                        `Socket ${socket.id} left ${room}`
                    );

                }
            );


            /**
             * Disconnect
             */
            socket.on(
                "disconnect",
                (reason) => {

                    console.log(
                        `Socket disconnected: ${socket.id} - ${reason}`
                    );

                }
            );

        }
    );


    console.log(
        "Real-time results socket enabled"
    );


    return io;

}


/**
 * Get Socket.IO instance
 */
export function getIO(): SocketIOServer {

    if (!io) {

        throw new Error(
            "Socket.IO has not been initialized"
        );

    }


    return io;

}


/**
 * Emit live results update
 */
export function emitResultsUpdated(
    electionId: string
) {

    const socket =
        getIO();


    const room =
        `election:${electionId}`;


    const io = getIO();

        io.to(room).emit(
            "results:updated",
            {
                electionId,
                updatedAt: new Date().toISOString()
            }
        );

}
