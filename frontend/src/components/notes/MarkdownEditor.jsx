const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Write your Markdown note...",
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full min-h-[400px] resize-y border border-slate-300 rounded-xl p-5 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
};

export default MarkdownEditor;