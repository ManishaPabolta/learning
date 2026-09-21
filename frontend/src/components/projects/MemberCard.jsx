import { User, Trash2 } from "lucide-react";

const MemberCard = ({
  member,
  canRemove = false,
  onRemove,
}) => {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <User size={18} className="text-indigo-600" />
        </div>

        <div>
          <h4 className="font-medium">
            {member?.name || "Unknown User"}
          </h4>

          <p className="text-sm text-slate-500">
            {member?.email}
          </p>
        </div>
      </div>

      {canRemove && (
        <button
          onClick={() => onRemove(member._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          title="Remove member"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
};

export default MemberCard;