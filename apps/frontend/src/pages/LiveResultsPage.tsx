import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link,
    useSearchParams
} from "react-router-dom";

import {
    getLiveResults
} from "../services/liveResultsService";

import type {
    LiveResults
} from "../services/liveResultsService";

import {
    connectResultsSocket,
    joinElection,
    leaveElection,
    onResultsUpdated,
    removeResultsUpdatedListener
} from "../services/resultsSocket";


export default function LiveResultsPage() {

    /*
    |--------------------------------------------------------------------------
    | Election ID
    |--------------------------------------------------------------------------
    |
    | Expected URL:
    |
    | /results?election=ELECTION_ID
    |
    */

    const [
        searchParams
    ] = useSearchParams();


    const electionId =
        searchParams.get("election")?.trim() || null;


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        results,
        setResults
    ] = useState<LiveResults | null>(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState<string | null>(null);


    const [
        socketConnected,
        setSocketConnected
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Debug
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        console.log(
            "LiveResultsPage electionId:",
            electionId
        );

        console.log(
            "Current URL:",
            window.location.href
        );

    }, [electionId]);


    /*
    |--------------------------------------------------------------------------
    | Load Results
    |--------------------------------------------------------------------------
    */

    const loadResults =
        useCallback(
            async () => {

                /*
                |--------------------------------------------------------------------------
                | Validate election ID
                |--------------------------------------------------------------------------
                */

                if (!electionId) {

                    setResults(null);

                    setError(
                        "No election was selected. Please select an election first."
                    );

                    setLoading(false);

                    return;

                }


                try {

                    setLoading(true);

                    setError(null);


                    console.log(
                        "Loading results for election:",
                        electionId
                    );


                    const data =
                        await getLiveResults(
                            electionId
                        );


                    console.log(
                        "Live results received:",
                        data
                    );


                    setResults(data);

                } catch (error: unknown) {

                    console.error(
                        "Failed to load live results:",
                        error
                    );


                    const message =
                        error instanceof Error
                            ? error.message
                            : "Failed to load live results";


                    setResults(null);

                    setError(message);

                } finally {

                    setLoading(false);

                }

            },
            [electionId]
        );


    /*
    |--------------------------------------------------------------------------
    | Load Results When Election Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadResults();

    }, [loadResults]);


    /*
    |--------------------------------------------------------------------------
    | Socket.IO
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        /*
        |--------------------------------------------------------------------------
        | No election selected
        |--------------------------------------------------------------------------
        |
        | Do not connect/join an election room when there is no election ID.
        |
        */

        if (!electionId) {

            setSocketConnected(false);

            return;

        }


        console.log(
            "Connecting to results socket for election:",
            electionId
        );


        /*
        |--------------------------------------------------------------------------
        | Connect
        |--------------------------------------------------------------------------
        */

        const socket =
            connectResultsSocket();


        /*
        |--------------------------------------------------------------------------
        | Socket Connected
        |--------------------------------------------------------------------------
        */

        const handleConnect =
            () => {

                console.log(
                    "Live Results Socket connected:",
                    socket.id
                );


                setSocketConnected(true);


                /*
                |--------------------------------------------------------------------------
                | Join election room after connection
                |--------------------------------------------------------------------------
                */

                joinElection(
                    electionId
                );

            };


        /*
        |--------------------------------------------------------------------------
        | Socket Disconnected
        |--------------------------------------------------------------------------
        */

        const handleDisconnect =
            () => {

                console.log(
                    "Live Results Socket disconnected"
                );


                setSocketConnected(false);

            };


        /*
        |--------------------------------------------------------------------------
        | Results Updated
        |--------------------------------------------------------------------------
        */

        const handleResultsUpdated =
            (
                data: {
                    electionId: string;
                    updatedAt: string;
                }
            ) => {

                console.log(
                    "LIVE RESULTS UPDATED:",
                    data
                );


                /*
                |--------------------------------------------------------------------------
                | Ignore updates belonging to another election
                |--------------------------------------------------------------------------
                */

                if (
                    data.electionId !==
                    electionId
                ) {

                    return;

                }


                /*
                |--------------------------------------------------------------------------
                | Reload latest results
                |--------------------------------------------------------------------------
                */

                loadResults();

            };


        /*
        |--------------------------------------------------------------------------
        | Register Listeners
        |--------------------------------------------------------------------------
        */

        socket.on(
            "connect",
            handleConnect
        );


        socket.on(
            "disconnect",
            handleDisconnect
        );


        onResultsUpdated(
            handleResultsUpdated
        );


        /*
        |--------------------------------------------------------------------------
        | Already Connected
        |--------------------------------------------------------------------------
        |
        | If connectResultsSocket() returns an already-connected socket,
        | the "connect" event will not fire again.
        |
        */

        if (socket.connected) {

            setSocketConnected(true);

            joinElection(
                electionId
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */

        return () => {

            console.log(
                "Cleaning up results socket for election:",
                electionId
            );


            removeResultsUpdatedListener(
                handleResultsUpdated
            );


            socket.off(
                "connect",
                handleConnect
            );


            socket.off(
                "disconnect",
                handleDisconnect
            );


            leaveElection(
                electionId
            );


            setSocketConnected(false);

        };

    }, [
        electionId,
        loadResults
    ]);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="results-page">

                <header className="results-navbar">

                    <div className="results-container">

                        <Link
                            to="/"
                            className="results-logo"
                        >
                            ERMS
                        </Link>


                        <nav className="results-nav">

                            <Link to="/">
                                Home
                            </Link>


                            <Link to="/elections">
                                Elections
                            </Link>


                            <Link
                                to="/results"
                                className="active"
                            >
                                Live Results
                            </Link>


                            <Link
                                to="/login"
                                className="results-login"
                            >
                                Login
                            </Link>

                        </nav>

                    </div>

                </header>


                <main className="results-loading">

                    <div className="loading-spinner" />


                    <h2>
                        Loading Live Results
                    </h2>


                    <p>
                        Connecting to the election results service...
                    </p>

                </main>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

