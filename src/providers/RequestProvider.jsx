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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ---------------- CREATE ---------------- */

  const createRequest = async (request) => {

    const { data } = await axios.post("/requests", request);
  
    return data;
  };

  /* ---------------- UPDATE ---------------- */

  const updateRequest = async ({ _id, name, image }, origin) => {
    const payload = {
      name,
    };

    if (image) {
      payload.image = uploaded.data._id;
      payload.imageUrl = uploaded.data.url;
      deleteFile(origin.image);
    } else {
      payload.image = origin.image;
      payload.imageUrl = origin.imageUrl;
    }

    const { data } = await axios.put(`/requests/${_id}`, payload);

    setRequests((prev) =>
      prev.map((cat) => (cat._id === _id ? data.data : cat))
    );

    return data;
  };

  /* ---------------- DELETE ---------------- */

  const deleteRequest = async (id,image) => {
    await axios.delete(`/requests/${id}`);
    deleteFile(image)
    setRequests((prev) => prev.filter((cat) => cat._id !== id));
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
