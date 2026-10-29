
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface County {
    id: string;
    name: string;
    code: string;
    constituencies?: Constituency[];
}

export interface Constituency {
    id: string;
    name: string;
    code: string;
    countyId: string;
    county?: County;
    wards?: unknown[];
}
export interface Ward {
    id: string;
    name: string;
    code: string;
    constituencyId: string;
    constituency?: Constituency;
    pollingStations?: unknown[];
}

export interface PollingStation {
    id: string;
    name: string;
    code: string;
    registeredVoters: number;
    wardId: string;
    ward?: Ward & {
        constituency?: Constituency & {
            county?: County;
        };
    };
}


interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

async function request<T>(
    endpoint: string,
    method = "GET",
    body?: unknown
): Promise<T> {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
        },
        ...(body !== undefined
            ? { body: JSON.stringify(body) }
            : {}),
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Geography request failed."
        );
    }

    return result.data;
}

export const geographyService = {
    getCounties: () =>
        request<County[]>("/geography/counties"),

    createCounty: (data: {
        name: string;
        code: string;
    }) =>
        request<County>(
            "/geography/counties",
            "POST",
            data
        ),

    updateCounty: (
        id: string,
        data: { name?: string; code?: string }
    ) =>
        request<County>(
            `/geography/counties/${encodeURIComponent(id)}`,
            "PUT",
            data
        ),

    deleteCounty: (id: string) =>
        request<unknown>(
            `/geography/counties/${encodeURIComponent(id)}`,
            "DELETE"
        ),


    getConstituencies: () =>
        request<Constituency[]>("/geography/constituencies"),

    createConstituency: (data: {
        name: string;
        code: string;
        countyId: string;
    }) =>
        request<Constituency>(
            "/geography/constituencies",
            "POST",
            data
        ),
    updateConstituency: (
        id: string,
        data: { name?: string; code?: string },
    ) =>
        request<Constituency>(
            `/geography/constituencies/${encodeURIComponent(id)}`,
            "PUT",
            data,
        ),

    deleteConstituency: (id: string) =>
        request<unknown>(
            `/geography/constituencies/${encodeURIComponent(id)}`,
            "DELETE",
        ),
    getWards: () => request<Ward[]>("/geography/wards"),

    createWard: (data: {
        name: string;
        code: string;
        constituencyId: string;
    }) => request<Ward>("/geography/wards", "POST", data),
    
    updateWard: (
        id: string,
        data: { name?: string; code?: string },
    ) =>
        request<Ward>(
            `/geography/wards/${encodeURIComponent(id)}`,
            "PUT",
            data,
        ),

    deleteWard: (id: string) =>
        request<unknown>(
            `/geography/wards/${encodeURIComponent(id)}`,
            "DELETE",
        ),



    getPollingStations: () =>
        request<PollingStation[]>("/geography/polling-stations"),

    createPollingStation: (data: {
        name: string;
        code: string;
        registeredVoters: number;
        wardId: string;
    }) =>
        request<PollingStation>(
            "/geography/polling-stations",
            "POST",
            data
        ),
        
    updatePollingStation: (
        id: string,
        data: {
            name?: string;
            code?: string;
            registeredVoters?: number;
        },
    ) =>
        request<PollingStation>(
            `/geography/polling-stations/${encodeURIComponent(id)}`,
            "PUT",
            data,
        ),

    deletePollingStation: (id: string) =>
        request<unknown>(
            `/geography/polling-stations/${encodeURIComponent(id)}`,
            "DELETE",
        ),


};
