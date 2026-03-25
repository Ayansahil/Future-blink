# AI Prompt Visualizer

A full-stack project using the MERN stack and React Flow to visualize AI responses.

## Setup Instructions

1.  **Clone the repository.**
2.  **Backend Setup:**
    -   `cd Backend`
    -   `npm install`
    -   Create a `.env` file based on `.env.example`:
        ```env
        PORT=3000
        MONGO_URI=your_mongodb_uri
        OPENROUTER_API_KEY=your_api_key
        ```
    -   Run the backend: `npm run dev`
3.  **Frontend Setup:**
    -   `cd Frontend`
    -   `npm install`
    -   Run the frontend: `npm run dev` (it will proxy `/api` calls to port 3000).

## Features
-   Type a prompt in the input node.
-   Click "Run Flow" to see the AI response in the result node.
-   Click "Save" to store the conversation in MongoDB.

## Deployment
For Render.com, the backend is configured to serve the frontend's `dist/` folder when `NODE_ENV=production`.
-   Build the frontend: `cd Frontend && npm run build`
-   The backend will serve `Frontend/dist` automatically.
