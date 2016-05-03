'use strict';

//Declaramos el type State
export type State = {
  pantalla: ?string;
};

const initialState = {
  pantalla: 'noticias',
};

function navigation(state: State = initialState, action): State {
  if (action.type === 'PANTALLA_RALLY') {
    return {
      pantalla: 'rally',
    }
  } else if (action.type === 'PANTALLA_CONTACTO') {
    return {
      pantalla: 'contacto',
    }
  } else if (action.type === 'PANTALLA_NOTICIAS') {
    return {
      pantalla: 'noticias',
    }
  }

  return state;
}

module.exports = navigation;
