## LLM-based RAG Application
This is a full-stack web application that allows users to store text content from a webpage (via URL) into a MongoDB vector database after embedding the content using an LLM (Large Language Model). Users can also query the stored data to receive precise answers based on the embedded content. The application includes a Node.js backend and a React frontend with a user interface.

### Features
- URL Embedding: Extracts and embeds webpage content into a MongoDB vector database.
- Query System: Allows users to ask questions, and the app responds with answers based on the embedded content.
- Responsive Design: Frontend styled using Tailwind CSS and designed to mimic ChatGPT’s interface.
- Interactive Sidebar: Sidebar for adding URLs and a chat-like area for user interaction.
- Real-Time Feedback: Provides loading indicators and success/error messages during operations.

### Technologies Used
#### Frontend
- React with Vite for a fast and responsive user interface.
- Tailwind CSS for styling.
- React Icons for UI enhancements.
#### Backend
- Node.js with Express for API endpoints.
- MongoDB with Atlas Search for storing and querying vectorized data.
- OpenAI API's *text-embedding-ada-002* model is used for text embedding to vectorize data.
- OpenAI API's *gpt-3.5-turbo-16k* model is used for context-based query from vector database

#### Preview
![image](https://github.com/user-attachments/assets/882fc172-4d48-4f40-8815-c33ec04cf482)
Video:
https://github.com/user-attachments/assets/7f0d4dcf-d72a-4689-9ea5-42b690e5243a

### Future Improvements
- Add user authentication and session management.
- Enable bulk URL uploads for embedding.
- Implement advanced query filtering and pagination.
- Enhance error handling and logging.
