import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function App() {
  const [companies, setCompanies] = useState<Array<Schema["Company"]["type"]>>([]);
  const [users, setUsers] = useState<Array<Schema["User"]["type"]>>([]);
  const [groupChats, setGroupChats] = useState<Array<Schema["GroupChat"]["type"]>>([]);
  const [messages, setMessages] = useState<Array<Schema["Message"]["type"]>>([]);
  
  function listCompanies() {
    client.models.Company.observeQuery().subscribe({
      next: (data) => setCompanies([...data.items]),
    });
  }

  function listUsers() {
    client.models.User.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
    });
  }

  function listGroupChats() {
    client.models.GroupChat.observeQuery().subscribe({
      next: (data) => setGroupChats([...data.items]),
    });
  }

  function listMessages() {
    client.models.Message.observeQuery().subscribe({
      next: (data) => setMessages([...data.items]),
    });
  }

  useEffect(() => {
    listMessages();
  }, []);

  function createMessage() {
    client.models.Message.create({
      content: window.prompt("Message"),
    });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createMessage}>+ new</button>
      <ul>
        {messages.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
