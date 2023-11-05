import logo from './logo.svg';
import './App.css';
import React, {useEffect} from "react";

function App() {

  useEffect(() => {
    const sayHello = async () => {
          const response = await fetch("/api/hello");
          const body = await response.json();
          console.log(body);
        };
        sayHello();
    }, []);

    useEffect(() => {
      const getPrompts = async () => {
            const response = await fetch("/prompts");
            const body = await response.json();
            console.log(body);
          };
          getPrompts();
      }, []);

  return (
    <div className="App">
      Hello World and prompts
    </div>
  );
}

export default App;
