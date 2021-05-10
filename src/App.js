import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

// pages
import Location3d from './pages/LocationPage';
import Player3d from './pages/PlayerPage';
import Preview3d from './pages/PreviewPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Preview3d} exact />
        <Route path="/locations" component={Location3d} exact />
        <Route path="/player" component={Player3d} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
