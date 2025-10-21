import { MCPServer } from "@mastra/mcp";
import { storyAgent } from "../agents";

export const server = new MCPServer({
  name: "My Custom Server",
  version: "1.0.0",
  tools: {},
  agents: { storyAgent },
  // workflows: {
  //   dataProcessingWorkflow, // this workflow will become tool "run_dataProcessingWorkflow"
  // }
});
