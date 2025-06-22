# n8n Workflows

This section outlines how to create and update workflows used by OmniFeed.

1. Open the n8n editor at `http://localhost:5678` and create a new workflow.
2. Configure triggers and nodes to fetch external content.
3. Save the workflow as JSON under `backend/workflows/`.
4. Expose the workflow via the backend by adding an endpoint in `server.js`.

Workflows can be versioned and stored in source control for easier collaboration.
