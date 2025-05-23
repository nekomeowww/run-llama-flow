import { mcpTool } from "fluere/interrupter/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fileParseWorkflow } from "../workflows/file-parse-agent.js";
import { createWorkflow, workflowEvent } from "fluere";
import { consume } from "fluere/stream";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

export const startEvent = workflowEvent<{
  filePath: string;
}>();
export const stopEvent = workflowEvent<{
  content: { type: "text"; text: string }[];
}>();

const wrappedWorkflow = createWorkflow();

wrappedWorkflow.handle([startEvent], async ({ data: { filePath } }) => {
  const { stream, sendEvent } = fileParseWorkflow.createContext();
  sendEvent(startEvent.with({ filePath }));
  await consume(stream, stopEvent);
  return stopEvent.with({
    content: [
      {
        type: "text",
        text: fileParseWorkflow.getStore().output,
      },
    ],
  });
});

server.tool(
  "list directory",
  {
    filePath: z.string(),
  },
  mcpTool(wrappedWorkflow, startEvent, stopEvent),
);

const transport = new StdioServerTransport();

server.connect(transport).then(() => {
  console.log("Connected");
});
