import { all, call } from 'redux-saga/effects';

import authSaga from './auth';
import routeSaga from './route';
import puzzleSaga from './puzzle';
import chatSaga from './chat';

function* rootSaga() {
  yield all([
    call(authSaga),
    call(routeSaga),
    call(puzzleSaga),
    call(chatSaga),
  ]);
}

export default rootSaga;
