// src/utils/api.js

import axios from "axios";

// Smart API URL builder that handles duplicate /api prefixes
export const getApiUrl = (endpoint = '') => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
  
  // If baseUrl already ends with /api, don't add another /api
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}${endpoint}`;
  }
  
  // If baseUrl doesn't end with /api, add it
  return `${baseUrl}/api${endpoint}`;
};

const BASE_URL = getApiUrl();
const API_URL = getApiUrl();

/**
 * Fetch all temples
 */
export async function fetchTemples() {
  try {
    const res = await fetch(getApiUrl('/temples'));
    if (!res.ok) throw new Error("Failed to fetch temples");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const createTicket = async (templeId, formData, tickets) => {
  try {
    const payload = {
      templeId,
      devoteeName: formData?.primaryDevotee?.name,
      email: formData?.primaryDevotee?.email,
      phone: formData?.primaryDevotee?.phone,
      age: formData?.primaryDevotee?.age,
      tickets
    };
    const response = await axios.post(getApiUrl('/payments/checkout'), payload);
    return response.data?.url || null; // Stripe checkout URL
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to create checkout session';
    console.error("Error creating ticket:", message);
    throw new Error(message);
  }
}

/**
 * Increment temple visitor count
 * Used when a visitor enters the temple
 */
export async function incrementVisitor(templeId) {
  try {
    const res = await fetch(getApiUrl(`/temples/${templeId}/visit`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to increment visitor");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Create Stripe checkout session
 * tickets = { regular: 2, vip: 1, senior: 0 }
 */
export async function createCheckoutSession(templeId, tickets) {
  try {
    const res = await fetch(getApiUrl('/payments/checkout'), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templeId, tickets }),
    });
    if (!res.ok) throw new Error("Failed to create checkout session");
    const data = await res.json();
    return data.url;
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Book a ticket with authentication
 */
export async function bookTicket(token, payload) {
  try {
    const res = await fetch(getApiUrl('/bookings'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to book ticket");
    return await res.json();
  } catch (err) {
    console.error("Error booking ticket:", err);
    throw err;
  }
}

/**
 * Create a booking without Stripe (demo/fallback)
 */
export async function createBooking(templeId, formData, tickets) {
  try {
    const res = await fetch(getApiUrl('/bookings'), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templeId, formData, tickets })
    });
    if (!res.ok) throw new Error("Failed to create booking");
    return await res.json();
  } catch (err) {
    console.error("Error creating booking:", err);
    return null;
  }
}

/**
 * Fetch a booking (ticket) by id
 */
export async function getBooking(id) {
  try {
    console.log(`Fetching booking with ID: ${id}`);
    const res = await fetch(getApiUrl(`/bookings/${id}`));
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`Failed to fetch booking: ${res.status} ${res.statusText}`, errorData);
      throw new Error(`Failed to fetch booking: ${errorData.message || res.statusText}`);
    }
    const data = await res.json();
    console.log("Booking data received:", data);
    return data;
  } catch (err) {
    console.error("Error in getBooking:", err);
    throw err; // Re-throw to let the calling component handle it
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(id, status) {
  try {
    const res = await fetch(getApiUrl(`/bookings/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update booking status");
    return await res.json();
  } catch (err) {
    console.error("Error updating booking status:", err);
    throw err;
  }
}

/**
 * Delete booking
 */
export async function deleteBooking(id) {
  try {
    const res = await fetch(getApiUrl(`/bookings/${id}`), {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete booking");
    return await res.json();
  } catch (err) {
    console.error("Error deleting booking:", err);
    throw err;
  }
}

/**
 * Get temple by ID
 */
export async function getTemple(id) {
  try {
    const res = await fetch(getApiUrl(`/temples/${id}`));
    if (!res.ok) throw new Error("Failed to fetch temple");
    return await res.json();
  } catch (err) {
    console.error("Error fetching temple:", err);
    throw err;
  }
}