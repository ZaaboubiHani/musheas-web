import React, { createContext, useContext, useEffect, useState } from "react";
import Api from "../api/api.source";

const RequestContext = createContext(null);

export function RequestProvider({ children }) {
  const axios = Api.instance.getAxios();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/requests");
      setRequests(data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ---------------- CREATE ---------------- */

  const createRequest = async (requestData) => {
    try {
      const { data } = await axios.post("/requests", requestData);
      // Add the new request to the list
      setRequests((prev) => [data.data, ...prev]);
      return data;
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  };

  /* ---------------- UPDATE ---------------- */

  const updateRequest = async (id, updateData) => {
    try {
      const { data } = await axios.put(`/requests/${id}`, updateData);
      // Update the request in the list
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? data.data : req))
      );
      return data;
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteRequest = async (id) => {
    try {
      await axios.delete(`/requests/${id}`);
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  };

  /* ---------------- UPDATE STATUS ---------------- */

  const updateRequestStatus = async (id, status) => {
    try {
      const { data } = await axios.patch(`/requests/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? data.data : req))
      );
      return data;
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  };

  /* ---------------- GET REQUEST BY ID ---------------- */

  const getRequestById = (id) => {
    return requests.find((req) => req._id === id);
  };

  /* ---------------- GET REQUESTS BY ORIGIN ---------------- */

  const getRequestsByOrigin = (origin) => {
    return requests.filter((req) => req.requestOrigin === origin);
  };

  /* ---------------- GET REQUESTS BY TYPE ---------------- */

  const getRequestsByType = (type) => {
    return requests.filter((req) => req.type === type);
  };

  /* ---------------- GET REQUESTS BY STATUS ---------------- */

  const getRequestsByStatus = (status) => {
    return requests.filter((req) => req.status === status);
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        loading,
        fetchRequests,
        createRequest,
        updateRequest,
        deleteRequest,
        updateRequestStatus,
        getRequestById,
        getRequestsByOrigin,
        getRequestsByType,
        getRequestsByStatus,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequests must be used inside RequestProvider");
  }
  return context;
};