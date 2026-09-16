import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useSearchParams
} from "react-router-dom";


/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface Election {

    id: string;

    name: string;

    year: number;

}


interface Candidate {

    id: string;

    name: string;

    electionId: string;

    positionId: string;

    position?: {

        id: string;

        name: string;

    };

}


interface PollingStation {

    id: string;

    name: string;

    code: string;

    registeredVoters: number;

    ward?: {

        name: string;

        constituency?: {

            name: string;

            county?: {

                name: string;

            };

        };

    };

}


interface ExistingResult {

    id: string;

    electionId: string;

    candidateId: string;

    pollingStationId: string;

    votes: number;

    status: string;

}


interface VoteEntry {

    candidateId: string;

    votes: string;

    resultId?: string;

}


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


/*
|--------------------------------------------------------------------------
| Admin Result Entry
|--------------------------------------------------------------------------
*/

export default function AdminResultEntry() {


    const [
        searchParams
    ] = useSearchParams();


    const electionId =
        searchParams.get("election");


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        election,
        setElection
    ] = useState<Election | null>(null);


    const [
        candidates,
        setCandidates
    ] = useState<Candidate[]>([]);


    const [
        pollingStations,
        setPollingStations
    ] = useState<PollingStation[]>([]);


    const [
        selectedStation,
        setSelectedStation
    ] = useState("");


    const [
        votes,
        setVotes
    ] = useState<VoteEntry[]>([]);


    const [
        existingResults,
        setExistingResults
    ] = useState<ExistingResult[]>([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        loadingResults,
        setLoadingResults
    ] = useState(false);


    const [
        submitting,
        setSubmitting
    ] = useState(false);


    const [
        error,
        setError
    ] = useState<string | null>(null);


    const [
        success,
        setSuccess
    ] = useState<string | null>(null);


    /*
    |--------------------------------------------------------------------------
    | Load Election / Candidates / Stations
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!electionId) {

            setError(
                "No election was selected."
            );

            setLoading(false);

            return;

        }


        const loadData =
            async () => {

                try {

                    setLoading(true);

                    setError(null);


                    const [
                        electionResponse,
                        candidatesResponse,
                        stationsResponse
                    ] = await Promise.all([

                        fetch(
                            `${API_URL}/elections/${electionId}`
                        ),

                        fetch(
                            `${API_URL}/candidates?electionId=${electionId}`
                        ),

                        fetch(
                            `${API_URL}/polling-stations`
                        )

                    ]);


                    if (!electionResponse.ok) {

                        throw new Error(
                            "Failed to load election"
                        );

                    }


                    if (!candidatesResponse.ok) {

                        throw new Error(
                            "Failed to load candidates"
                        );

                    }


                    if (!stationsResponse.ok) {

                        throw new Error(
                            "Failed to load polling stations"
                        );

                    }


                    const electionJson =
                        await electionResponse.json();


                    const candidatesJson =
                        await candidatesResponse.json();


                    const stationsJson =
                        await stationsResponse.json();


                    setElection(
                        electionJson.data ??
                        electionJson
                    );


                    const loadedCandidates =
                        candidatesJson.data ?? [];


                    setCandidates(
                        loadedCandidates
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Start with empty vote fields
                    |--------------------------------------------------------------------------
                    */

                    setVotes(
                        loadedCandidates.map(
                            (candidate: Candidate) => ({

                                candidateId:
                                    candidate.id,

                                votes: ""

                            })
                        )
                    );


                    setPollingStations(
                        stationsJson.data ?? []
                    );

                } catch (error: any) {

                    console.error(
                        "Failed to load result management:",
                        error
                    );


                    setError(
                        error.message ||
                        "Failed to load result management"
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadData();

    }, [electionId]);


    /*
    |--------------------------------------------------------------------------
    | Load Existing Results When Station Changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            !electionId ||
            !selectedStation
        ) {

            setExistingResults([]);

            return;

        }


        const loadExistingResults =
            async () => {

                try {

                    setLoadingResults(true);

                    setError(null);

                    setSuccess(null);


                    /*
                    |--------------------------------------------------------------------------
                    | Get all results
                    |--------------------------------------------------------------------------
                    */

                    const response =
                        await fetch(
                            `${API_URL}/results`
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Failed to check existing results"
                        );

                    }


                    const data =
                        await response.json();


                    const allResults:
                        ExistingResult[] =
                        data.data ?? [];


                    /*
                    |--------------------------------------------------------------------------
                    | Only results for this election + station
                    |--------------------------------------------------------------------------
                    */

                    const stationResults =
                        allResults.filter(
                            result =>
                                result.electionId ===
                                electionId &&
                                result.pollingStationId ===
                                selectedStation
                        );


                    setExistingResults(
                        stationResults
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Populate vote fields
                    |--------------------------------------------------------------------------
                    */

                    setVotes(
                        candidates.map(
                            candidate => {

                                const existing =
                                    stationResults.find(
                                        result =>
                                            result.candidateId ===
                                            candidate.id
                                    );


                                return {

                                    candidateId:
                                        candidate.id,

                                    votes:
                                        existing
                                            ? String(existing.votes)
                                            : "",

                                    resultId:
                                        existing?.id

                                };

                            }
                        )
                    );


                    if (
                        stationResults.length > 0
                    ) {

                        setSuccess(
                            `Existing results loaded for this polling station. You can edit the votes below.`
                        );

                    }

                } catch (error: any) {

                    console.error(
                        "Failed to load existing results:",
                        error
                    );


                    setError(
                        error.message ||
                        "Failed to check existing results"
                    );

                } finally {

                    setLoadingResults(false);

                }

            };


        loadExistingResults();

    }, [
        electionId,
        selectedStation,
        candidates
    ]);


    /*
    |--------------------------------------------------------------------------
    | Positions
    |--------------------------------------------------------------------------
    */

    const positions =
        useMemo(() => {

            const map =
                new Map<
                    string,
                    {
                        id: string;
                        name: string;
                        candidates: Candidate[];
                    }
                >();


            candidates.forEach(
                candidate => {

                    const position =
                        candidate.position;


                    if (!position) {

                        return;

                    }


                    if (
                        !map.has(position.id)
                    ) {

                        map.set(
                            position.id,
                            {

                                id:
                                    position.id,

                                name:
                                    position.name,

                                candidates: []

                            }
                        );

                    }


                    map
                        .get(position.id)!
                        .candidates
                        .push(candidate);

                }
            );


            return Array.from(
                map.values()
            );

        }, [candidates]);


    /*
    |--------------------------------------------------------------------------
    | Selected Station
    |--------------------------------------------------------------------------
    */

    const station =
        pollingStations.find(
            item =>
                item.id ===
                selectedStation
        );


    /*
    |--------------------------------------------------------------------------
    | Editing Mode
    |--------------------------------------------------------------------------
    */

    const isEditing =
        existingResults.length > 0;


    /*
    |--------------------------------------------------------------------------
    | Total Votes
    |--------------------------------------------------------------------------
    */

    const totalVotes =
        votes.reduce(
            (
                total,
                item
            ) =>
                total +
                Number(
                    item.votes || 0
                ),
            0
        );


    /*
    |--------------------------------------------------------------------------
    | Update Vote
    |--------------------------------------------------------------------------
    */

    const updateVote = (
        candidateId: string,
        value: string
    ) => {

        if (
            value !== "" &&
            !/^\d+$/.test(value)
        ) {

            return;

        }


        setVotes(
            current =>
                current.map(
                    item =>
                        item.candidateId ===
                        candidateId

                            ? {

                                ...item,

                                votes: value

                            }

                            : item
                )
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Station Change
    |--------------------------------------------------------------------------
    */

    const handleStationChange = (
        stationId: string
    ) => {

        setSelectedStation(
            stationId
        );

        setExistingResults([]);

        setSuccess(null);

        setError(null);

    };


    /*
    |--------------------------------------------------------------------------
    | Submit Results
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
        async (
            event: React.FormEvent
        ) => {

            event.preventDefault();


            setError(null);

            setSuccess(null);


            if (!electionId) {

                setError(
                    "No election was selected."
                );

                return;

            }


            if (!selectedStation) {

                setError(
                    "Please select a polling station."
                );

                return;

            }


            const incomplete =
                votes.some(
                    item =>
                        item.votes === ""
                );


            if (incomplete) {

                setError(
                    "Please enter votes for every candidate."
                );

                return;

            }


            if (
                station &&
                totalVotes >
                station.registeredVoters
            ) {

                setError(

                    `Total votes (${totalVotes.toLocaleString()}) cannot exceed the ${station.registeredVoters.toLocaleString()} registered voters at this polling station.`

                );

                return;

            }


            try {

                setSubmitting(true);


                /*
                |--------------------------------------------------------------------------
                | Save each candidate result
                |--------------------------------------------------------------------------
                */

                for (
                    const item of votes
                ) {

                    const payload = {

                        electionId,

                        candidateId:
                            item.candidateId,

                        pollingStationId:
                            selectedStation,

                        votes:
                            Number(
                                item.votes
                            )

                    };


                    let response: Response;


                    /*
                    |--------------------------------------------------------------------------
                    | Existing result → UPDATE
                    |--------------------------------------------------------------------------
                    */

                    if (
                        item.resultId
                    ) {

                        response =
                            await fetch(

                                `${API_URL}/results/${item.resultId}`,

                                {

                                    method:
                                        "PUT",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify({

                                            votes:
                                                Number(
                                                    item.votes
                                                )

                                        })

                                }

                            );

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | New result → CREATE
                    |--------------------------------------------------------------------------
                    */

                    else {

                        response =
                            await fetch(

                                `${API_URL}/results`,

                                {

                                    method:
                                        "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify(
                                            payload
                                        )

                                }

                            );

                    }


                    const data =
                        await response.json();


                    if (
                        !response.ok
                    ) {

                        throw new Error(

                            data.message ||
                            "Failed to save result"

                        );

                    }

                }


                /*
                |--------------------------------------------------------------------------
                | Refresh existing result IDs
                |--------------------------------------------------------------------------
                */

                const refreshedResponse =
                    await fetch(
                        `${API_URL}/results`
                    );


                if (
                    refreshedResponse.ok
                ) {

                    const refreshedData =
                        await refreshedResponse.json();


                    const refreshedResults:
                        ExistingResult[] =
                        (
                            refreshedData.data ??
                            []
                        ).filter(
                            (
                                result:
                                    ExistingResult
                            ) =>
                                result.electionId ===
                                electionId &&
                                result.pollingStationId ===
                                selectedStation
                        );


                    setExistingResults(
                        refreshedResults
                    );


                    setVotes(
                        candidates.map(
                            candidate => {

                                const result =
                                    refreshedResults.find(
                                        item =>
                                            item.candidateId ===
                                            candidate.id
                                    );


                                return {

                                    candidateId:
                                        candidate.id,

                                    votes:
                                        result
                                            ? String(
                                                result.votes
                                            )
                                            : "",

                                    resultId:
                                        result?.id

                                };

                            }
                        )
                    );

                }


                setSuccess(

                    isEditing

                        ? "Election results updated successfully."

                        : "Election results submitted successfully."

                );

            } catch (error: any) {

                console.error(
                    "Failed to submit results:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to submit results"
                );

            } finally {

                setSubmitting(false);

            }

        };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="admin-results-page">

                <main className="admin-results-loading">

                    <div className="admin-results-spinner" />

                    <h2>
                        Loading Result Management
                    </h2>

                    <p>
                        Loading election data, candidates and polling stations...
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

    if (
        error &&
        !election
    ) {

        return (

            <div className="admin-results-page">

                <div className="admin-results-error">

                    <div className="admin-results-error-card">

                        <div className="admin-results-error-icon">
                            !
                        </div>


                        <h1>
                            Unable to Load Result Management
                        </h1>


                        <p>
                            {error}
                        </p>


                        <Link
                            to="/elections"
                            className="admin-results-primary-button"
                        >
                            ← Back to Elections
                        </Link>

                    </div>

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="admin-results-page">


            {/* =========================================================
                NAVBAR
            ========================================================= */}

            <header className="admin-results-navbar">

                <div className="admin-results-container">

                    <Link
                        to="/"
                        className="admin-results-logo"
                    >
                        ERMS
                    </Link>


                    <nav className="admin-results-nav">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/elections">
                            Elections
                        </Link>

                        <Link to="/results">
                            Live Results
                        </Link>

                        <Link
                            to="/login"
                            className="admin-results-login"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>


            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="admin-results-hero">

                <div className="admin-results-container">

                    <Link
                        to="/elections"
                        className="admin-results-back"
                    >
                        ← Back to Elections
                    </Link>


                    <span className="admin-results-eyebrow">
                        ADMINISTRATION
                    </span>


                    <div className="admin-results-hero-row">

                        <div>

                            <h1>
                                Result Entry
                            </h1>

                            <p>
                                {election?.name}
                                {" · "}
                                {election?.year}
                            </p>

                        </div>


                        <span
                            className={
                                `admin-results-badge ${
                                    isEditing
                                        ? "editing"
                                        : ""
                                }`
                            }
                        >

                            {isEditing
                                ? "EDITING RESULTS"
                                : "NEW DATA ENTRY"
                            }

                        </span>

                    </div>

                </div>

            </section>


            {/* =========================================================
                CONTENT
            ========================================================= */}

            <main className="admin-results-content">

                <div className="admin-results-container">


                    {/* Alerts */}

                    {error && (

                        <div className="admin-results-alert error">

                            <strong>
                                Error
                            </strong>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {success && (

                        <div className="admin-results-alert success">

                            <strong>
                                {isEditing
                                    ? "Results Loaded"
                                    : "Success"
                                }
                            </strong>

                            <span>
                                {success}
                            </span>

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="admin-results-form"
                    >


                        {/* =================================================
                            STEP 1
                        ================================================= */}

                        <section className="admin-results-card">

                            <div className="admin-results-card-heading">

                                <span>
                                    STEP 1
                                </span>

                                <h2>
                                    Select Polling Station
                                </h2>

                                <p>
                                    Select the polling station for which you are entering or editing results.
                                </p>

                            </div>


                            <div className="admin-results-field">

                                <label htmlFor="pollingStation">
                                    Polling Station
                                </label>


                                <select
                                    id="pollingStation"
                                    value={selectedStation}
                                    onChange={
                                        event =>
                                            handleStationChange(
                                                event.target.value
                                            )
                                    }
                                >

                                    <option value="">
                                        Select polling station
                                    </option>


                                    {pollingStations.map(
                                        pollingStation => (

                                            <option
                                                key={
                                                    pollingStation.id
                                                }
                                                value={
                                                    pollingStation.id
                                                }
                                            >

                                                {
                                                    pollingStation.name
                                                }

                                                {" — "}

                                                {
                                                    pollingStation.code
                                                }

                                                {" — "}

                                                {
                                                    pollingStation.ward?.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>


                                {loadingResults && (

                                    <div className="admin-results-loading-inline">

                                        <span className="admin-results-mini-spinner" />

                                        Checking existing results...

                                    </div>

                                )}


                                {station && (

                                    <div className="admin-results-station-info">

                                        <div>

                                            <span>
                                                CODE
                                            </span>

                                            <strong>
                                                {station.code}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                REGISTERED VOTERS
                                            </span>

                                            <strong>
                                                {station.registeredVoters.toLocaleString()}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                LOCATION
                                            </span>

                                            <strong>

                                                {
                                                    station.ward?.name
                                                }

                                                {" · "}

                                                {
                                                    station.ward?.constituency?.name
                                                }

                                                {" · "}

                                                {
                                                    station.ward?.constituency?.county?.name
                                                }

                                            </strong>

                                        </div>

                                    </div>

                                )}


                                {isEditing && (

                                    <div className="admin-results-edit-notice">

                                        <strong>
                                            Existing results found
                                        </strong>

                                        <span>
                                            The votes below have been loaded from the database and can be edited.
                                        </span>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            STEP 2
                        ================================================= */}

                        <section className="admin-results-card">

                            <div className="admin-results-card-heading">

                                <span>
                                    STEP 2
                                </span>

                                <h2>
                                    Enter Candidate Votes
                                </h2>

                                <p>
                                    Enter or update the votes reported for each candidate.
                                </p>

                            </div>


                            {positions.map(
                                position => (

                                    <div
                                        key={
                                            position.id
                                        }
                                        className="admin-results-position"
                                    >

                                        <div className="admin-results-position-heading">

                                            <span>
                                                POSITION
                                            </span>

                                            <h3>
                                                {position.name}
                                            </h3>

                                        </div>


                                        <div className="admin-results-candidates">

                                            {position.candidates.map(
                                                (
                                                    candidate,
                                                    index
                                                ) => {

                                                    const entry =
                                                        votes.find(
                                                            item =>
                                                                item.candidateId ===
                                                                candidate.id
                                                        );


                                                    return (

                                                        <div
                                                            key={
                                                                candidate.id
                                                            }
                                                            className="admin-results-candidate-row"
                                                        >

                                                            <div className="admin-results-candidate-number">

                                                                {
                                                                    index + 1
                                                                }

                                                            </div>


                                                            <div className="admin-results-candidate-name">

                                                                <strong>
                                                                    {
                                                                        candidate.name
                                                                    }
                                                                </strong>

                                                            </div>


                                                            <div className="admin-results-votes-input">

                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="1"
                                                                    value={
                                                                        entry?.votes ??
                                                                        ""
                                                                    }
                                                                    onChange={
                                                                        event =>
                                                                            updateVote(
                                                                                candidate.id,
                                                                                event.target.value
                                                                            )
                                                                    }
                                                                    placeholder="0"
                                                                />

                                                                <span>
                                                                    votes
                                                                </span>

                                                            </div>

                                                        </div>

                                                    );

                                                }
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </section>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <section className="admin-results-summary-card">

                            <div>

                                <span>
                                    TOTAL ENTERED VOTES
                                </span>

                                <strong>
                                    {
                                        totalVotes.toLocaleString()
                                    }
                                </strong>

                            </div>


                            {station && (

                                <div>

                                    <span>
                                        REGISTERED VOTERS
                                    </span>

                                    <strong>
                                        {
                                            station.registeredVoters.toLocaleString()
                                        }
                                    </strong>

                                </div>

                            )}


                            {station && (

                                <div>

                                    <span>
                                        REMAINING
                                    </span>

                                    <strong>
                                        {
                                            Math.max(
                                                0,
                                                station.registeredVoters -
                                                totalVotes
                                            ).toLocaleString()
                                        }
                                    </strong>

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="admin-results-actions">

                            <Link
                                to="/elections"
                                className="admin-results-cancel-button"
                            >
                                Cancel
                            </Link>


                            <button
                                type="submit"
                                disabled={
                                    submitting ||
                                    loadingResults
                                }
                                className="admin-results-submit-button"
                            >

                                {submitting

                                    ? "Saving Results..."

                                    : isEditing

                                        ? "Update Results →"

                                        : "Submit Results →"

                                }

                            </button>

                        </div>


                    </form>

                </div>

            </main>


            {/* =========================================================
                FOOTER
            ========================================================= */}

            <footer className="admin-results-footer">

                <div className="admin-results-container">

                    <div className="admin-results-footer-content">

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