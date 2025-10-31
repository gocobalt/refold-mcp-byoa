from google.adk.models.lite_llm import LiteLlm
from google.adk.agents import Agent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StreamableHTTPConnectionParams
from dotenv import load_dotenv
load_dotenv()
import os
MCP_URL = os.getenv("MCP_URL")
MODEL_NAME=os.getenv("MODEL_NAME")
MODEL_URL=os.getenv("MODEL_URL")
MODEL_API_KEY=os.getenv("MODEL_API_KEY")
root_agent = Agent(
        name="multi_tool_agent",
        model=LiteLlm(
            model=MODEL_NAME,
            api_key=MODEL_API_KEY,
            api_base=MODEL_URL
        ),
        tools=[MCPToolset(
            connection_params=StreamableHTTPConnectionParams(
             url=MCP_URL
            ),
        )
],
        description="Refold.AI Helpful Agent",
        instruction="""You are a friendly and helpful assistant powered by Refold.ai MCP""",
    )





