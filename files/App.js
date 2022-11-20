import './App.css';
import {  useState } from 'react';
import useAction from './core/useAction';
const { action } = window

function App() {
  const [random, setRandom] = useState(null)

  useAction('random', (e, result) => setRandom(result))

  return (
    <div className="App">
      <header className='App-header'>
	      <h1 onClick={() => action.random()}>Ouiahc mon qsddsf</h1>
	      <h5>{random}</h5>
      </header>
    </div>
  );
}

export default App;
