import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, closeModal, setStory} from "./js/store/router/actions";
import {getActivePanel} from "./js/services/_functions";
import * as VK from './js/services/VK';
import bridge from '@vkontakte/vk-bridge'
import {setColorScheme} from "./js/store/vk/actions";
import queryString from 'query-string';

import {Epic, View, Root, Tabbar, ModalRoot, TabbarItem, ConfigProvider, AdaptivityProvider, AppRoot, SplitLayout, SplitCol, Panel, Group, Cell, Separator, PanelHeader} from "@vkontakte/vkui";

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28More from '@vkontakte/icons/dist/28/more';

import HomePanelBase from './js/panels/home/base';
import HomePanelGroups from './js/panels/home/groups';

import MorePanelBase from './js/panels/more/base';
import MorePanelExample from './js/panels/more/example';

import HomeBotsListModal from './js/components/modals/HomeBotsListModal';
import HomeBotInfoModal from './js/components/modals/HomeBotInfoModal';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            platform: ''
        };

        this.lastAndroidBackAction = 0;
    }

    componentDidMount() {
        const {goBack, dispatch} = this.props;

        dispatch(VK.initApp());

        var params = queryString.parse(window.location.search);

        if(params.vk_platform == 'mobile_web' || params.vk_platform == 'desktop_web') {
            this.setState({
                platform: 'vkcom'
            });
        }

        else if(params.vk_platform == 'mobile_android' || params.vk_platform == 'mobile_android_messenger') {
            this.setState({
                platform: 'android'
            });
        }

        else { //if(params.vk_platform == 'mobile_iphone' || params.vk_platform == 'mobile_iphone_messenger')
            this.setState({
                platform: 'ios'
            });
        }

        bridge.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppUpdateConfig':
                    dispatch(setColorScheme(e.detail.data.scheme));
                    if(e.detail.data.scheme == 'bright_light') {
                       bridge.send('VKWebAppSetViewSettings', {
                               'status_bar_style': 'dark',
                               'action_bar_color': '#fff'
                         });
                     }
                     else {
                       bridge.send('VKWebAppSetViewSettings', {
                               'status_bar_style': 'light',
                               'action_bar_color': '#191919'
                         });
                     }
                    break;
 
            }
         });

        window.onpopstate = () => {
            let timeNow = +new Date();

            if (timeNow - this.lastAndroidBackAction > 500) {
                this.lastAndroidBackAction = timeNow;

                goBack();
            } else {
                window.history.pushState(null, null);
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {activeView, activeStory, activePanel, scrollPosition} = this.props;

        if (
            prevProps.activeView !== activeView ||
            prevProps.activePanel !== activePanel ||
            prevProps.activeStory !== activeStory
        ) {
            let pageScrollPosition = scrollPosition[activeStory + "_" + activeView + "_" + activePanel] || 0;

            window.scroll(0, pageScrollPosition);
        }
    }

    render() {
        const {goBack, setStory, closeModal, popouts, activeView, activeStory, activeModals, panelsHistory, colorScheme} = this.props;

        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];
        let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];

        const panels = ["panel 1", "panel 2", "panel 3"];
        const modals = ["modal 1", "modal 2"];

        const isDesktop = this.state.platform === 'vkcom';
        const hasHeader = this.state.platform !== 'vkcom'

        const homeModals = (
            <ModalRoot activeModal={activeModal}>
                <HomeBotsListModal
                    id="MODAL_PAGE_BOTS_LIST"
                    onClose={() => closeModal()}
                />
                <HomeBotInfoModal
                    id="MODAL_PAGE_BOT_INFO"
                    onClose={() => closeModal()}
                />
            </ModalRoot>
        );

        //setStory('more', 'callmodal')
        //setStory('home', 'base')

        return (
            <ConfigProvider platform={this.state.platform} isWebView={true} scheme={colorScheme}>
                <AdaptivityProvider>
                <SplitLayout
                    style={{ justifyContent: "center" }}
                    header={hasHeader && <PanelHeader separator={false} />}
                    popout={popout}
                    modal={homeModals}
                >
                    {isDesktop && (
                    <SplitCol fixed width="280px" maxWidth="280px">
                        <Panel>
                        {hasHeader && <PanelHeader />}
                        <Group>
                            {panels.map((i) => (
                            <Cell
                                key={i}
                                disabled={i === 'home'}
                                style={i === 'home' ? {
                                backgroundColor: "var(--button_secondary_background)",
                                borderRadius: 8
                                } : {}}
                                onClick={() => console.log(i)}
                            >
                                {i}
                            </Cell>
                            ))}
                            <Separator />
                            <Cell>modal 1</Cell>
                            <Cell>modal 2</Cell>
                            <Cell>alert</Cell>
                        </Group>
                        </Panel>
                    </SplitCol>
                    )}

                    <SplitCol
                    animate={!isDesktop}
                    spaced={isDesktop}
                    width={isDesktop ? '560px' : '100%'}
                    maxWidth={isDesktop ? '560px' : '100%'}
                    >
                        <Root id="home" activeView={activeView} popout={popout}>
                            <View
                                id="home"
                                modal={homeModals}
                                activePanel={getActivePanel("home")}
                                history={history}
                                onSwipeBack={() => goBack()}
                            >
                                <HomePanelBase id="base" withoutEpic={false}/>
                                <HomePanelGroups id="groups"/>
                            </View>
                        </Root>
                        <Root id="more" activeView={activeView} popout={popout}>
                            <View
                                id="more"
                                modal={homeModals}
                                activePanel={getActivePanel("more")}
                                history={history}
                                onSwipeBack={() => goBack()}
                            >
                                <MorePanelBase id="callmodal"/>
                            </View>
                            <View
                                id="modal"
                                modal={homeModals}
                                activePanel={getActivePanel("modal")}
                                history={history}
                                onSwipeBack={() => goBack()}
                            >
                                <MorePanelExample id="filters"/>
                            </View>
                        </Root>
                    </SplitCol>
                </SplitLayout>
                </AdaptivityProvider>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,
        scrollPosition: state.router.scrollPosition,

        colorScheme: state.vkui.colorScheme
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({setStory, goBack, closeModal}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
