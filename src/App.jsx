import  Hero  from "./components/Hero"
import  Highlights  from "./components/Highlights"
import Model from "./components/Model"
import  Navbar  from "./components/Navbar"

function App() {


  return (
    <>
    <main className="bg-black overflow-y-auto">
    <Navbar />
    <Hero />
    <Highlights />
    <Model />
    </main>
    </>
  )
}

export default App
