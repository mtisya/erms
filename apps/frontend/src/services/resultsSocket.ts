import {
    io,
    Socket
} from "socket.io-client";


const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    "http://localhost:5000";


interface ResultsUpdatedPayload {

    electionId: string;

    updatedAt: string;

}


let socket: Socket | null = null;


/**
 * Connect to Results Socket.IO server
 */
export function connectResultsSocket(): Socket {

    if (socket) {

        return socket;

    }


    socket = io(
        SOCKET_URL,
        {
            transports: [
                "websocket"
            ],

            autoConnect: true,

            reconnection: true,

            reconnectionAttempts: 10,

            reconnectionDelay: 1000,

            timeout: 10000
        }
    );


    socket.on(
        "connect",
        () => {

            console.log(
                "Results Socket connected:",
                socket?.id
            );

        }
    );


    socket.on(
        "disconnect",
        (reason) => {

            console.log(
                "Results Socket disconnected:",
                reason
            );

        }
    );


    socket.on(
        "connect_error",
        (error) => {

            console.error(
                "Results Socket connection error:",
                error.message
            );

        }
    );


    socket.io.on(
        "reconnect",
        (attempt) => {

            console.log(
                `Results Socket reconnected after ${attempt} attempt(s)`
            );

        }
    );


    return socket;

}


/**
 * Get existing socket
 */
export function getResultsSocket(): Socket | null {

    return socket;

}


/**
 * Join election results room
 */
export function joinElection(
    electionId: string
): void {

    if (!electionId) {

        console.warn(
            "Cannot join election: election ID is missing"
        );

        return;

    }


    const activeSocket =
        socket ||
        connectResultsSocket();


    const join = () => {

        activeSocket.emit(
            "join-election",
            electionId
        );


        console.log(
            `Joined election results room: election:${electionId}`
        );

    };


    if (activeSocket.connected) {

        join();

    } else {

        activeSocket.once(
            "connect",
            join
        );

    }

}


/**
 * Leave election results room
 */
export function leaveElection(
    electionId: string
): void {

    if (!socket || !electionId) {

        return;

    }


    socket.emit(
        "leave-election",
        electionId
    );


    console.log(
        `Left election results room: election:${electionId}`
    );

}


/**
 * Listen for live result updates
 */
export function onResultsUpdated(
    callback: (
        data: ResultsUpdatedPayload
    ) => void
): void {

    if (!socket) {

        connectResultsSocket();

    }


    socket?.on(
        "results-updated",
        callback
    );

}


/**
 * Remove live result update listener
 */
export function removeResultsUpdatedListener(
    callback: (
        data: ResultsUpdatedPayload
    ) => void
): void {

    socket?.off(
        "results-updated",
        callback
    );

}


/**
 * Disconnect Results Socket.IO
 */
export function disconnectResultsSocket(): void {

    if (!socket) {

        return;

    }


    socket.disconnect();

    socket = null;


    console.log(
        "Results Socket disconnected manually"
    );

}