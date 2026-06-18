// Thin, typed-ish service layer over apiCall — one function per backend endpoint.
// Keeps pages free of URL strings and centralizes the API surface.
import { apiCall } from "../apiConfig/apiCall";

export const eventsApi = {
    // Public discovery
    discover: (params = {}) => apiCall({ url: "/events", method: "GET", data: params }),
    getPublic: (id) => apiCall({ url: `/events/${id}`, method: "GET" }),
    getSeatMap: (id) => apiCall({ url: `/events/${id}/seats`, method: "GET" }),

    // Organizer management
    listMine: (params = {}) => apiCall({ url: "/events/manage", method: "GET", data: params }),
    getMine: (id) => apiCall({ url: `/events/manage/${id}`, method: "GET" }),
    create: (data) => apiCall({ url: "/events/manage", method: "POST", data }),
    update: (id, data) => apiCall({ url: `/events/manage/${id}`, method: "PUT", data }),
    remove: (id) => apiCall({ url: `/events/manage/${id}`, method: "DELETE" }),
    generateSeats: (id) => apiCall({ url: `/events/manage/${id}/generate-seats`, method: "POST" }),
    publish: (id) => apiCall({ url: `/events/manage/${id}/publish`, method: "POST" }),
};

export const venuesApi = {
    list: (params = {}) => apiCall({ url: "/venues", method: "GET", data: params }),
    get: (id) => apiCall({ url: `/venues/${id}`, method: "GET" }),
    create: (data) => apiCall({ url: "/venues", method: "POST", data }),
    update: (id, data) => apiCall({ url: `/venues/${id}`, method: "PUT", data }),
    remove: (id) => apiCall({ url: `/venues/${id}`, method: "DELETE" }),
    setSeatLayout: (id, seats) => apiCall({ url: `/venues/${id}/seat-layout`, method: "PUT", data: { seats } }),
};

export const bookingsApi = {
    lock: (eventId, seatIds) => apiCall({ url: "/bookings/lock", method: "POST", data: { eventId, seatIds } }),
    releaseLock: (lockId) => apiCall({ url: `/bookings/lock/${lockId}`, method: "DELETE" }),
    create: (lockId) => apiCall({ url: "/bookings", method: "POST", data: { lockId } }),
    list: (params = {}) => apiCall({ url: "/bookings", method: "GET", data: params }),
    get: (id) => apiCall({ url: `/bookings/${id}`, method: "GET" }),
    pay: (id, success) => apiCall({ url: `/bookings/${id}/pay`, method: "POST", data: { success } }),
    cancel: (id) => apiCall({ url: `/bookings/${id}/cancel`, method: "POST" }),
};
