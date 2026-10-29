
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./AdminElections.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ElectionStatus = "draft" | "active" | "completed";

type ElectionType = "GENERAL" | "BY_ELECTION";

interface Election {
    id: string;
    name: string;
    year: number;
    description: string | null;
    status: ElectionStatus;
    electionType: ElectionType;
    positions?: unknown[];
    candidates?: unknown[];
}

interface ElectionForm {
    name: string;
    year: string;
    description: string;
    status: ElectionStatus;
    electionType: ElectionType;
    byElectionPosition: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Array<{ msg?: string }>;
}

const emptyForm: ElectionForm = {
    name: "",
    year: String(new Date().getFullYear()),
    description: "",
    status: "draft",
    electionType: "GENERAL",
    byElectionPosition: "",
};

async function apiRequest<T>(
    endpoint: string,
    method = "GET",
    body?: unknown
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body !== undefined
            ? { body: JSON.stringify(body) }
            : {}),
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        const validationMessage = result.errors
            ?.map((error) => error.msg)
            .filter(Boolean)
            .join(" ");

        throw new Error(
            validationMessage ||
            result.message ||
            `Request failed (${response.status}).`
        );
    }

    return result;
}

function AdminElections() {
    const { user, isAuthenticated } = useAuth();

    const isAdmin =
        isAuthenticated && user?.role === "SUPER_ADMIN";

    const [elections, setElections] = useState<Election[]>([]);
    const [form, setForm] = useState<ElectionForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Election | null>(null);

    const loadElections = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await apiRequest<Election[]>("/elections");
            setElections(result.data ?? []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load elections."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            return;
        }

        let cancelled = false;

        async function fetchElections() {
            setError("");
            setLoading(true);

            try {
                const result = await apiRequest<Election[]>("/elections");

                if (!cancelled) {
                    setElections(result.data ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load elections."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchElections();

        return () => {
            cancelled = true;
        };
    }, [isAdmin]);

    function resetForm() {
        setForm({ ...emptyForm });
        setEditingId(null);
        setError("");
        setNotice("");
    }

    function startEditing(election: Election) {
        setEditingId(election.id);
        setForm({
            name: election.name,
            year: String(election.year),
            description: election.description ?? "",
            status: election.status,
            electionType: election.electionType ?? "GENERAL",
            byElectionPosition: "",
        });
        setError("");
        setNotice("");
        setDeleteTarget(null);

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setNotice("");

        const year = Number(form.year);

        if (!form.name.trim()) {
            setError("Enter an election name.");
            return;
        }

        if (!Number.isInteger(year) || year < 2000) {
            setError("Enter a valid election year (2000 or later).");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                name: form.name.trim(),
                year,
                description: form.description.trim(),
                status: form.status,
                ...(editingId
                    ? {}
                    : {
                        electionType: form.electionType,
                        ...(form.electionType === "BY_ELECTION"
                            ? { byElectionPosition: form.byElectionPosition }
                            : {}),
                    }),
            };

            await apiRequest<Election>(
                editingId
                    ? `/elections/${editingId}`
                    : "/elections",
                editingId ? "PUT" : "POST",
                payload
            );

            setNotice(
                editingId
                    ? "Election updated successfully."
                    : "Election created successfully."
            );

            setForm({ ...emptyForm });
            setEditingId(null);

            await loadElections();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save the election."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;

        setError("");
        setNotice("");

        try {
            await apiRequest<unknown>(
                `/elections/${deleteTarget.id}`,
                "DELETE"
            );

            setNotice(`"${deleteTarget.name}" was deleted.`);
            setDeleteTarget(null);

            await loadElections();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete the election."
            );
        }
    }

    if (!isAuthenticated) {
        return (
            <main className="admin-elections-page">
                <div className="admin-elections-message">
                    Please <Link to="/login">sign in</Link> to continue.
                </div>
            </main>
        );
    }

    if (!isAdmin) {
        return (
            <main className="admin-elections-page">
                <div className="admin-elections-message">
                    <h1>Access denied</h1>
                    <p>
                        Election administration is restricted to
                        authorized administrators.
                    </p>
                    <Link to="/dashboard">Return to Dashboard</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-elections-page">
            <div className="admin-elections-container">
                <header className="admin-elections-header">
                    <div>
                        <span className="admin-elections-eyebrow">
                            ADMINISTRATION
                        </span>
                        <h1>Manage Elections</h1>
                        <p>
                            Create elections, update their details,
                            and manage their current status.
                        </p>
                    </div>

                    <Link
                        to="/elections"
                        className="admin-elections-secondary-button"
                    >
                        View Elections
                    </Link>
                </header>

                {error && (
                    <div className="admin-elections-alert error" role="alert">
                        {error}
                    </div>
                )}

                {notice && (
                    <div className="admin-elections-alert success" role="status">
                        {notice}
                    </div>
                )}

                <section className="admin-elections-panel">
                    <div className="admin-elections-panel-heading">
                        <div>
                            <h2>
                                {editingId ? "Edit Election" : "Create Election"}
                            </h2>
                            <p>
                                {editingId
                                    ? "Update the selected election."
                                    : "Enter the details for a new election."}
                            </p>
                        </div>
                    </div>

                    <form
                        className="admin-elections-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="admin-elections-form-grid">
                            <label>
                                Election name
                                <input
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            name: event.target.value,
                                        })
                                    }
                                    placeholder="e.g. General Election"
                                    required
                                    maxLength={150}
                                    disabled={saving}
                                />
                            </label>

                            <label>
                                Election year
                                <input
                                    type="number"
                                    min="2000"
                                    step="1"
                                    value={form.year}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            year: event.target.value,
                                        })
                                    }
                                    required
                                    disabled={saving}
                                />
                            </label>
                            <label>
                                Election type
                                <select
                                    value={form.electionType}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            electionType: event.target.value as ElectionType,
                                            byElectionPosition: "",
                                        })
                                    }
                                    disabled={saving || Boolean(editingId)}
                                >
                                    <option value="GENERAL">General Election</option>
                                    <option value="BY_ELECTION">By-election</option>
                                </select>
                                {editingId && (
                                    <small>Election type cannot be changed after creation.</small>
                                )}
                            </label>

                            {form.electionType === "BY_ELECTION" && !editingId && (
                                <label>
                                    Vacant position
                                    <select
                                        value={form.byElectionPosition}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                byElectionPosition: event.target.value,
                                            })
                                        }
                                        required
                                        disabled={saving}
                                    >
                                        <option value="">Select a position</option>
                                        <option value="President">President</option>
                                        <option value="Governor">Governor</option>
                                        <option value="Senator">Senator</option>
                                        <option value="Woman Representative">
                                            Woman Representative
                                        </option>
                                        <option value="Member of National Assembly (MP)">
                                            Member of National Assembly (MP)
                                        </option>
                                        <option value="Member of County Assembly (MCA)">
                                            Member of County Assembly (MCA)
                                        </option>
                                    </select>
                                </label>
                            )}

                            <label>
                                Status
                                <select
                                    value={form.status}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            status: event.target.value as ElectionStatus,
                                        })
                                    }
                                    disabled={saving}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </label>

                            <label className="admin-elections-description">
                                Description
                                <textarea
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            description: event.target.value,
                                        })
                                    }
                                    placeholder="Optional election description"
                                    rows={3}
                                    disabled={saving}
                                />
                            </label>
                        </div>

                        <div className="admin-elections-form-actions">
                            {editingId && (
                                <button
                                    type="button"
                                    className="admin-elections-secondary-button"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                className="admin-elections-primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                      ? "Save Changes"
                                      : "Create Election"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="admin-elections-panel">
                    <div className="admin-elections-panel-heading">
                        <div>
                            <h2>Existing Elections</h2>
                            <p>
                                {elections.length} election
                                {elections.length === 1 ? "" : "s"} found
                            </p>
                        </div>

                        <button
                            type="button"
                            className="admin-elections-secondary-button"
                            onClick={() => void loadElections()}
                            disabled={loading}
                        >
                            {loading ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>

                    {loading ? (
                        <p className="admin-elections-empty">
                            Loading elections...
                        </p>
                    ) : elections.length === 0 ? (
                        <p className="admin-elections-empty">
                            No elections found. Use the form above to create one.
                        </p>
                    ) : (
                        <div className="admin-elections-table-wrapper">
                            <table className="admin-elections-table">
                                <thead>
                                    <tr>
                                        <th>Election</th>
                                        <th>Year</th>
                                        <th>Status</th>
                                        <th>Positions</th>
                                        <th>Candidates</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {elections.map((election) => (
                                        <tr key={election.id}>
                                            <td>
                                                <strong>{election.name}</strong>
                                                {election.description && (
                                                    <span className="admin-elections-description-text">
                                                        {election.description}
                                                    </span>
                                                )}
                                            </td>

                                            <td>{election.year}</td>

                                            <td>
                                                <span
                                                    className={`admin-election-status ${election.status}`}
                                                >
                                                    {election.status}
                                                </span>
                                            </td>

                                            <td>
                                                {election.positions?.length ?? 0}
                                            </td>

                                            <td>
                                                {election.candidates?.length ?? 0}
                                            </td>

                                            <td>
                                                <div className="admin-elections-row-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-elections-edit-button"
                                                        onClick={() =>
                                                            startEditing(election)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-elections-delete-button"
                                                        onClick={() => {
                                                            setDeleteTarget(election);
                                                            setError("");
                                                            setNotice("");
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {deleteTarget && (
                        <div
                            className="admin-elections-confirmation"
                            role="alertdialog"
                            aria-labelledby="delete-election-title"
                            aria-describedby="delete-election-description"
                        >
                            <h3 id="delete-election-title">
                                Delete election?
                            </h3>
                            <p id="delete-election-description">
                                You are about to delete{" "}
                                <strong>{deleteTarget.name}</strong> (
                                {deleteTarget.year}). This action cannot be
                                undone. Elections with recorded results cannot
                                be deleted.
                            </p>

                            <div className="admin-elections-form-actions">
                                <button
                                    type="button"
                                    className="admin-elections-secondary-button"
                                    onClick={() => setDeleteTarget(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="admin-elections-delete-button"
                                    onClick={() => void handleDelete()}
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default AdminElections;
