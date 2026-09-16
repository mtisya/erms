import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    Link
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


const ELECTION_ID =
    "cms5oy6n50000sxictbo7vuug";


export default function Home() {

    const [
        results,
        setResults
    ] = useState<LiveResults | null>(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        socketConnected,
        setSocketConnected
    ] = useState(false);


    const loadResults =
        useCallback(
            async () => {

                try {

                    const data =
                        await getLiveResults(
                            ELECTION_ID
                        );

                    setResults(data);

                } catch (error) {

                    console.error(
                        "Failed to load homepage results:",
                        error
                    );

                } finally {

                    setLoading(false);

                }

            },
            []
        );


useEffect(() => {
    /*
    |--------------------------------------------------------------------------
    | Initial API Load
    |--------------------------------------------------------------------------
    */

    const loadTimer = window.setTimeout(() => {
        void loadResults();
    }, 0);

    /*
    |--------------------------------------------------------------------------
    | Socket.IO
    |--------------------------------------------------------------------------
    */

    const socket =
        connectResultsSocket();

    const handleConnect = () => {
        console.log(
            "Home Socket connected:",
            socket.id
        );

        setSocketConnected(true);
    };

    const handleDisconnect = () => {
        console.log(
            "Home Socket disconnected"
        );

        setSocketConnected(false);
    };

    socket.on(
        "connect",
        handleConnect
    );

    socket.on(
        "disconnect",
        handleDisconnect
    );

    /*
    |--------------------------------------------------------------------------
    | Join Election
    |--------------------------------------------------------------------------
    */

    joinElection(
        ELECTION_ID
    );

    /*
    |--------------------------------------------------------------------------
    | Results Updated
    |--------------------------------------------------------------------------
    */

    const handleResultsUpdated = (
        data: {
            electionId: string;
            updatedAt: string;
        }
    ) => {
        console.log(
            "HOME RESULTS UPDATED:",
            data
        );

        if (
            data.electionId !==
            ELECTION_ID
        ) {
            return;
        }

        void loadResults();
    };

    onResultsUpdated(
        handleResultsUpdated
    );

    /*
    |--------------------------------------------------------------------------
    | Already Connected
    |--------------------------------------------------------------------------
    */

    if (socket.connected) {
        window.setTimeout(() => {
            setSocketConnected(true);
        }, 0);
    }

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {
        window.clearTimeout(
            loadTimer
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
            ELECTION_ID
        );
    };
}, [loadResults]);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="home-page">

                <div className="home-loading">

                    Loading ERMS...

                </div>

            </div>

        );

    }


    return (

        <div className="home-page">


            {/* =========================================================
                NAVBAR
            ========================================================= */}

            <header className="home-navbar">

                <div className="home-container">

                    <Link
                        to="/"
                        className="home-logo"
                    >
                        ERMS
                    </Link>


                    <nav className="home-nav">

                        <Link
                            to="/"
                            className="active"
                        >
                            Home
                        </Link>


                        <Link
                            to="/elections"
                        >
                            Elections
                        </Link>


                        <Link to="/elections">
                            Live Results
                        </Link>


                        <Link
                            to="/login"
                            className="nav-login"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>


            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="home-hero">

                <div className="home-container">

                    <div className="hero-grid">


                        <div className="hero-content">

                            <span className="hero-badge">
                                Election Results Management System
                            </span>


                            <h1>

                                Secure.

                                <span>
                                    Transparent.
                                </span>

                                Real-Time.

                            </h1>


                            <p>

                                ERMS provides a centralized platform
                                for managing elections, candidates,
                                polling stations and election results
                                with real-time monitoring.

                            </p>


                            <div className="hero-actions">

                                <Link
                                    to="/elections"
                                    className="primary-button"
                                >
                                    View Elections
                                </Link>


                                <Link
                                    to="/results"
                                    className="secondary-button"
                                >
                                    View Live Results
                                </Link>

                            </div>

                        </div>


                        {/* =================================================
                            LIVE PREVIEW
                        ================================================= */}

                        <div className="hero-results-card">

                            <div className="results-card-header">

                                <div>

                                    <small>
                                        CURRENT ELECTION
                                    </small>

                                    <h2>
                                        {results?.election.name}
                                    </h2>

                                    <span>
                                        {results?.election.year} Election
                                    </span>

                                </div>


                                <div
                                    className={
                                        socketConnected
                                            ? "live-status connected"
                                            : "live-status"
                                    }
                                >

                                    <span />

                                    {socketConnected
                                        ? "LIVE"
                                        : "CONNECTING"
                                    }

                                </div>

                            </div>


                            {results?.leader && (

                                <div className="preview-leader">

                                    <small>
                                        CURRENT LEADER
                                    </small>

                                    <strong>
                                        {results.leader.candidate}
                                    </strong>

                                    <span>
                                        {results.leader.votes.toLocaleString()}
                                        {" "}
                                        votes
                                    </span>

                                </div>

                            )}


                            <div className="preview-summary">

                                <div>

                                    <small>
                                        Total Votes
                                    </small>

                                    <strong>
                                        {results?.summary.totalVotes.toLocaleString()}
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        Turnout
                                    </small>

                                    <strong>
                                        {results?.summary.turnoutPercentage}%
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        Reporting
                                    </small>

                                    <strong>
                                        {results?.summary.reportingPercentage}%
                                    </strong>

                                </div>

                            </div>


                            <Link
                                to="/results"
                                className="results-card-link"
                            >
                                View Full Results →
                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                FEATURES
            ========================================================= */}

            <section className="home-section">

                <div className="home-container">

                    <div className="section-heading">

                        <span>
                            PLATFORM
                        </span>

                        <h2>
                            Everything You Need to Manage Elections
                        </h2>

                        <p>
                            ERMS brings election administration,
                            geographic management and real-time
                            results monitoring into one platform.
                        </p>

                    </div>


                    <div className="feature-grid">


                        <div className="feature-card">

                            <div className="feature-icon">
                                🗳️
                            </div>

                            <h3>
                                Election Management
                            </h3>

                            <p>
                                Create and manage elections,
                                positions and election schedules
                                from one centralized platform.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                👥
                            </div>

                            <h3>
                                Candidate Management
                            </h3>

                            <p>
                                Manage candidates and their
                                participation across election
                                positions.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                📊
                            </div>

                            <h3>
                                Real-Time Results
                            </h3>

                            <p>
                                Monitor incoming election results
                                instantly using Socket.IO real-time
                                updates.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                📍
                            </div>

                            <h3>
                                Geographic Management
                            </h3>

                            <p>
                                Organize counties, constituencies,
                                wards and polling stations.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                🔐
                            </div>

                            <h3>
                                Secure Access
                            </h3>

                            <p>
                                Role-based access provides controlled
                                access to election administration.
                            </p>

                        </div>


                        <div className="feature-card">

                            <div className="feature-icon">
                                📋
                            </div>

                            <h3>
                                Audit &amp; Monitoring
                            </h3>

                            <p>
                                Track important election activities
                                and system operations.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                STATISTICS
            ========================================================= */}

            <section className="home-statistics">

                <div className="home-container">

                    <div className="statistics-grid">


                        <div>
                            <strong>
                                {results?.summary.totalPollingStations ?? 0}
                            </strong>

                            <span>
                                Polling Stations
                            </span>
                        </div>


                        <div>
                            <strong>
                                {results?.summary.reportedPollingStations ?? 0}
                            </strong>

                            <span>
                                Stations Reporting
                            </span>
                        </div>


                        <div>
                            <strong>
                                {results?.summary.totalVotes.toLocaleString() ?? "0"}
                            </strong>

                            <span>
                                Votes Counted
                            </span>
                        </div>


                        <div>
                            <strong>
                                {results?.summary.turnoutPercentage ?? 0}%
                            </strong>

                            <span>
                                Voter Turnout
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                CTA
            ========================================================= */}

            <section className="home-cta">

                <div className="home-container">

                    <div>

                        <h2>
                            Follow Election Results in Real Time
                        </h2>

                        <p>
                            Stay informed as results are received
                            and processed from polling stations.
                        </p>

                        <Link
                            to="/results"
                            className="cta-button"
                        >
                            View Live Results
                        </Link>

                    </div>

                </div>

            </section>


            {/* =========================================================
                FOOTER
            ========================================================= */}

            <footer className="home-footer">

                <div className="home-container">

                    <div className="footer-content">

                        <div>

                            <strong>
                                ERMS
                            </strong>

                            <p>
                                Election Results Management System
                            </p>

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