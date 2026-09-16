import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";


interface Candidate {

    id: string;

    name?: string;

    candidateName?: string;

    party?: string;

    partyName?: string;

    positionId?: string;

}


interface Position {

    id: string;

    name: string;

    candidates?: Candidate[];

}


interface Election {

    id: string;

    name: string;

    year: number;

    status?: string;

    description?: string;

    startDate?: string;

    endDate?: string;

    positions?: Position[];

    _count?: {

        positions?: number;

        candidates?: number;

        results?: number;

    };

}


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


export default function ElectionDetails() {

    const {
        id
    } = useParams();


    const [
        election,
        setElection
    ] = useState<Election | null>(null);


    const [loading, setLoading] = useState(Boolean(id));


    const [
        error,
        setError
    ] = useState<string | null>(null);


    /*
    |--------------------------------------------------------------------------
    | Load Election
    |--------------------------------------------------------------------------
    */

  useEffect(() => {
    if (!id) {
        return;
    }


        const loadElection =
            async () => {

                try {

                    setLoading(true);

                    setError(null);


                    const response =
                        await fetch(
                            `${API_URL}/elections/${id}`
                        );


                    if (!response.ok) {

                        throw new Error(
                            `Failed to load election (${response.status})`
                        );

                    }


                    const data =
                        await response.json();


                    /*
                    |--------------------------------------------------------------------------
                    | Support:
                    |
                    | { ...election }
                    |
                    | OR
                    |
                    | { data: { ...election } }
                    |--------------------------------------------------------------------------
                    */

                    const electionData =
                        data?.data ??
                        data;


                    setElection(
                        electionData
                    );

                    } catch (error: unknown) {

                    console.error(
                        "Failed to load election:",
                        error
                    );


                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load election"
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadElection();

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    const getStatus =
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
                    className: "details-status-live"
                };

            }


            if (
                normalized === "completed" ||
                normalized === "closed"
            ) {

                return {
                    label: "Completed",
                    className: "details-status-completed"
                };

            }


            if (
                normalized === "upcoming" ||
                normalized === "scheduled"
            ) {

                return {
                    label: "Upcoming",
                    className: "details-status-upcoming"
                };

            }


            return {
                label: status || "Election",
                className: "details-status-default"
            };

        };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="election-details-page">

                <header className="details-navbar">

                    <div className="details-container">

                        <Link
                            to="/"
                            className="details-logo"
                        >
                            ERMS
                        </Link>


                        <nav className="details-nav">

                            <Link to="/">
                                Home
                            </Link>

                            <Link
                                to="/elections"
                                className="active"
                            >
                                Elections
                            </Link>

                            {/* <Link to="/results">
                                Live Results
                            </Link> */}
                            <Link to="/elections">
                                Live Results
                            </Link>

                            <Link
                                to="/login"
                                className="details-login"
                            >
                                Login
                            </Link>

                        </nav>

                    </div>

                </header>


                <main className="details-loading">

                    <div className="details-spinner" />

                    <h2>
                        Loading Election
                    </h2>

                    <p>
                        Retrieving election information...
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

    if (error || !election) {

        return (

            <div className="election-details-page">

                <header className="details-navbar">

                    <div className="details-container">

                        <Link
                            to="/"
                            className="details-logo"
                        >
                            ERMS
                        </Link>


                        <nav className="details-nav">

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


                <main className="details-error-container">

                    <div className="details-error-card">

                        <div className="details-error-icon">
                            !
                        </div>


                        <h1>
                            Election Not Found
                        </h1>


                        <p>
                            {error ||
                                "The requested election could not be found."}
                        </p>


                        <Link
                            to="/elections"
                            className="details-primary-button"
                        >
                            ← Back to Elections
                        </Link>

                    </div>

                </main>

            </div>

        );

    }


    const status =
        getStatus(
            election.status
        );


    return (

        <div className="election-details-page">


            {/* =========================================================
                NAVBAR
            ========================================================= */}

            <header className="details-navbar">

                <div className="details-container">

                    <Link
                        to="/"
                        className="details-logo"
                    >
                        ERMS
                    </Link>


                    <nav className="details-nav">

                        <Link to="/">
                            Home
                        </Link>


                        <Link
                            to="/elections"
                            className="active"
                        >
                            Elections
                        </Link>


                        <Link
                            to={`/results?election=${election.id}`}
                        >
                            Live Results
                        </Link>


                        <Link
                            to="/login"
                            className="details-login"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>


            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="details-hero">

                <div className="details-container">

                    <Link
                        to="/elections"
                        className="details-back-link"
                    >
                        ← Back to Elections
                    </Link>


                    <div className="details-hero-content">

                        <div>

                            <span className="details-eyebrow">
                                ELECTION DETAILS
                            </span>


                            <h1>
                                {election.name}
                            </h1>


                            <p>
                                {election.year} Election
                            </p>

                        </div>


                        <span
                            className={
                                `details-status ${status.className}`
                            }
                        >

                            {status.label}

                        </span>

                    </div>

                </div>

            </section>


            {/* =========================================================
                CONTENT
            ========================================================= */}

            <main className="details-content">

                <div className="details-container">


                    {/* =================================================
                        OVERVIEW
                    ================================================= */}

                    <section className="details-overview-grid">


                        <div className="details-overview-card">

                            <span>
                                ELECTION YEAR
                            </span>

                            <strong>
                                {election.year}
                            </strong>

                        </div>


                        <div className="details-overview-card">

                            <span>
                                POSITIONS
                            </span>

                            <strong>
                                {
                                    election._count?.positions ??
                                    election.positions?.length ??
                                    0
                                }
                            </strong>

                        </div>


                        <div className="details-overview-card">

                            <span>
                                CANDIDATES
                            </span>

                            <strong>
                                {
                                    election._count?.candidates ??
                                    election.positions?.reduce(
                                        (
                                            total,
                                            position
                                        ) =>
                                            total +
                                            (
                                                position.candidates?.length ||
                                                0
                                            ),
                                        0
                                    ) ??
                                    0
                                }
                            </strong>

                        </div>


                        <div className="details-overview-card">

                            <span>
                                STATUS
                            </span>

                            <strong>
                                {status.label}
                            </strong>

                        </div>

                    </section>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {election.description && (

                        <section className="details-section">

                            <div className="details-section-heading">

                                <span>
                                    OVERVIEW
                                </span>

                                <h2>
                                    About This Election
                                </h2>

                            </div>


                            <div className="details-description-card">

                                <p>
                                    {election.description}
                                </p>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        DATES
                    ================================================= */}

                    {(election.startDate ||
                        election.endDate) && (

                            <section className="details-section">

                                <div className="details-section-heading">

                                    <span>
                                        SCHEDULE
                                    </span>

                                    <h2>
                                        Election Timeline
                                    </h2>

                                </div>


                                <div className="details-timeline">

                                    {election.startDate && (

                                        <div className="timeline-item">

                                            <div className="timeline-dot" />

                                            <div>

                                                <span>
                                                    START DATE
                                                </span>

                                                <strong>
                                                    {new Date(
                                                        election.startDate
                                                    ).toLocaleString()}
                                                </strong>

                                            </div>

                                        </div>

                                    )}


                                    {election.endDate && (

                                        <div className="timeline-item">

                                            <div className="timeline-dot" />

                                            <div>

                                                <span>
                                                    END DATE
                                                </span>

                                                <strong>
                                                    {new Date(
                                                        election.endDate
                                                    ).toLocaleString()}
                                                </strong>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </section>

                        )}


                    {/* =================================================
                        POSITIONS
                    ================================================= */}

                    <section className="details-section">

                        <div className="details-section-heading">

                            <span>
                                CONTESTS
                            </span>

                            <h2>
                                Positions & Candidates
                            </h2>

                        </div>


                        {election.positions &&
                            election.positions.length > 0 ? (

                            <div className="positions-list">

                                {election.positions.map(
                                    (position) => (

                                        <div
                                            key={position.id}
                                            className="position-card"
                                        >

                                            <div className="position-header">

                                                <div>

                                                    <span>
                                                        POSITION
                                                    </span>

                                                    <h3>
                                                        {position.name}
                                                    </h3>

                                                </div>


                                                <span className="candidate-count">

                                                    {
                                                        position.candidates?.length ||
                                                        0
                                                    }

                                                    {" "}

                                                    {
                                                        position.candidates?.length === 1
                                                            ? "Candidate"
                                                            : "Candidates"
                                                    }

                                                </span>

                                            </div>


                                            {position.candidates &&
                                                position.candidates.length > 0 ? (

                                                <div className="details-candidates">

                                                    {position.candidates.map(
                                                        (
                                                            candidate,
                                                            index
                                                        ) => (

                                                            <div
                                                                key={
                                                                    candidate.id
                                                                }
                                                                className="details-candidate"
                                                            >

                                                                <div className="candidate-number">

                                                                    {index + 1}

                                                                </div>


                                                                <div className="candidate-details">

                                                                    <strong>
                                                                        {
                                                                            candidate.name ||
                                                                            candidate.candidateName ||
                                                                            "Unnamed Candidate"
                                                                        }
                                                                    </strong>


                                                                    {(candidate.party ||
                                                                        candidate.partyName) && (

                                                                            <span>
                                                                                {
                                                                                    candidate.party ||
                                                                                    candidate.partyName
                                                                                }
                                                                            </span>

                                                                        )}

                                                                </div>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            ) : (

                                                <div className="no-candidates">

                                                    No candidates available
                                                    for this position.

                                                </div>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="details-empty">

                                <h3>
                                    No Positions Available
                                </h3>

                                <p>
                                    Position information for this
                                    election is not currently available.
                                </p>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <section className="details-actions">

                        <div>

                            <span>
                                FOLLOW THE RESULTS
                            </span>

                            <h2>
                                Track this election live
                            </h2>

                            <p>
                                View the latest reported results and
                                monitor vote updates in real time.
                            </p>

                        </div>


                        <Link
        to={`/results?election=${encodeURIComponent(election.id)}`}
        className="details-results-button"
    >
        View Live Results →
    </Link>

                    </section>

                </div>

            </main>


            {/* =========================================================
                FOOTER
            ========================================================= */}

            <footer className="details-footer">

                <div className="details-container">

                    <div className="details-footer-content">

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