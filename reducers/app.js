'use strict';

//Declaramos el type State
export type State = {
  eventEmitter: ?Object;
  rallyOn: boolean;
};

const initialState = {
  eventEmitter: null,
  rallyOn: false,
};

function app(state: State = initialState, action): State {
  if (action.type === 'LOAD_EVENT_EMITER') {
    return {
      eventEmitter: action.emiter,
      rallyOn: state.rallyOn,
    }
  } else if (action.type === 'START_RALLY') {
    return {
      eventEmitter: state.eventEmitter,
      rallyOn: true,
    }
  } else if (action.type === 'END_RALLY') {
    return {
      eventEmitter: state.eventEmitter,
      rallyOn: false,
    }
  }
  return state;
}

module.exports = app;
