import { getCookie } from 'common/cookie';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { isDev } from 'settings';

import sagas from '../sagas';

import * as globalReducer from './global';
import * as chatReducer from './chat';
import * as loginReducer from './login';
import * as settingReducer from './setting';
import * as addReplayReducer from './addReplay';
import * as puzzleReducer from './puzzle';
import * as awardCheckerReducer from './awardChecker';
import * as directReducer from './direct';

import { StateType, ExtendedStore } from './types';
import { AppContextType } from 'next-server/dist/lib/utils';

const reducer = combineReducers({
  [globalReducer.scope]: globalReducer.reducer as any,
  [chatReducer.scope]: chatReducer.reducer as any,
  [loginReducer.scope]: loginReducer.reducer as any,
  [settingReducer.scope]: settingReducer.reducer as any,
  [addReplayReducer.scope]: addReplayReducer.reducer as any,
  [puzzleReducer.scope]: puzzleReducer.reducer as any,
  [awardCheckerReducer.scope]: awardCheckerReducer.reducer as any,
  [directReducer.scope]: directReducer.reducer as any,
});

const composeEnhancers =
  (process.browser && isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

/* eslint-disable no-underscore-dangle */
export const initializeStore = (
  initialState: StateType,
  appContext?: AppContextType,
) => {
  const route = appContext && appContext.router ? appContext.router.asPath : '';
  const cookies =
    appContext && appContext.ctx.req ? appContext.ctx.req.headers.cookie : '';
  const settingsState =
    JSON.parse(getCookie('settings-server-side', cookies) || '{}') || {};
  const sagaMiddleware = createSagaMiddleware();
  const store: ExtendedStore = createStore(
    reducer,
    initialState || {
      global: { ...globalReducer.initialState, route },
      setting: { ...settingReducer.initialState, ...settingsState },
    },
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  );
  store.sagaTask = sagaMiddleware.run(sagas);

  return store;
};
