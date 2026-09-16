import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";


/*
|--------------------------------------------------------------------------
| Election Type
|--------------------------------------------------------------------------
*/

interface Election {

    id: string;

    name: string;

    year: number;

    status?: string;

    description?: string;

    _count?: {

        positions?: number;

        candidates?: number;

    };

}


/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
*/

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


/*
|--------------------------------------------------------------------------
| Elections Page
|--------------------------------------------------------------------------
*/

export default function Elections() {

    const [
        elections,
        setElections
    ] = useState<Election[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState<string | null>(null);


    /*
    |--------------------------------------------------------------------------
    | Load Elections
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const loadElections =
            async () => {

                try {

                    setLoading(true);

                    setError(null);


                    const response =
                        await fetch(
                            `${API_URL}/elections`
                        );


                    if (!response.ok) {

                        throw new Error(
                            `Failed to load elections (${response.status})`
                        );

                    }


                    const data =
                        await response.json();


                    /*
                    |--------------------------------------------------------------------------
                    | Support common API response structures
                    |--------------------------------------------------------------------------
                    |
                    | Direct:
                    | [
                    |   {...}
                    | ]
                    |
                    | Or:
                    |
                    | {
                    |   data: [...]
                    | }
                    |
                    */

                    const electionData =
                        Array.isArray(data)
                            ? data
                            : Array.isArray(data.data)
                                ? data.data
                                : [];


                    setElections(
                        electionData
                    );

                } catch (error: any) {

                    console.error(
                        "Failed to load elections:",
                        error
                    );


                    setError(
                        error.message ||
                        "Failed to load elections"
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadElections();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Status Helper
    |--------------------------------------------------------------------------
    */

    const getElectionStatus =
        (
            status?: string
        ) => {

            const normalized =
                status?.toLowerCase();


            if (
                normalized === "active" ||
                normalized === "ongoing" ||
                normalized === "live"
            ) {

                return {
                    label: "Live",
                    className: "election-status-live"
                };

            }


            if (
                normalized === "completed" ||
                normalized === "closed"
            ) {

                return {
                    label: "Completed",
                    className: "election-status-completed"
                };

            }


            if (
                normalized === "upcoming" ||
                normalized === "scheduled"
            ) {

                return {
                    label: "Upcoming",
                    className: "election-status-upcoming"
                };

            }


            return {
                label: status || "Election",
                className: "election-status-default"
            };

        };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="elections-page">

                <header className="elections-navbar">

                    <div className="elections-container">

                        <Link
                            to="/"
                            className="elections-logo"
                        >
                            ERMS
                        </Link>


                        <nav className="elections-nav">

                            <Link to="/">
                                Home
                            </Link>

                            <Link
                                to="/elections"
                                className="active"
                            >
                                Elections
                            </Link>

                            <Link to="/results">
                                Live Results
                            </Link>

                            <Link
                                to="/login"
                                className="elections-login"
                            >
                                Login
                            </Link>

                        </nav>

                    </div>

                </header>


                <main className="elections-loading">

                    <div className="elections-spinner" />

                    <h2>
                        Loading Elections
                    </h2>

                    <p>
                        Retrieving available elections...
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

            <div className="elections-page">

                <header className="elections-navbar">

                    <div className="elections-container">

                        <Link
                            to="/"
                            className="elections-logo"
                        >
                            ERMS
                        </Link>


                        <nav className="elections-nav">

                            <Link to="/">
                                Home
                            </Link>

                            <Link
                                to="/elections"
                                className="active"
                            >
                                Elections
                            </Link>

                            <Link to="/results">
                                Live Results
                            </Link>

                        </nav>

                    </div>

                </header>


                <main className="elections-error-container">

                    <div className="elections-error-card">

                        <div className="elections-error-icon">
                            !
                        </div>


                        <h1>
                            Unable to Load Elections
                        </h1>


                        <p>
                            {error}
                        </p>


                        <button
                            onClick={() => window.location.reload()}
                            className="elections-primary-button"
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    return (

        <div className="elections-page">


            {/* =========================================================
                NAVBAR
            ========================================================= */}

            <header className="elections-navbar">

                <div className="elections-container">

                    <Link
                        to="/"
                        className="elections-logo"
                    >
                        ERMS
                    </Link>


                    <nav className="elections-nav">

                        <Link to="/">
                            Home
                        </Link>


                        <Link
                            to="/elections"
                            className="active"
                        >
                            Elections
                        </Link>


                        <Link to="/results">
                            Live Results
                        </Link>


                        <Link
                            to="/login"
                            className="elections-login"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>


            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="elections-hero">

                <div className="elections-container">

                    <Link
                        to="/"
                        className="elections-back-link"
                    >
                        ← Back to Home
                    </Link>


                    <span className="elections-eyebrow">
                        ELECTIONS
                    </span>


                    <h1>
                        Elections
                    </h1>


                    <p>
                        Explore elections, view available information,
                        and follow live results as votes are reported.
                    </p>

                </div>

            </section>


            {/* =========================================================
                ELECTION LIST
            ========================================================= */}

            <main className="elections-content">

                <div className="elections-container">


                    <div className="elections-section-header">

                        <div>

                            <span>
                                ELECTION DIRECTORY
                            </span>

                            <h2>
                                Available Elections
                            </h2>

                        </div>


                        <div className="elections-count">

                            {elections.length}

                            {" "}

                            {elections.length === 1
                                ? "Election"
                                : "Elections"
                            }

                        </div>

                    </div>


                    {elections.length === 0 ? (

                        <div className="elections-empty">

                            <div className="elections-empty-icon">
                                —
                            </div>


                            <h2>
                                No Elections Available
                            </h2>


                            <p>
                                There are currently no elections
                                available to display.
                            </p>

                        </div>

                    ) : (

                        <div className="elections-grid">

                            {elections.map(
                                (election) => {

                                    const status =
                                        getElectionStatus(
                                            election.status
                                        );


                                    return (

                                        <article
                                            key={election.id}
                                            className="election-card"
                                        >


                                            <div className="election-card-top">

                                                <span
                                                    className={
                                                        `election-status ${status.className}`
                                                    }
                                                >

                                                    {status.label}

                                                </span>


                                                <span className="election-year">

                                                    {election.year}

                                                </span>

                                            </div>


                                            <div className="election-card-body">

                                                <div className="election-icon">

                                                    🗳️

                                                </div>


                                                <h3>
                                                    {election.name}
                                                </h3>


                                                {election.description && (

                                                    <p>
                                                        {election.description}
                                                    </p>

                                                )}

                                            </div>


                                            <div className="election-card-meta">

                                                {election._count?.positions !== undefined && (

                                                    <span>

                                                        <strong>
                                                            {election._count.positions}
                                                        </strong>

                                                        {" "}

                                                        Positions

                                                    </span>

                                                )}


                                                {election._count?.candidates !== undefined && (

                                                    <span>

                                                        <strong>
                                                            {election._count.candidates}
                                                        </strong>

                                                        {" "}

                                                        Candidates

                                                    </span>

                                                )}

                                            </div>


                                            <div className="election-card-footer">

                                                <Link
                                                    to={`/results?election=${election.id}`}
                                                    className="election-results-button"
                                                >
                                                    View Results
                                                </Link>


                                                <Link
                                                    to={`/elections/${election.id}`}
                                                    className="election-details-link"
                                                >
                                                    Details →
                                                </Link>

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </main>


            {/* =========================================================
                FOOTER
            ========================================================= */}

            <footer className="elections-footer">

                <div className="elections-container">

                    <div className="elections-footer-content">


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


                        <p>
                            © 2026 ERMS
                        </p>

                    </div>

                </div>

            </footer>

        </div>

    );

}