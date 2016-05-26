// AccordionPicker styles

import { StyleSheet } from 'react-native';
import * as colors from './colors';
import * as fonts from './fonts';
import * as sizes from './sizes';

const styles = StyleSheet.create({
    picker: {
        backgroundColor: colors.white,
        borderTopColor: colors.white,
        borderTopWidth: 1,
    },

    pickerItem: {
        color: colors.black,
        fontFamily: fonts.source,
        fontSize: 16,
    },

    pickerTouchable: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 4,
        height: 40,
        paddingHorizontal: sizes.spaceSmall,
    },
    pickerTouchableError: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#a94442',
        borderRadius: 4,
        height: 40,
        paddingHorizontal: sizes.spaceSmall,
    },

    pickerTouchableContent: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },

    pickerText: {
        color: colors.black,
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
    },

    pickerIcon: {
        marginTop: 2,
        transform: [{ rotate: '0deg' }],
    },

    pickerOpenIcon: {
        marginTop: 0,
        transform: [{ rotate: '180deg' }],
    },
});

export default styles;
