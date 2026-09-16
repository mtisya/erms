import { io } from "socket.io-client";

const electionId =
    "cms5oy6n50000sxictbo7vuug";

const socket =
    io("http://localhost:5000");

socket.on("connect", () => {

    console.log(
        "Connected to Socket.IO:",
        socket.id
    );

    socket.emit(
        "join-election",
        electionId
    );

    console.log(
        "Joined election room:",
        `election:${electionId}`
    );

});

socket.on(
    "results-updated",
    (data) => {

        console.log(
            "RESULTS UPDATED:",
            data
        );

    }
);

socket.on(
    "connect_error",
    (error) => {

        console.error(
            "Socket connection error:",
            error.message
        );

    }
);

socket.on(
    "disconnect",
    (reason) => {

        console.log(
            "Socket disconnected:",
            reason
        );

    }
);