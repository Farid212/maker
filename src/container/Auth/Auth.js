import React, {PureComponent} from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { validationSystem } from '../../shared/utility';

class Auth extends PureComponent {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    keyboardType: 'email-address',
                    placeholder: 'E-Mail address'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    email: true
                },
                valid: true
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    keyboardType: "visible-password",
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6,
                },
                valid: true
            },
        },
        isSingUp: true
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.isAuth) this.props.navigation.navigate('ToDo');
    }

    inputChangeHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event,
            }
        };
        this.setState({ controls: updatedControls });
    };

    submitHandler = (event) => {
        event.preventDefault();
        const controls = this.state.controls;

        controls.email.valid = validationSystem(controls.email.validation, controls.email.value);
        controls.password.valid = validationSystem(controls.password.validation, controls.password.value);

        if (controls.email.valid && controls.password.valid) {
            return this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSingUp);
        }

        return this.setState({ controls });
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                isSingUp: !prevState.isSingUp
            };
        });
    };

    render() {
        let error = null;

        if (this.props.error) {
            switch (this.props.error.message) {
                case ('EMAIL_EXISTS'):
                    error = <Text style={classes.Error}>This E-mail already exists!</Text>;
                    break;
                case ('TOO_MANY_ATTEMPTS_TRY_LATER'):
                    error = <Text style={classes.Error}>Too many attempts. Try again later</Text>;
                    break;
                case ('EMAIL_NOT_FOUND'):
                    error = <Text style={classes.Error}>This E-mail was not found!</Text>;
                    break;
                case ('INVALID_PASSWORD'):
                    error = <Text style={classes.Error}>This password is incorrect!</Text>;
                    break;
                case ('USER_DISABLED'):
                    error = <Text style={classes.Error}>This user has been disabled by Administrator!</Text>;
                    break;
                default:
                    error = null;
                    break;
            }
        }

        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        let login = (
            <View style={[classes.container, classes.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
        let form = null;

        if (!this.props.loading) {
            form = formElementsArray.map(inputEl => (
                <Input
                    key={inputEl.id}
                    valueName={inputEl.id}
                    elementType={inputEl.config.elementType}
                    elementConfig={inputEl.config.elementConfig}
                    value={inputEl.config.value}
                    invalid={!inputEl.config.valid}
                    shouldValidate={inputEl.config.validation}
                    changed={(event) => this.inputChangeHandler(event, inputEl.id)} />
            ));
        }

        if (!this.props.loading) {
            login = (
                <View>
                    <View>
                        {form}
                        <Button clicked={this.submitHandler} color="#5C9210" title="SUBMIT" />
                    </View>
                    <Button
                        clicked={this.switchAuthModeHandler}
                        title={`SWITCH TO ${this.state.isSingUp ? 'SIGN IN' : 'SIGN UP'}`}
                        color="#944317" />
                    {error}
                </View>
            );
        }

        return (
            <View>
                {login}
            </View>
        );
    };
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
    };
};

const classes = StyleSheet.create({
    Error: {
        fontWeight: 'bold',
        color: '#944317'
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 50
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);