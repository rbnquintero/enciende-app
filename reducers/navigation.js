'use strict';

//Declaramos el type State
export type State = {
  flujoNormal: boolean;
};

const initialState = {
  flujoNormal: true,
};

function navigation(state: State = initialState, action): State {
  if (action.type === 'PANTALLA_RALLY') {
    return {
      flujoNormal: false,
    }
  } else if (action.type === 'PANTALLA_NOTICIAS') {
    return {
      flujoNormal: true,
    }
  }

  return state;
}

module.exports = navigation;
