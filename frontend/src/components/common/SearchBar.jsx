import React, { useEffect, useState } from "react";

const SearchBar = ({
  value = "",
  onChange,
  onSearch,
  placeholder = "Search courses...",
  className = "",
  debounce = 500,
}) => {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(query);
      }

      if (onSearch) {
        onSearch(query);
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [query, debounce, onChange, onSearch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    onChange?.(query);
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery("");
    onChange?.("");
    onSearch?.("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${className}`}
    >
      <div
        className="
          group
          relative
          flex
          items-center
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300

          hover:border-emerald-200
          hover:shadow-md
          hover:shadow-emerald-500/5

          focus-within:border-emerald-400
          focus-within:ring-4
          focus-within:ring-emerald-500/10
          focus-within:shadow-lg
          focus-within:shadow-emerald-500/5
        "
      >
        {/* Soft Focus Glow */}
        <div
          className="
            pointer-events-none
            absolute
            -left-10
            top-1/2
            h-20
            w-20
            -translate-y-1/2
            rounded-full
            bg-emerald-100/40
            blur-2xl
            opacity-0
            transition-opacity
            duration-500
            group-focus-within:opacity-100
          "
        />

        {/* Search Icon */}
        <div
          className="
            pointer-events-none
            absolute
            left-4
            z-10
            text-slate-400
            transition-all
            duration-300
            group-focus-within:scale-110
            group-focus-within:text-emerald-600
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder={placeholder}
          className="
            relative
            z-10
            w-full
            bg-transparent
            py-3.5
            pl-12
            pr-24
            text-sm
            text-slate-800
            outline-none

            placeholder:text-slate-400
          "
        />

        {/* Clear */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              right-14
              z-20
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-lg
              text-slate-400
              transition-all
              duration-300
              hover:rotate-90
              hover:bg-emerald-50
              hover:text-emerald-600
              active:scale-90
            "
          >
            ×
          </button>
        )}

        {/* Search Button */}
        <button
          type="submit"
          className="
            absolute
            right-2
            z-20
            flex
            h-9
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-r
            from-emerald-500
            to-green-600
            px-4
            text-xs
            font-bold
            text-white
            shadow-md
            shadow-emerald-500/20
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:from-emerald-600
            hover:to-green-700
            hover:shadow-lg
            hover:shadow-emerald-500/25
            active:scale-95
          "
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;