import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getDashboardSummary
} from "../services/dashboardService";

import type {
    DashboardSummary
} from "../services/dashboardService";

import { useAuth } from "../hooks/useAuth";


export default function Dashboard() {

    const {
        user,
        logout
    } = useAuth();


    const [
        summary,
        setSummary
    ] = useState<DashboardSummary | null>(
        null
    );


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    useEffect(() => {

        async function loadDashboard() {

            try {

                const data =
                    await getDashboardSummary();

                setSummary(data);

            } catch (error: unknown) {

                console.error(
                    "Failed to load dashboard:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        }


        loadDashboard();

    }, []);


    function handleLogout() {

        logout();

    }


    if (loading) {

        return (

            <div className="home-page">

                <div className="home-loading">

                    Loading ERMS Dashboard...

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="home-page">

                <div className="home-container">

                    <div className="dashboard-error">

                        {error}

                    </div>

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
                        to="/dashboard"
                        className="home-logo"
                    >
                        ERMS
                    </Link>


                    <nav className="home-nav">

                        <Link
                            to="/dashboard"
                            className="active"
                        >
                            Dashboard
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


                        <button
                            type="button"
                            className="nav-login"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </nav>

                </div>

            </header>


            {/* =========================================================
                DASHBOARD HERO
            ========================================================= */}

            <section className="dashboard-hero">

                <div className="home-container">

                    <div className="dashboard-header">

                        <div>

                            <span className="hero-badge">
                                ADMINISTRATION
                            </span>


                            <h1>
                                Welcome back,{" "}
                                {user?.firstName}
                            </h1>


                            <p>
                                Manage elections, geography,
                                candidates and election results
                                from one centralized platform.
                            </p>

                        </div>


                        <div className="dashboard-user">

                            <strong>
                                {user?.firstName}{" "}
                                {user?.lastName}
                            </strong>

                            <span>
                                {user?.role}
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                STATISTICS
            ========================================================= */}

            <section className="home-section">

                <div className="home-container">

                    <div className="section-heading">

                        <span>
                            SYSTEM OVERVIEW
                        </span>

                        <h2>
                            Election Management Statistics
                        </h2>

                        <p>
                            Current data available across the
                            Election Results Management System.
                        </p>

                    </div>


                    <div className="dashboard-statistics-grid">


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                🗳️
                            </span>

                            <small>
                                ELECTIONS
                            </small>

                            <strong>
                                {summary?.totalElections ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                👥
                            </span>

                            <small>
                                CANDIDATES
                            </small>

                            <strong>
                                {summary?.totalCandidates ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                📋
                            </span>

                            <small>
                                RESULTS
                            </small>

                            <strong>
                                {summary?.totalResults ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                🗳️
                            </span>

                            <small>
                                TOTAL VOTES
                            </small>

                            <strong>
                                {summary?.totalVotes.toLocaleString() ?? "0"}
                            </strong>

                        </div>


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                📍
                            </span>

                            <small>
                                COUNTIES
                            </small>

                            <strong>
                                {summary?.totalCounties ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                🏛️
                            </span>

                            <small>
                                CONSTITUENCIES
                            </small>

                            <strong>
                                {summary?.totalConstituencies ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                📌
                            </span>

                            <small>
                                WARDS
                            </small>

                            <strong>
                                {summary?.totalWards ?? 0}
                            </strong>

                        </div>


                        <div className="dashboard-stat-card">

                            <span className="dashboard-stat-icon">
                                📡
                            </span>

                            <small>
                                POLLING STATIONS
                            </small>

                            <strong>
                                {summary?.totalPollingStations ?? 0}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                QUICK ACTIONS
            ========================================================= */}

            <section className="home-section dashboard-actions-section">

                <div className="home-container">

                    <div className="section-heading">

                        <span>
                            MANAGEMENT
                        </span>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Access the main election administration
                            functions.
                        </p>

                    </div>


                    <div className="feature-grid">


                        <Link
                            to="/elections"
                            className="feature-card dashboard-action-card"
                        >

                            <div className="feature-icon">
                                🗳️
                            </div>

                            <h3>
                                Elections
                            </h3>

                            <p>
                                Create and manage elections,
                                election periods and election
                                configuration.
                            </p>

                            <span className="dashboard-action-link">
                                Manage Elections →
                            </span>

                        </Link>


                        <Link
                            to="/geography"
                            className="feature-card dashboard-action-card"
                        >

                            <div className="feature-icon">
                                📍
                            </div>

                            <h3>
                                Geography
                            </h3>

                            <p>
                                Manage counties, constituencies,
                                wards and polling stations.
                            </p>

                            <span className="dashboard-action-link">
                                Manage Geography →
                            </span>

                        </Link>


                        <Link
                            to="/positions"
                            className="feature-card dashboard-action-card"
                        >

                            <div className="feature-icon">
                                🏛️
                            </div>

                            <h3>
                                Positions
                            </h3>

                            <p>
                                Configure election positions
                                for each election.
                            </p>

                            <span className="dashboard-action-link">
                                Manage Positions →
                            </span>

                        </Link>


                        <Link
                            to="/candidates"
                            className="feature-card dashboard-action-card"
                        >

                            <div className="feature-icon">
                                👥
                            </div>

                            <h3>
                                Candidates
                            </h3>

                            <p>
                                Register and manage candidates
                                participating in elections.
                            </p>

                            <span className="dashboard-action-link">
                                Manage Candidates →
                            </span>

                        </Link>


                        <Link
                            to="/admin/results/entry"
                            className="feature-card dashboard-action-card"
                        >

                            <div className="feature-icon">
                                📊
                            </div>

                            <h3>
                                Result Entry
                            </h3>

                            <p>
                                Enter and manage results received
                                from polling stations.
                            </p>

                            <span className="dashboard-action-link">
                                Enter Results →
                            </span>

                        </Link>


                        <Link
                            to="/results"
                            className="feature-card dashboard-action-card"
                        >

                            <div className="feature-icon">
                                📡
                            </div>

                            <h3>
                                Live Results
                            </h3>

                            <p>
                                Monitor election results in
                                real time through Socket.IO.
                            </p>

                            <span className="dashboard-action-link">
                                View Live Results →
                            </span>

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