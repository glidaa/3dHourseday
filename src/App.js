import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

// pages
import Preview3d from './pages/PreviewPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Preview3d} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
