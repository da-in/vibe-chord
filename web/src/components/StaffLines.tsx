export function StaffLines() {
  return (
    <div className="staff-lines" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className="staff-lines__line" />
      ))}
    </div>
  );
}
