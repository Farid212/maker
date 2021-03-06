import React, {Component} from 'react';
import {Drawer, Toolbar} from 'react-native-material-ui';
import Template from '../Template/Template';
import {BannerAd} from "../../../adsAPI";

import {connect} from 'react-redux';

class DrawerContainer extends Component {
    render() {
        const {navigation, theme} = this.props;

        return (
            <Template bgColor={theme.secondaryBackgroundColor}>
                <Toolbar
                    leftElement="arrow-back"
                    onLeftElementPress={() => navigation.goBack()}
                    centerElement="Back"
                />
                <Drawer style={{container: {backgroundColor: theme.secondaryBackgroundColor}}}>
                    <Drawer.Section
                        divider
                        style={{container: {backgroundColor: theme.secondaryBackgroundColor}}}
                        items={[
                            {
                                icon: 'bookmark-border',
                                value: 'Categories',
                                onPress: () => navigation.navigate('CategoriesList')
                            },
                            {icon: 'people', value: 'Profile', onPress: () => navigation.navigate('Profile')},
                        ]}
                    />
                    <Drawer.Section
                        title="App"
                        style={{container: {backgroundColor: theme.secondaryBackgroundColor}}}
                        items={[
                            {icon: 'assessment', value: 'Themes', onPress: () => navigation.navigate('Themes')},
                            {icon: 'settings', value: 'Settings', onPress: () => navigation.navigate('Settings')},
                            {icon: 'backup', value: 'Backups', onPress: () => navigation.navigate('Backups')},
                            {icon: 'info', value: 'About Maker', onPress: () => navigation.navigate('About')}
                        ]}
                    />
                </Drawer>
                <BannerAd/>
            </Template>
        )
    }
}

const mapStateToProps = state => {
    return {theme: state.theme.theme}
};

export default connect(mapStateToProps)(DrawerContainer);