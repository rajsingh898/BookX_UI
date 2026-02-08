function StatusBadge({ status }) {
  return (
    <span className={status === "READ" ? "read" : "unread"}>
      {status}
    </span>
  );
}
