import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// import configureStore from './redux/store';
import { createStore } from 'redux'
import reducers from './redux/reducers/reducers';
import App from './App';
import './_settings.scss';

// const initialState: any = {
//     projects: []
// }

const store = createStore(reducers,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
)

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>
);

