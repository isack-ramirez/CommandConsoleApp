import Header from './components/header'
import Scene from './components/Scene'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="canvas-container">
        <Scene />
      </div>
      <Header />
    </div>
  )
}

export default App
