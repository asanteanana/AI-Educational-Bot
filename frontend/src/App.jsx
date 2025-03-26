import { useState } from 'react'
import Navbar from './components/Navbar'
import ChatInput from './components/ChatInput'
import ResponseCard from './components/ResponseCard'

function App() {
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use the appropriate API URL based on environment
  const API_URL = import.meta.env.VITE_API_URL || '/api/ask';

  const handleSend = async (query) => {
    try {
      setIsLoading(true);

      // For demo purposes, simulate a response if no backend is available
      // Remove this in production when backend is connected
      if (window.location.hostname === 'ai-educational-bot.vercel.app') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add a simulated response
        const demoResponses = {
          "hello": "Hello! I'm your educational AI assistant. How can I help you today?",
          "who are you": "I'm an AI Educational Bot designed to help answer your questions and make learning more accessible.",
          "how does this work": "Simply type your question in the input field, and I'll provide an answer. You can also listen to the response with the Listen button.",
          "what can you do": "I can answer educational questions, provide explanations on various topics, and offer the information in both text and audio formats for better accessibility."
        };

        const answer = demoResponses[query.toLowerCase()] ||
          `This is a demonstration of the AI Educational Bot interface. In the full version, this would connect to a backend API that provides real AI-generated responses to your questions: "${query}"`;

        setResponses(prev => [...prev, { query, answer }]);
        setIsLoading(false);
        return;
      }

      // Real API call
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      setResponses(prev => [...prev, { query, answer: data.answer }]);
    } catch (error) {
      console.error('Error:', error);
      setResponses(prev => [...prev, {
        query,
        answer: "Sorry, I couldn't process your request at the moment. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
        {responses.length === 0 && (
          <div className="text-center mt-16 text-gray-500">
            <p className="text-xl">Ask me anything about your studies!</p>
            <p className="mt-2">Type your question in the input field above.</p>
          </div>
        )}
        <div className="space-y-6 mt-8">
          {responses.map((response, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600 font-medium">You asked:</p>
                <p className="text-gray-800">{response.query}</p>
              </div>
              <ResponseCard text={response.answer} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
