import { Header } from './components/header'
import { AlbumSearch } from './containers/albumSearch/albumSearch'

function App() {

  return (
    <div className="App">
      <Header />
      <div style={{ marginTop: '65px', padding: '20px' }}>
        <AlbumSearch />
      </div>
    </div>
  )
}

export default App
