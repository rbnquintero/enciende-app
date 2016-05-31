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
  } else if (action.type === 'PANTALLA_ESTATUS') {
    return {
      pantalla: 'estatus',
    }
  } else if (action.type === 'PANTALLA_NOTICIAS') {
    return {
      pantalla: 'noticias',
    }
  } else if (action.type === 'PANTALLA_REGISTRO_USR') {
    return {
      pantalla: 'registrousuarios',
    }
  } else if (action.type === 'PANTALLA_REGISTRO_GRP') {
    return {
      pantalla: 'registrogrupos',
    }
  }else if (action.type === 'PANTALLA_ENVIO_NOTIFICACIONES') {
    return {
      pantalla: 'envioNotificaciones',
    }
  }

  return state;
}

module.exports = navigation;
