import './Root.scss';

import autobind from 'autobind-decorator';
import { createBrowserHistory, History } from 'history';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { Switch } from 'react-router-dom';
import { AnyAction, Store } from 'redux';

import { queryNotifications } from '@/firebase/firebaseNotificationDB';
import {
    discountByQuantitiesResources,
    furnutureMaterialResources,
    OrderDetail,
    orderDetailResources,
    orderDetailUtils,
    productTypeResources,
    restfulFetcher,
    User
} from '@/restful';

import { Auth } from './Auth';
import { initAppStore } from './initAppStore';
import { notificationSubscriber } from './notificationSubscriber';
import { policies } from './policies';
import { changeAppStateToReady } from './readyState';

export interface RootProps {
    // tslint:disable-next-line:no-any
    readonly store: Store<any, AnyAction>;
    readonly children: JSX.Element[];
    readonly loginPath: string;
}

export class Root extends React.Component<RootProps> {
    readonly authHelper: Auth;
    readonly history: History;

    readonly state = {
        allowLoad: false
    };

    constructor(props: RootProps) {
        super(props);
        const { loginPath, store } = props;
        this.history = createBrowserHistory();
        this.authHelper = new Auth({
            loginPath: loginPath,
            store: store,
            history: this.history,
        });
        this.authHelper
            .isLoggedIn()
            .catch((toLoginPage: () => void) => {
                throw toLoginPage();
            })
            .then(this.appInit)
            .then((user: User) => {
                this.authHelper.currentUser = user;
                notificationSubscriber(store, this.authHelper.currentUser);
                changeAppStateToReady(store);
            });
    }

    render() {
        const { store } = this.props;

        return (
            <Provider store={store}>
                <React.Fragment>
                    <Router history={this.history}>
                        <Switch>
                            {this.props.children}
                        </Switch>
                    </Router>
                </React.Fragment>
            </Provider>
        );
    }

    @autobind
    async appInit(user: User) {
        try {
            await Promise.all([
                restfulFetcher.fetchResource(
                    orderDetailResources.find,
                    [
                        orderDetailUtils.getTempOrderParameter(),
                        {
                            type: 'query',
                            parameter: nameof<OrderDetail>(o => o.createdBy),
                            value: user.id
                        }
                    ]
                ),
                restfulFetcher.fetchResource(furnutureMaterialResources.find, []),
                restfulFetcher.fetchResource(productTypeResources.find, []),
                restfulFetcher.fetchResource(discountByQuantitiesResources.find, [])
            ]);

            initAppStore(this.props.store, {
                history: this.history,
                notifications: new Map()
            });

            return user;
        } catch (error) {
            throw new Error(error);
        }
    }

    async initUserNotifications(user: User) {
        const isAdmin = policies.isAdminGroup(user);
        if (isAdmin) {
            await queryNotifications('root');
        } else {
            await queryNotifications(user.id);
        }
    }
}