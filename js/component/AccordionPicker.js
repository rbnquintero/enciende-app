// Modules
import React from 'react';
import { Image, Picker, Text, TouchableHighlight, View } from 'react-native';
import Collapsible from 'react-native-collapsible';

// Styles
import styles from './style/acordionPicker';
import { greyLight } from './style/colors';

// Images
import iconChevron from './img/icon-chevron.png';

const { arrayOf, func, number, oneOfType, shape, string } = React.PropTypes;

const optionShape = shape({
    text: oneOfType([string, number]),
    value: oneOfType([string, number]),
});
const defaultOption = {
    text: '-',
    value: '',
};

class AccordionPicker extends React.Component {

    static propTypes = {
        defaultValue: optionShape,
        options: arrayOf(optionShape).isRequired,
        onChange: func,
    };

    static defaultProps = {
        defaultValue: defaultOption,
        options: [defaultOption],
        onChange: () => {},
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
    }

    state = {
        open: false,
    };

    onChange(value) {
        this.props.onChange(value);
    }

    toggleOpen() {
        this.setState({ open: !this.state.open });
    }

    render() {
        var stylesheet = this.props.data.stylesheet;
        var formGroupStyle = stylesheet.formGroup.normal;
        var controlLabelStyle = stylesheet.controlLabel.normal;
        var selectStyle = stylesheet.select.normal;
        var helpBlockStyle = stylesheet.helpBlock.normal;
        var errorBlockStyle = stylesheet.errorBlock;
        var pickerTouchable = styles.pickerTouchable;

        if (this.props.data.hasError) {
          formGroupStyle = stylesheet.formGroup.error;
          controlLabelStyle = stylesheet.controlLabel.error;
          selectStyle = stylesheet.select.error;
          helpBlockStyle = stylesheet.helpBlock.error;
          pickerTouchable = styles.pickerTouchableError;
        }

        var label = this.props.data.label ? <Text style={controlLabelStyle}>{this.props.data.label}</Text> : null;
        var help = this.props.data.help ? <Text style={helpBlockStyle}>{this.props.data.help}</Text> : null;
        var error = this.props.data.hasError && this.props.data.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{this.props.data.error}</Text> : null;

        const { defaultValue, options } = this.props;
        const { open } = this.state;

        const styleIcon = [styles.pickerIcon, open ? styles.pickerOpenIcon : null];

        return (
            <View style={formGroupStyle}>
                {label}
                <TouchableHighlight
                    onPress={this.toggleOpen}
                    style={pickerTouchable}
                    underlayColor={greyLight}
                >
                    <View style={styles.pickerTouchableContent}>
                        <Text style={styles.pickerText}>{defaultValue.text}</Text>
                        <Image source={iconChevron} style={styleIcon} />
                    </View>
                </TouchableHighlight>
                <Collapsible collapsed={!open}>
                    <Picker
                        onValueChange={this.onChange}
                        selectedValue={defaultValue.value}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        {options.map((option, i) =>
                            <Picker.Item key={i} label={option.text} value={option.value} />
                        )}
                    </Picker>
                </Collapsible>
            </View>
        );
    }

}

export default AccordionPicker;
