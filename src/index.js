import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { SidebarProvider } from './contexts/SidebarContext';
import ScrollTop from './hooks/useScrollTop';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <HelmetProvider>
    {/* <Provider store={store}> */}
      <SidebarProvider>
        <BrowserRouter>
          <ScrollTop />
            <App />
        </BrowserRouter>
      </SidebarProvider>
    {/* </Provider> */}
  </HelmetProvider>,document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
