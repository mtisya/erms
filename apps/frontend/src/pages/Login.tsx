import {
    useState
} from "react";

import type {
    FormEvent
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";


export default function Login() {

    const navigate =
        useNavigate();


    const {
        login
    } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [
        email,
        setEmail
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();


        setError("");

        setLoading(true);


        try {

            await login(
                email,
                password
            );


            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );


        } catch (error: any) {

            console.error(
                "Login failed:",
                error
            );


            setError(
                error.message ||
                "Unable to sign in. Please check your credentials."
            );


        } finally {

            setLoading(false);

        }

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

                        <Link
                            to="/"
                        >
                            Home
                        </Link>


                        <Link
                            to="/elections"
                        >
                            Elections
                        </Link>


                        <Link
                            to="/results"
                        >
                            Live Results
                        </Link>


                        <Link
                            to="/login"
                            className="admin-results-login active"
                        >
                            Login
                        </Link>

                    </nav>

                </div>

            </header>


            {/* =========================================================
                LOGIN HERO
            ========================================================= */}

            <section className="admin-results-hero login-hero">

                <div className="admin-results-container">

                    <span className="admin-results-eyebrow">
                        SECURE ACCESS
                    </span>


                    <div className="login-hero-content">

                        <h1>
                            Welcome to ERMS
                        </h1>


                        <p>
                            Sign in to access the Election Results
                            Management System administration portal.
                        </p>

                    </div>

                </div>

            </section>


            {/* =========================================================
                LOGIN CONTENT
            ========================================================= */}

            <main className="admin-results-content login-content">

                <div className="admin-results-container">

                    <div className="login-layout">


                        {/* =================================================
                            INFORMATION
                        ================================================= */}

                        <div className="login-information">

                            <span className="admin-results-eyebrow">
                                ADMINISTRATION PORTAL
                            </span>


                            <h2>
                                Manage Elections
                                <span>
                                    Securely.
                                </span>
                            </h2>


                            <p>
                                Access election administration tools
                                for managing elections, geographic
                                areas, positions, candidates and
                                election results.
                            </p>


                            <div className="login-features">


                                <div className="login-feature">

                                    <div className="login-feature-icon">
                                        🗳️
                                    </div>

                                    <div>

                                        <strong>
                                            Election Management
                                        </strong>

                                        <span>
                                            Create and manage elections
                                            and election configuration.
                                        </span>

                                    </div>

                                </div>


                                <div className="login-feature">

                                    <div className="login-feature-icon">
                                        📍
                                    </div>

                                    <div>

                                        <strong>
                                            Geographic Management
                                        </strong>

                                        <span>
                                            Manage counties, constituencies,
                                            wards and polling stations.
                                        </span>

                                    </div>

                                </div>


                                <div className="login-feature">

                                    <div className="login-feature-icon">
                                        📊
                                    </div>

                                    <div>

                                        <strong>
                                            Real-Time Results
                                        </strong>

                                        <span>
                                            Monitor election results as
                                            they are received.
                                        </span>

                                    </div>

                                </div>


                            </div>

                        </div>


                        {/* =================================================
                            LOGIN CARD
                        ================================================= */}

                        <div className="login-card">

                            <div className="login-card-header">

                                <span className="login-card-icon">
                                    🔐
                                </span>


                                <div>

                                    <span>
                                        SECURE LOGIN
                                    </span>

                                    <h2>
                                        Sign In
                                    </h2>

                                </div>

                            </div>


                            <p className="login-card-description">
                                Enter your administrator credentials
                                to continue.
                            </p>


                            {/* =================================================
                                ERROR
                            ================================================= */}

                            {error && (

                                <div className="admin-results-alert error">

                                    <strong>
                                        Login Failed
                                    </strong>

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* =================================================
                                FORM
                            ================================================= */}

                            <form
                                onSubmit={handleSubmit}
                                className="login-form"
                            >

                                <div className="admin-results-field">

                                    <label htmlFor="email">
                                        Email Address
                                    </label>


                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        required
                                        disabled={loading}
                                    />

                                </div>


                                <div className="admin-results-field">

                                    <label htmlFor="password">
                                        Password
                                    </label>


                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        disabled={loading}
                                    />

                                </div>


                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="admin-results-submit-button login-submit-button"
                                >

                                    {loading ? (

                                        <>

                                            <span className="login-spinner" />

                                            Signing In...

                                        </>

                                    ) : (

                                        <>
                                            Sign In →
                                        </>

                                    )}

                                </button>

                            </form>


                            <div className="login-card-footer">

                                <span>
                                    Authorized ERMS administrators only
                                </span>

                            </div>

                        </div>

                    </div>

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