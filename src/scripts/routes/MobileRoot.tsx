import * as React from 'react';
import { Route, Switch } from 'react-router';

import { route } from '@/app';
import { DefaultLayoutMobile } from '@/layout/DefaultLayoutMobile';
import { RouteLoginLoadable } from '@/routes/desktop';
import {
    RouteCartLoadable,
    RouteHomeLoadable,
    RouteLandingLoadable,
    RouteMakerLoadable
} from '@/routes/mobile';

const appRoutes = [
    RouteMakerLoadable,
    RouteHomeLoadable,
    RouteLandingLoadable,
    RouteCartLoadable
].reduce(
    (currenValue, Component) => {
        return [...currenValue, route(Component)];
    },
    [] as JSX.Element[]
);

const authRoutes = [
    route(RouteLoginLoadable)
];

export const MobileRoot = () => {
    return (
        <Switch>
            {authRoutes}
            <Route>
                <DefaultLayoutMobile>
                    {
                        appRoutes
                    }
                </DefaultLayoutMobile>
            </Route>
        </Switch>
    );
};