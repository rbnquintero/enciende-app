'use strict';
import React,{
    BackAndroid
} from 'react-native';

export default class BackPress {
    constructor(_navigator,_drawer) {
        this.drawer = _drawer;
        this._navigator = _navigator;
        this.addListener();
    }

    addListener() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    removeListener() {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    onBackAndroid = () => {
        const nav = this._navigator;
        const routes = nav.getCurrentRoutes();
        if (nav && routes.length > 1) {
            const top = routes[routes.length - 1];
            if (top.component.ignoreBack) {
                return true;
            }
            const handleBack = top.component.handleBack;
            if (handleBack) {
                return handleBack();
            }
            nav.pop();
            return true;

        } else {
            this.drawer().toggle();
            return true;
        }
    };
}
