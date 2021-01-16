import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import Home from './Home/Home'
import ChatRoom from './ChatRoom/ChatRoom'
import CatList from './Cats/CatList'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/cats" component={CatList} />
        <Route exact path="/" component={Home} />
        <Route exact path="/:roomId" component={ChatRoom} />
      </Switch>
    </Router>
  )
}

export default App
