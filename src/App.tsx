import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DataForm from './pages/DataForm';
import Home from './pages/Home';
import TestForm from './pages/TestForm';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact={true} component={Home} />
        <Route path='/cadastrar-teste' exact={true} component={TestForm} />
        <Route path='/cadastrar-dados' exact={true} component={DataForm} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
