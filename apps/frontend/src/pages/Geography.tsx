
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    geographyService,
    type County,
} from "../services/geographyService";

import "../App.css";

function Geography() {
    const [counties, setCounties] = useState<County[]>([]);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const loadCounties = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        }

        setError("");

        try {
            const data = await geographyService.getCounties();
            setCounties(data);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load counties."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function fetchCounties() {
            setError("");

            try {
                const data = await geographyService.getCounties();

                if (!cancelled) {
                    setCounties(data);
                }
            } catch (err: unknown) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load counties."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchCounties();

        return () => {
            cancelled = true;
        };
    }, []);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            await geographyService.createCounty({
                name: name.trim(),
                code: code.trim(),
            });

            setName("");
            setCode("");
            setSuccess("County created successfully.");

            await loadCounties();
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create county."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="geography-page">
            <div className="geography-container">
                <header className="geography-header">
                    <div>
                        <Link
                            to="/dashboard"
                            className="geography-back-link"
                        >
                            ← Back to Dashboard
                        </Link>

                        <h1>Geography Management</h1>

                        <p>
                            Manage counties and the electoral
                            administrative areas beneath them.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="geography-secondary-button"
                        onClick={() => void loadCounties()}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </button>
                </header>

                {error && (
                    <div className="geography-alert geography-alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="geography-alert geography-alert-success">
                        {success}
                    </div>
                )}

                <section className="geography-summary">
                    <span>Total Counties</span>
                    <strong>{counties.length}</strong>
                </section>

                <section className="geography-card">
                    <div className="geography-card-header">
                        <h2>Add County</h2>
                        <p>
                            Enter the county name and a unique code.
                        </p>
                    </div>

                    <form
                        className="geography-form"
                        onSubmit={handleSubmit}
                    >
                        <label>
                            County Name
                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="e.g. Nairobi"
                                minLength={2}
                                required
                            />
                        </label>

                        <label>
                            County Code
                            <input
                                type="text"
                                value={code}
                                onChange={(event) =>
                                    setCode(event.target.value)
                                }
                                placeholder="e.g. 047"
                                minLength={2}
                                required
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={saving}
                            className="geography-primary-button"
                        >
                            {saving ? "Saving..." : "Add County"}
                        </button>
                    </form>
                </section>

                <section className="geography-card">
                    <div className="geography-card-header">
                        <h2>Registered Counties</h2>
                        <p>
                            Counties currently stored in the ERMS database.
                        </p>
                    </div>

                    {loading ? (
                        <p className="geography-empty">
                            Loading counties...
                        </p>
                    ) : counties.length === 0 ? (
                        <p className="geography-empty">
                            No counties found. Add the first county
                            using the form above.
                        </p>
                    ) : (
                        <div className="geography-table-wrapper">
                            <table className="geography-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>County Name</th>
                                        <th>Code</th>
                                        <th>Constituencies</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {counties.map((county, index) => (
                                        <tr key={county.id}>
                                            <td>{index + 1}</td>
                                            <td>{county.name}</td>
                                            <td>
                                                <span className="geography-code">
                                                    {county.code}
                                                </span>
                                            </td>
                                            <td>
                                                {county.constituencies?.length ?? 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Geography;
