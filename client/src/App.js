import './App.css';
import Input from './components/Input';

function App() {
  return (
    <div className="App">
      <div id='back-bg'></div>
      <Input></Input>
      <img src="restart.svg" alt="loading" id='loading'/>
    </div>
  );
}

export default App;
