import MemberCard from "./MemberCard";

const ProjectMembers = ({
  members = [],
  canManage = false,
  onRemove,
}) => {
  if (!members.length) {
    return (
      <div className="text-center py-10 text-slate-500">
        No members found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {members.map((member) => (
        <MemberCard
          key={member._id}
          member={member}
          canRemove={canManage}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default ProjectMembers;