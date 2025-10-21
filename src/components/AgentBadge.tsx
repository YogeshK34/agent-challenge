import { agentCatalog, defaultAgentId, type AgentId } from "@/mastra/agents/meta"

type Props = {
  id?: AgentId
  className?: string
  showDescription?: boolean
}

export function AgentBadge({ id = defaultAgentId, className, showDescription = false }: Props) {
  const info = agentCatalog[id]

  return (
    <div
      className={className}
      title={info.description}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        background: "#f2f4f7",
        color: "#111827",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#a855f7",
          display: "inline-block",
        }}
      />
      <span>{info.label} Agent</span>
      {showDescription && <span style={{ fontWeight: 400, color: "#4b5563" }}>— {info.description}</span>}
    </div>
  )
}
