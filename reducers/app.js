'use strict';

//Declaramos el type State
export type State = {
  eventEmitter: ?Object;
  rallyOn: boolean;
  rallyEnded: boolean;
};

const initialState = {
  eventEmitter: null,
  rallyOn: false,
  rallyEnded: false,
};

function app(state: State = initialState, action): State {
  if (action.type === 'LOAD_EVENT_EMITER') {
    return {
      eventEmitter: action.emiter,
      rallyOn: state.rallyOn,
      rallyEnded: state.rallyEnded,
    }
  } else if (action.type === 'START_RALLY') {
    return {
      eventEmitter: state.eventEmitter,
      rallyOn: true,
      rallyEnded: false,
    }
  } else if (action.type === 'END_RALLY') {
    return {
      eventEmitter: state.eventEmitter,
      rallyOn: false,
      rallyEnded: true,
    }
  } else if (action.type === 'NOT_START_RALLY') {
    return {
      eventEmitter: state.eventEmitter,
      rallyOn: false,
      rallyEnded: false,
    }
  }
  return state;
}

module.exports = app;
