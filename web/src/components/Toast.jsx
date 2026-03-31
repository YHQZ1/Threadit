export default function Toast({ msg, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        background: "#1A1917",
        color: "#FAF7F2",
        padding: "10px 22px",
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 600,
        opacity: visible ? 1 : 0,
        transition: "opacity .25s, transform .25s",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        zIndex: 300,
        border: "1px solid #3A3834",
        letterSpacing: "-.1px",
      }}
    >
      {msg}
    </div>
  );
}