if (error) {

    return (

        <div className="results-page">

            <header className="results-navbar">

                <div className="results-container">

                    <Link
                        to="/"
                        className="results-logo"
                    >
                        ERMS
                    </Link>


                    <nav className="results-nav">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/elections">
                            Elections
                        </Link>

                        <Link
                            to="/results"
                            className="active"
                        >
                            Live Results
                        </Link>

                        <Link
                            to="/login"
                            className="results-login"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>


            <main className="results-error-container">

                <div className="results-error-card">

                    <div className="error-icon">
                        !
                    </div>


                    <h1>
                        {electionId
                            ? "Unable to Load Results"
                            : "Select an Election"
                        }
                    </h1>


                    <p>
                        {electionId
                            ? error
                            : "Please select an election to view its live results."
                        }
                    </p>


                    <Link
                        to="/elections"
                        className="results-primary-button"
                    >
                        View Elections →
                    </Link>

                </div>

            </main>

        </div>

    );

}

    /*
    |--------------------------------------------------------------------------
    | No Results
    |--------------------------------------------------------------------------
    */

    if (!results) {

        return null;

    }


    /*
    |--------------------------------------------------------------------------
    | Results Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="results-page">


            {/* =========================================================
                NAVBAR
            ========================================================= */}

            <header className="results-navbar">

                <div className="results-container">

                    <Link
                        to="/"
                        className="results-logo"
                    >
                        ERMS
                    </Link>


                    <nav className="results-nav">

                        <Link to="/">
                            Home
                        </Link>


                        <Link to="/elections">
                            Elections
                        </Link>


                        <Link
                            to="/results"
                            className="active"
                        >
                            Live Results
                        </Link>


                        <Link
                            to="/login"
                            className="results-login"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>


            {/* =========================================================
                PAGE HEADER
            ========================================================= */}

            <main>

                <section className="results-hero">

                    <div className="results-container">

                        <div className="results-hero-content">

                            <div>

                                <Link
                                    to="/elections"
                                    className="results-back-link"
                                >
                                    ← Back to Elections
                                </Link>


                                <span className="results-eyebrow">
                                    LIVE ELECTION RESULTS
                                </span>


                                <h1>
                                    {results.election.name}
                                </h1>


                                <p>
                                    {results.election.year}
                                    {" "}Election
                                    {" "}·{" "}
                                    Results are updated in real time
                                </p>

                            </div>


                            <div
                                className={
                                    socketConnected
                                        ? "results-live-status connected"
                                        : "results-live-status"
                                }
                            >

                                <span />

                                {socketConnected
                                    ? "LIVE"
                                    : "CONNECTING..."
                                }

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    RESULTS CONTENT
                ===================================================== */}

                <section className="results-content">

                    <div className="results-container">


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <div className="results-summary-grid">


                            <div className="results-summary-card">

                                <span>
                                    Total Votes
                                </span>


                                <strong>
                                    {results.summary.totalVotes.toLocaleString()}
                                </strong>

                            </div>


                            <div className="results-summary-card">

                                <span>
                                    Registered Voters
                                </span>


                                <strong>
                                    {results.summary.registeredVoters.toLocaleString()}
                                </strong>

                            </div>


                            <div className="results-summary-card">

                                <span>
                                    Voter Turnout
                                </span>


                                <strong>
                                    {results.summary.turnoutPercentage}%
                                </strong>

                            </div>


                            <div className="results-summary-card">

                                <span>
                                    Reporting
                                </span>


                                <strong>
                                    {results.summary.reportingPercentage}%
                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            LEADER
                        ================================================= */}

                        {results.leader && (

                            <div className="results-leader-card">

                                <div className="leader-content">

                                    <span className="leader-label">
                                        CURRENT LEADER
                                    </span>


                                    <h2>
                                        {results.leader.candidate}
                                    </h2>


                                    <p>
                                        Leading candidate based on
                                        currently reported results.
                                    </p>

                                </div>


                                <div className="leader-votes">

                                    <strong>
                                        {results.leader.votes.toLocaleString()}
                                    </strong>


                                    <span>
                                        votes
                                    </span>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            LEADERBOARD
                        ================================================= */}

                        <div className="results-board-card">

                            <div className="results-board-header">

                                <div>

                                    <span>
                                        RESULTS
                                    </span>


                                    <h2>
                                        Live Candidate Results
                                    </h2>

                                </div>


                                <div className="stations-reporting">

                                    <strong>
                                        {
                                            results.summary
                                                .reportedPollingStations
                                        }
                                        /
                                        {
                                            results.summary
                                                .totalPollingStations
                                        }
                                    </strong>


                                    <span>
                                        stations reporting
                                    </span>

                                </div>

                            </div>


                            <div className="candidate-list">

                                {results.leaderboard.map(
                                    (candidate) => (

                                        <div
                                            key={
                                                candidate.candidateId
                                            }
                                            className="candidate-row"
                                        >

                                            <div className="candidate-rank">

                                                #
                                                {candidate.rank}

                                            </div>


                                            <div className="candidate-main">

                                                <div className="candidate-name-row">

                                                    <strong>
                                                        {candidate.candidate}
                                                    </strong>


                                                    <span>
                                                        {candidate.percentage}%
                                                    </span>

                                                </div>


                                                <div className="candidate-progress">

                                                    <div
                                                        className="candidate-progress-fill"
                                                        style={{
                                                            width:
                                                                `${candidate.percentage}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>


                                            <div className="candidate-vote-count">

                                                <strong>
                                                    {candidate.votes.toLocaleString()}
                                                </strong>


                                                <span>
                                                    votes
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            LAST UPDATED
                        ================================================= */}

                        <div className="results-last-updated">

                            <span className="update-dot" />


                            <span>
                                Last updated:
                            </span>


                            <strong>
                                {
                                    new Date(
                                        results.lastUpdated
                                    ).toLocaleString()
                                }
                            </strong>

                        </div>

                    </div>

                </section>

            </main>


            {/* =========================================================
                FOOTER
            ========================================================= */}

            <footer className="results-footer">

                <div className="results-container">

                    <div className="results-footer-content">

                        <div>

                            <strong>
                                ERMS
                            </strong>


                            <p>
                                Election Results Management System
                            </p>

                        </div>


                        <div>

                            <Link to="/">
                                Home
                            </Link>


                            <Link to="/elections">
                                Elections
                            </Link>


                            <Link to="/results">
                                Live Results
                            </Link>

                        </div>


                        <div>

                            <p>
                                © 2026 ERMS
                            </p>

                        </div>

                    </div>

                </div>

            </footer>

        </div>

    );

}