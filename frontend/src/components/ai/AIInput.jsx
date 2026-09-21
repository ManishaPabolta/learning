import React, { useState } from "react";

const AIInput = ({
  onSend,
  loading = false,
  placeholder = "Ask AI anything...",
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = message.trim();

    if (!value || loading) {
      return;
    }

    onSend(value);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t bg-white p-3"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      <button
        type="submit"
        disabled={loading || !message.trim()}
        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};

export default AIInput;