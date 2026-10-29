
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Map,
    Landmark,
    MapPinned,
    Vote,
} from "lucide-react";
import {
    geographyService,
    type County,
    type Constituency,
    type Ward,
    type PollingStation,
} from "../services/geographyService";

import "./Geography.css";
type GeographyTab =
    | "counties"
    | "constituencies"
    | "wards"
    | "polling-stations";

function Geography() {



    const [activeTab, setActiveTab] =
        useState<GeographyTab>("counties");
    const [counties, setCounties] = useState<County[]>([]);
    const [constituencies, setConstituencies] =
        useState<Constituency[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [editingCountyId, setEditingCountyId] = useState<string | null>(null);
    const [deletingCountyId, setDeletingCountyId] = useState<string | null>(null);
    const [constituencyName, setConstituencyName] = useState("");
    const [constituencyCode, setConstituencyCode] = useState("");
    const [countyId, setCountyId] = useState("");

    const [editingConstituencyId, setEditingConstituencyId] =
        useState<string | null>(null);
    const [deletingConstituencyId, setDeletingConstituencyId] =
        useState<string | null>(null);

    const [wardName, setWardName] = useState("");
    const [wardCode, setWardCode] = useState("");
    const [wardConstituencyId, setWardConstituencyId] = useState("");
    const [editingWardId, setEditingWardId] =
        useState<string | null>(null);

    const [deletingWardId, setDeletingWardId] =
        useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingConstituency, setSavingConstituency] =
        useState(false);
    const [savingWard, setSavingWard] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadCounties = useCallback(async () => {
        const data = await geographyService.getCounties();
        setCounties(data);
    }, []);

    const loadConstituencies = useCallback(async () => {
        const data = await geographyService.getConstituencies();
        setConstituencies(data);
    }, []);

    const loadWards = useCallback(async () => {
        const data = await geographyService.getWards();
        setWards(data);
    }, []);
    const [pollingStations, setPollingStations] =
        useState<PollingStation[]>([]);

    const loadPollingStations = useCallback(async () => {
        const data = await geographyService.getPollingStations();
        setPollingStations(data);
    }, []);
    const [stationName, setStationName] = useState("");
    const [stationCode, setStationCode] = useState("");
    const [registeredVoters, setRegisteredVoters] = useState("");
    const [stationWardId, setStationWardId] = useState("");
    const [editingStationId, setEditingStationId] =
        useState<string | null>(null);

    const [deletingStationId, setDeletingStationId] =
        useState<string | null>(null);

    const [savingStation, setSavingStation] = useState(false);

    const refreshGeography = useCallback(async () => {
        try {
            await Promise.all([
                loadCounties(),
                loadConstituencies(),
                loadWards(),
                loadPollingStations(),
            ]);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load geography data."
            );
        } finally {
            setLoading(false);
        }
    }, [
        loadCounties,
        loadConstituencies,
        loadWards,
        loadPollingStations,
    ]);

    useEffect(() => {
    let cancelled = false;

    async function loadInitialGeography() {
        try {
            await Promise.all([
                loadCounties(),
                loadConstituencies(),
                loadWards(),
                loadPollingStations(),
            ]);
        } catch (err: unknown) {
            if (!cancelled) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load geography data."
                );
            }
        } finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    }

    void loadInitialGeography();

    return () => {
        cancelled = true;
    };
}, [
    loadCounties,
    loadConstituencies,
    loadWards,
    loadPollingStations,
]);

    async function handleCountySubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const data = {
                name: name.trim(),
                code: code.trim(),
            };

            if (editingCountyId) {
                await geographyService.updateCounty(editingCountyId, data);
            } else {
                await geographyService.createCounty(data);
            }

            setName("");
            setCode("");
            setEditingCountyId(null);

            await Promise.all([
                loadCounties(),
                loadConstituencies(),
            ]);

            setSuccess(
                editingCountyId
                    ? "County updated successfully."
                    : "County created successfully."
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save county."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleEditCounty(county: County) {
        setEditingCountyId(county.id);
        setName(county.name);
        setCode(county.code);
        setError("");
        setSuccess("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancelCountyEdit() {
        setEditingCountyId(null);
        setName("");
        setCode("");
        setError("");
    }

    async function handleDeleteCounty(county: County) {
        const confirmed = window.confirm(
            `Delete county "${county.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingCountyId(county.id);

        try {
            await geographyService.deleteCounty(county.id);

            if (editingCountyId === county.id) {
                handleCancelCountyEdit();
            }

            await refreshGeography();
            setSuccess(`County "${county.name}" deleted successfully.`);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete county."
            );
        } finally {
            setDeletingCountyId(null);
        }
    }



    async function handleConstituencySubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSavingConstituency(true);

        const wasEditing = editingConstituencyId !== null;

        try {
            if (editingConstituencyId) {
                await geographyService.updateConstituency(
                    editingConstituencyId,
                    {
                        name: constituencyName.trim(),
                        code: constituencyCode.trim(),
                    }
                );
            } else {
                await geographyService.createConstituency({
                    name: constituencyName.trim(),
                    code: constituencyCode.trim(),
                    countyId,
                });
            }

            setConstituencyName("");
            setConstituencyCode("");
            setCountyId("");
            setEditingConstituencyId(null);

            await Promise.all([loadConstituencies(), loadWards()]);

            setSuccess(
                wasEditing
                    ? "Constituency updated successfully."
                    : "Constituency created successfully."
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : wasEditing
                        ? "Unable to update constituency."
                        : "Unable to create constituency."
            );
        } finally {
            setSavingConstituency(false);
        }
    }

    function handleEditConstituency(constituency: Constituency) {
        setEditingConstituencyId(constituency.id);
        setConstituencyName(constituency.name);
        setConstituencyCode(constituency.code);
        setCountyId(constituency.countyId);
        setError("");
        setSuccess("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancelConstituencyEdit() {
        setEditingConstituencyId(null);
        setConstituencyName("");
        setConstituencyCode("");
        setCountyId("");
        setError("");
    }

    async function handleDeleteConstituency(
        constituency: Constituency
    ) {
        const confirmed = window.confirm(
            `Delete constituency "${constituency.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingConstituencyId(constituency.id);

        try {
            await geographyService.deleteConstituency(constituency.id);

            if (editingConstituencyId === constituency.id) {
                handleCancelConstituencyEdit();
            }

            await refreshGeography();

            setSuccess(
                `Constituency "${constituency.name}" deleted successfully.`
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete constituency."
            );
        } finally {
            setDeletingConstituencyId(null);
        }
    }


    async function handleWardSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSavingWard(true);

        const wasEditing = editingWardId !== null;

        try {
            if (editingWardId) {
                await geographyService.updateWard(editingWardId, {
                    name: wardName.trim(),
                    code: wardCode.trim(),
                });
            } else {
                await geographyService.createWard({
                    name: wardName.trim(),
                    code: wardCode.trim(),
                    constituencyId: wardConstituencyId,
                });
            }

            setWardName("");
            setWardCode("");
            setWardConstituencyId("");
            setEditingWardId(null);

            await Promise.all([
                loadWards(),
                loadPollingStations(),
            ]);

            setSuccess(
                wasEditing
                    ? "Ward updated successfully."
                    : "Ward created successfully."
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : wasEditing
                        ? "Unable to update ward."
                        : "Unable to create ward."
            );
        } finally {
            setSavingWard(false);
        }
    }

    function handleEditWard(ward: Ward) {
        setEditingWardId(ward.id);
        setWardName(ward.name);
        setWardCode(ward.code);
        setWardConstituencyId(ward.constituencyId);
        setError("");
        setSuccess("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancelWardEdit() {
        setEditingWardId(null);
        setWardName("");
        setWardCode("");
        setWardConstituencyId("");
        setError("");
    }

    async function handleDeleteWard(ward: Ward) {
        const confirmed = window.confirm(
            `Delete ward "${ward.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingWardId(ward.id);

        try {
            await geographyService.deleteWard(ward.id);

            if (editingWardId === ward.id) {
                handleCancelWardEdit();
            }

            await refreshGeography();

            setSuccess(
                `Ward "${ward.name}" deleted successfully.`
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete ward."
            );
        } finally {
            setDeletingWardId(null);
        }
    }

    function getCountyName(constituency: Constituency) {
        return (
            constituency.county?.name ??
            counties.find(
                (county) => county.id === constituency.countyId
            )?.name ??
            "Unknown"
        );
    }

    function getConstituencyName(ward: Ward) {
        return (
            ward.constituency?.name ??
            constituencies.find(
                (item) => item.id === ward.constituencyId
            )?.name ??
            "Unknown"
        );
    }


    async function handlePollingStationSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSavingStation(true);

        const wasEditing = editingStationId !== null;

        try {
            if (editingStationId) {
                await geographyService.updatePollingStation(
                    editingStationId,
                    {
                        name: stationName.trim(),
                        code: stationCode.trim(),
                        registeredVoters: Number(registeredVoters),
                    }
                );
            } else {
                await geographyService.createPollingStation({
                    name: stationName.trim(),
                    code: stationCode.trim(),
                    registeredVoters: Number(registeredVoters),
                    wardId: stationWardId,
                });
            }

            setStationName("");
            setStationCode("");
            setRegisteredVoters("");
            setStationWardId("");
            setEditingStationId(null);

            await loadPollingStations();

            setSuccess(
                wasEditing
                    ? "Polling station updated successfully."
                    : "Polling station created successfully."
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : wasEditing
                        ? "Unable to update polling station."
                        : "Unable to create polling station."
            );
        } finally {
            setSavingStation(false);
        }
    }

    function handleEditPollingStation(station: PollingStation) {
        setEditingStationId(station.id);
        setStationName(station.name);
        setStationCode(station.code);
        setRegisteredVoters(String(station.registeredVoters));
        setStationWardId(station.wardId);
        setError("");
        setSuccess("");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleCancelPollingStationEdit() {
        setEditingStationId(null);
        setStationName("");
        setStationCode("");
        setRegisteredVoters("");
        setStationWardId("");
        setError("");
        setSuccess("");
    }

    async function handleDeletePollingStation(station: PollingStation) {
        const confirmed = window.confirm(
            `Delete polling station "${station.name}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setSuccess("");
        setDeletingStationId(station.id);

        try {
            await geographyService.deletePollingStation(station.id);

            if (editingStationId === station.id) {
                handleCancelPollingStationEdit();
            }

            await refreshGeography();

            setSuccess(
                `Polling station "${station.name}" deleted successfully.`
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete polling station."
            );
        } finally {
            setDeletingStationId(null);
        }
    }
    function openGeographyTable(tab: GeographyTab) {
        setActiveTab(tab);

        window.setTimeout(() => {
            document
                .getElementById(`geography-table-${tab}`)
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        }, 100);
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
                            Manage counties, constituencies, and wards.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="geography-secondary-button"
                        onClick={() => void refreshGeography()}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </button>
                </header>

                {error && (
                    <div
                        className="geography-alert geography-alert-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className="geography-alert geography-alert-success"
                        role="status"
                    >
                        {success}
                    </div>
                )}


<section className="geography-summary-grid" aria-label="Geography summary">
    <button
        type="button"
        className={`geography-summary geography-summary-link counties ${
            activeTab === "counties" ? "selected" : ""
        }`}
        onClick={() => openGeographyTable("counties")}
        aria-label={`View registered counties: ${counties.length}`}
        aria-pressed={activeTab === "counties"}
    >
        <span className="geography-summary-top">
            <span className="geography-summary-icon counties-icon">
                <Map size={23} />
            </span>
            <span className="geography-summary-label">Total Counties</span>
        </span>

        <span className="geography-summary-count">{counties.length}</span>

        <span className="geography-summary-footer">
            <span>Manage counties</span>
            <span className="geography-summary-arrow" aria-hidden="true">↗</span>
        </span>
    </button>

    <button
        type="button"
        className={`geography-summary geography-summary-link constituencies ${
            activeTab === "constituencies" ? "selected" : ""
        }`}
        onClick={() => openGeographyTable("constituencies")}
        aria-label={`View registered constituencies: ${constituencies.length}`}
        aria-pressed={activeTab === "constituencies"}
    >
        <span className="geography-summary-top">
            <span className="geography-summary-icon constituencies-icon">
                <Landmark size={23} />
            </span>
            <span className="geography-summary-label">Total Constituencies</span>
        </span>

        <span className="geography-summary-count">{constituencies.length}</span>

        <span className="geography-summary-footer">
            <span>Manage constituencies</span>
            <span className="geography-summary-arrow" aria-hidden="true">↗</span>
        </span>
    </button>

    <button
        type="button"
        className={`geography-summary geography-summary-link wards ${
            activeTab === "wards" ? "selected" : ""
        }`}
        onClick={() => openGeographyTable("wards")}
        aria-label={`View registered wards: ${wards.length}`}
        aria-pressed={activeTab === "wards"}
    >
        <span className="geography-summary-top">
            <span className="geography-summary-icon wards-icon">
                <MapPinned size={23} />
            </span>
            <span className="geography-summary-label">Total Wards</span>
        </span>

        <span className="geography-summary-count">{wards.length}</span>

        <span className="geography-summary-footer">
            <span>Manage wards</span>
            <span className="geography-summary-arrow" aria-hidden="true">↗</span>
        </span>
    </button>

    <button
        type="button"
        className={`geography-summary geography-summary-link polling-stations ${
            activeTab === "polling-stations" ? "selected" : ""
        }`}
        onClick={() => openGeographyTable("polling-stations")}
        aria-label={`View registered polling stations: ${pollingStations.length}`}
        aria-pressed={activeTab === "polling-stations"}
    >
        <span className="geography-summary-top">
            <span className="geography-summary-icon polling-stations-icon">
                <Vote size={23} />
            </span>
            <span className="geography-summary-label">Total Polling Stations</span>
        </span>

        <span className="geography-summary-count">{pollingStations.length}</span>

        <span className="geography-summary-footer">
            <span>Manage polling stations</span>
            <span className="geography-summary-arrow" aria-hidden="true">↗</span>
        </span>
    </button>
</section>


                <section
                    className={`geography-card geography-tab-panel ${activeTab !== "counties" ? "geography-tab-hidden" : ""
                        }`}
                    role="tabpanel"
                    aria-label="County management"
                >
                    <div className="geography-card-header">
                        <div>
                            <h2>
                                {editingCountyId ? "Edit County" : "Add County"}
                            </h2>
                            <p>
                                {editingCountyId
                                    ? "Update the county details below."
                                    : "Enter the county name and its unique code."}
                            </p>
                        </div>
                    </div>

                    <form
                        className="geography-form"
                        onSubmit={handleCountySubmit}
                    >
                        <label>
                            County Name
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="e.g. Nairobi"
                                minLength={2}
                                maxLength={100}
                                autoComplete="off"
                                required
                            />
                        </label>

                        <label>
                            County Code
                            <input
                                type="text"
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                                placeholder="e.g. 047"
                                minLength={2}
                                maxLength={20}
                                autoComplete="off"
                                required
                            />
                        </label>

                        <div className="geography-form-actions">
                            <button
                                type="submit"
                                disabled={saving}
                                className="geography-primary-button"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingCountyId
                                        ? "Save Changes"
                                        : "Add County"}
                            </button>

                            {editingCountyId && (
                                <button
                                    type="button"
                                    className="geography-secondary-button"
                                    onClick={handleCancelCountyEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section
                    className={`geography-card geography-tab-panel ${activeTab !== "constituencies" ? "geography-tab-hidden" : ""
                        }`}
                    role="tabpanel"
                    aria-label="Constituency management"
                >
                    <div className="geography-card-header">
                        <div>
                            <h2>
                                {editingConstituencyId
                                    ? "Edit Constituency"
                                    : "Add Constituency"}
                            </h2>

                            <p>
                                {editingConstituencyId
                                    ? "Update the constituency details and its parent county."
                                    : "Select a parent county, then enter the constituency details."}
                            </p>
                        </div>
                    </div>

                    {counties.length === 0 ? (
                        <div className="geography-empty-state" role="status">
                            <p>
                                No counties are registered yet. Add a county before
                                creating a constituency.
                            </p>
                        </div>
                    ) : (
                        <form
                            className="geography-form"
                            onSubmit={handleConstituencySubmit}
                        >
                            <label>
                                Parent County
                                <select
                                    value={countyId}
                                    onChange={(event) => setCountyId(event.target.value)}
                                    required
                                    aria-label="Select parent county"
                                >
                                    <option value="">Select a county</option>

                                    {counties.map((county) => (
                                        <option key={county.id} value={county.id}>
                                            {county.name} ({county.code})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Constituency Name
                                <input
                                    type="text"
                                    value={constituencyName}
                                    onChange={(event) =>
                                        setConstituencyName(event.target.value)
                                    }
                                    placeholder="e.g. Westlands"
                                    minLength={2}
                                    maxLength={100}
                                    autoComplete="off"
                                    required
                                />
                            </label>

                            <label>
                                Constituency Code
                                <input
                                    type="text"
                                    value={constituencyCode}
                                    onChange={(event) =>
                                        setConstituencyCode(event.target.value)
                                    }
                                    placeholder="Enter a unique code"
                                    minLength={2}
                                    maxLength={20}
                                    autoComplete="off"
                                    required
                                />
                            </label>

                            <div className="geography-form-actions">
                                <button
                                    type="submit"
                                    disabled={
                                        savingConstituency ||
                                        counties.length === 0 ||
                                        !countyId
                                    }
                                    className="geography-primary-button"
                                >
                                    {savingConstituency
                                        ? "Saving..."
                                        : editingConstituencyId
                                            ? "Save Changes"
                                            : "Add Constituency"}
                                </button>

                                {editingConstituencyId && (
                                    <button
                                        type="button"
                                        className="geography-secondary-button"
                                        onClick={handleCancelConstituencyEdit}
                                        disabled={savingConstituency}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </section>

                <section className="geography-card">
                    <div className="geography-card-header">
                        <h2>
                            {editingWardId ? "Edit Ward" : "Add Ward"}
                        </h2>
                        <p>
                            Select the constituency that this ward belongs to.
                        </p>
                    </div>

                    <form
                        className="geography-form"
                        onSubmit={handleWardSubmit}
                    >
                        <label>
                            Constituency
                            <select
                                value={wardConstituencyId}
                                onChange={(event) =>
                                    setWardConstituencyId(
                                        event.target.value
                                    )
                                }
                                required
                            >
                                <option value="">
                                    Select a constituency
                                </option>

                                {constituencies.map((constituency) => (
                                    <option
                                        key={constituency.id}
                                        value={constituency.id}
                                    >
                                        {constituency.name} —{" "}
                                        {getCountyName(constituency)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Ward Name
                            <input
                                type="text"
                                value={wardName}
                                onChange={(event) =>
                                    setWardName(event.target.value)
                                }
                                placeholder="e.g. Parklands"
                                minLength={2}
                                required
                            />
                        </label>

                        <label>
                            Ward Code
                            <input
                                type="text"
                                value={wardCode}
                                onChange={(event) =>
                                    setWardCode(event.target.value)
                                }
                                placeholder="Enter a unique ward code"
                                minLength={2}
                                required
                            />
                        </label>


                        <button
                            type="submit"
                            disabled={
                                savingWard ||
                                constituencies.length === 0 ||
                                !wardConstituencyId
                            }
                            className="geography-primary-button"
                        >
                            {savingWard
                                ? "Saving..."
                                : editingWardId
                                    ? "Save Changes"
                                    : "Add Ward"}
                        </button>

                        {editingWardId && (
                            <button
                                type="button"
                                className="geography-secondary-button"
                                onClick={handleCancelWardEdit}
                                disabled={savingWard}
                            >
                                Cancel
                            </button>
                        )}

                    </form>
                </section>

                <section
                    className={`geography-card geography-tab-panel ${activeTab !== "polling-stations"
                            ? "geography-tab-hidden"
                            : ""
                        }`}
                    role="tabpanel"
                    aria-label="Polling station management"
                >
                    <div className="geography-card-header">
                        <div>
                            <h2>
                                {editingStationId
                                    ? "Edit Polling Station"
                                    : "Add Polling Station"}
                            </h2>
                            <p>
                                Register a polling station and associate it with a ward.
                            </p>
                        </div>
                    </div>

                    {wards.length === 0 ? (
                        <div className="geography-empty-state" role="status">
                            <p>
                                No wards are registered yet. Create a ward before adding
                                a polling station.
                            </p>
                        </div>
                    ) : (
                        <form
                            className="geography-form"
                            onSubmit={handlePollingStationSubmit}
                        >
                            <label>
                                Ward
                                <select
                                    value={stationWardId}
                                    onChange={(event) =>
                                        setStationWardId(event.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.id}>
                                            {ward.name} — {getConstituencyName(ward)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Polling Station Name
                                <input
                                    type="text"
                                    value={stationName}
                                    onChange={(event) =>
                                        setStationName(event.target.value)
                                    }
                                    placeholder="e.g. Parklands Primary School"
                                    minLength={2}
                                    maxLength={150}
                                    autoComplete="off"
                                    required
                                />
                            </label>

                            <label>
                                Polling Station Code
                                <input
                                    type="text"
                                    value={stationCode}
                                    onChange={(event) =>
                                        setStationCode(event.target.value)
                                    }
                                    placeholder="Enter a unique station code"
                                    minLength={2}
                                    maxLength={30}
                                    autoComplete="off"
                                    required
                                />
                            </label>

                            <label>
                                Registered Voters
                                <input
                                    type="number"
                                    value={registeredVoters}
                                    onChange={(event) =>
                                        setRegisteredVoters(event.target.value)
                                    }
                                    min={0}
                                    step={1}
                                    placeholder="Enter registered voters"
                                    required
                                />
                            </label>

                            <div className="geography-form-actions">
                                <button
                                    type="submit"
                                    className="geography-primary-button"
                                    disabled={
                                        savingStation ||
                                        deletingStationId !== null ||
                                        !stationWardId
                                    }
                                >
                                    {savingStation
                                        ? "Saving..."
                                        : editingStationId
                                            ? "Save Changes"
                                            : "Add Polling Station"}
                                </button>

                                {editingStationId && (
                                    <button
                                        type="button"
                                        className="geography-secondary-button"
                                        onClick={handleCancelPollingStationEdit}
                                        disabled={savingStation}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </section>
                <section
                    id="geography-table-counties"
                    className={`geography-card geography-tab-panel ${activeTab !== "counties" ? "geography-tab-hidden" : ""
                        }`}
                    role="tabpanel"
                    aria-labelledby="geography-tab-counties"
                >
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
                            No counties found. Add the first county above.
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
                                        <th>Actions</th>
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
                                                {
                                                    constituencies.filter(
                                                        (item) =>
                                                            item.countyId ===
                                                            county.id
                                                    ).length
                                                }
                                            </td>
                                            <td>
                                                <div className="geography-actions">
                                                    <button
                                                        type="button"
                                                        className="geography-secondary-button"
                                                        onClick={() => handleEditCounty(county)}
                                                        disabled={saving || deletingCountyId !== null}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="geography-danger-button"
                                                        onClick={() => void handleDeleteCounty(county)}
                                                        disabled={saving || deletingCountyId !== null}
                                                    >
                                                        {deletingCountyId === county.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section
                    id="geography-table-constituencies"
                    className={`geography-card geography-tab-panel ${activeTab !== "constituencies"
                            ? "geography-tab-hidden"
                            : ""
                        }`}
                    role="tabpanel"
                    aria-labelledby="geography-tab-constituencies"
                >
                    <div className="geography-card-header">
                        <h2>Registered Constituencies</h2>
                        <p>
                            Constituencies and their parent counties.
                        </p>
                    </div>

                    {loading ? (
                        <p className="geography-empty">
                            Loading constituencies...
                        </p>
                    ) : constituencies.length === 0 ? (
                        <p className="geography-empty">
                            No constituencies found. Add one using the form above.
                        </p>
                    ) : (
                        <div className="geography-table-wrapper">
                            <table className="geography-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Constituency</th>
                                        <th>Code</th>
                                        <th>County</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {constituencies.map(
                                        (constituency, index) => (
                                            <tr key={constituency.id}>
                                                <td>{index + 1}</td>
                                                <td>{constituency.name}</td>
                                                <td>
                                                    <span className="geography-code">
                                                        {constituency.code}
                                                    </span>
                                                </td>
                                                <td>{getCountyName(constituency)}</td>

                                                <td>
                                                    <div className="geography-actions">
                                                        <button
                                                            type="button"
                                                            className="geography-secondary-button"
                                                            onClick={() =>
                                                                handleEditConstituency(constituency)
                                                            }
                                                            disabled={
                                                                savingConstituency ||
                                                                deletingConstituencyId !== null
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            id="geography-tab-constituencies"
                                                            type="button"
                                                            className="geography-danger-button"
                                                            onClick={() =>
                                                                void handleDeleteConstituency(constituency)
                                                            }
                                                            disabled={
                                                                savingConstituency ||
                                                                deletingConstituencyId !== null
                                                            }
                                                        >
                                                            {deletingConstituencyId === constituency.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section
                    id="geography-table-wards"
                    className={`geography-card geography-tab-panel ${activeTab !== "wards" ? "geography-tab-hidden" : ""
                        }`}
                    role="tabpanel"
                    aria-labelledby="geography-tab-wards"
                >
                    <div className="geography-card-header">
                        <h2>Registered Wards</h2>
                        <p>
                            Wards and the constituencies they belong to.
                        </p>
                    </div>

                    {loading ? (
                        <p className="geography-empty">
                            Loading wards...
                        </p>
                    ) : wards.length === 0 ? (
                        <p className="geography-empty">
                            No wards found. Add the first ward using the form above.
                        </p>
                    ) : (
                        <div className="geography-table-wrapper">
                            <table className="geography-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ward Name</th>
                                        <th>Code</th>
                                        <th>Constituency</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {wards.map((ward, index) => (
                                        <tr key={ward.id}>
                                            <td>{index + 1}</td>
                                            <td>{ward.name}</td>
                                            <td>
                                                <span className="geography-code">
                                                    {ward.code}
                                                </span>
                                            </td>

                                            <td>
                                                {getConstituencyName(ward)}
                                            </td>

                                            <td>
                                                <div className="geography-actions">
                                                    <button
                                                        type="button"
                                                        className="geography-secondary-button"
                                                        onClick={() => handleEditWard(ward)}
                                                        disabled={
                                                            savingWard ||
                                                            deletingWardId !== null
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="geography-danger-button"
                                                        onClick={() => void handleDeleteWard(ward)}
                                                        disabled={
                                                            savingWard ||
                                                            deletingWardId !== null
                                                        }
                                                    >
                                                        {deletingWardId === ward.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section
                    id="geography-table-polling-stations"
                    className={`geography-card geography-tab-panel ${activeTab !== "polling-stations"
                            ? "geography-tab-hidden"
                            : ""
                        }`}
                    role="tabpanel"
                    aria-labelledby="geography-tab-polling-stations"
                >
                    <div className="geography-card-header">
                        <h2>Registered Polling Stations</h2>
                        <p>
                            Polling stations, their administrative areas, and registered voters.
                        </p>
                    </div>

                    {loading ? (
                        <p className="geography-empty">
                            Loading polling stations...
                        </p>
                    ) : pollingStations.length === 0 ? (
                        <p className="geography-empty">
                            No polling stations found. Add the first station above.
                        </p>
                    ) : (
                        <div className="geography-table-wrapper">
                            <table className="geography-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Polling Station</th>
                                        <th>Code</th>
                                        <th>Ward</th>
                                        <th>Constituency</th>
                                        <th>County</th>
                                        <th>Registered Voters</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pollingStations.map((station, index) => {
                                        const ward =
                                            station.ward ??
                                            wards.find(
                                                (item) => item.id === station.wardId
                                            );

                                        const constituency =
                                            ward?.constituency ??
                                            constituencies.find(
                                                (item) =>
                                                    item.id === ward?.constituencyId
                                            );

                                        const county =
                                            constituency?.county ??
                                            counties.find(
                                                (item) =>
                                                    item.id === constituency?.countyId
                                            );

                                        return (
                                            <tr key={station.id}>
                                                <td>{index + 1}</td>
                                                <td>{station.name}</td>
                                                <td>
                                                    <span className="geography-code">
                                                        {station.code}
                                                    </span>
                                                </td>
                                                <td>{ward?.name ?? "Unknown"}</td>
                                                <td>
                                                    {constituency?.name ?? "Unknown"}
                                                </td>
                                                <td>{county?.name ?? "Unknown"}</td>
                                                <td>
                                                    {station.registeredVoters.toLocaleString()}
                                                </td>

                                                <td>
                                                    <div className="geography-actions">
                                                        <button
                                                            type="button"
                                                            className="geography-secondary-button"
                                                            onClick={() => handleEditPollingStation(station)}
                                                            disabled={
                                                                savingStation ||
                                                                deletingStationId !== null
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="geography-danger-button"
                                                            onClick={() =>
                                                                void handleDeletePollingStation(station)
                                                            }
                                                            disabled={
                                                                savingStation ||
                                                                deletingStationId !== null
                                                            }
                                                        >
                                                            {deletingStationId === station.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })}
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
