import React, { createContext, useContext, useEffect, useState } from "react";

import Api from "../api/api.source";

const MessageContext = createContext(null);

export function MessageProvider({ children }) {
  const axios = Api.instance.getAxios();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/messages");

      setMessages(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  /* ---------------- CREATE ---------------- */

  const createMessage = async (message) => {
   
    
    const { data } = await axios.post("/messages", message);
    setMessages((prev) => [data.data, ...prev]);

    return data;
  };

  /* ---------------- UPDATE ---------------- */

  const updateMessage = async (message) => {
   

    const { data } = await axios.put(`/messages/${message._id}`, message);

    setMessages((prev) =>
      prev.map((cat) => (cat._id === message._id ? data.data : cat))
    );

    return data;
  };

  /* ---------------- DELETE ---------------- */

  const deleteMessage = async (id) => {
    await axios.delete(`/messages/${id}`);
    setMessages((prev) => prev.filter((cat) => cat._id !== id));
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        fetchMessages,
        createMessage,
        updateMessage,
        deleteMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessages must be used inside MessageProvider");
  }
  return context;
};
