// import { LOCAL_STORAGE_KEY } from 'app/consts';
// import LocalStorageServices from 'app/utils/localStorage';
import { ConnectedRouter } from 'connected-react-router';
import React, { Fragment, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { routeAppConfig, routeForAuthConfig } from './config';
import RouterApp from './consts';
import history from './history';

const AppRoutes = () => {
    const [hasAccountImported, setAccountImported] = useState(true);

    const routesMatch = [];

    const onceRouter = (route) => {
        const { component: Component, layout: Layout, path, exact, strict } = route;
        return Component ? (
            <Route
                key={Math.random().toString(36).substr(2, 5)}
                path={path}
                exact={exact}
                strict={strict}
                render={(props) => (
                    <>
                        <Layout>
                            <Component {...props} />
                        </Layout>
                    </>
                )}
            />
        ) : (
            <Fragment key={Math.random().toString(36).substr(2, 5)}>No Component Imported</Fragment>
        );
    };

    const routerListNav = (data) => {
        data.forEach((route) => {
            if (Object.prototype.hasOwnProperty.call(route, 'children')) {
                const { children, path } = route;
                routerListNav(children);
                if (path) {
                    routesMatch.push(onceRouter(route));
                }
            } else {
                routesMatch.push(onceRouter(route));
            }
        });
        return routesMatch;
    };

    // useEffect(() => {
    //     if (LocalStorageServices.getItem(LOCAL_STORAGE_KEY.IS_DASHBOARD) && LocalStorageServices.getItem(LOCAL_STORAGE_KEY.IS_DASHBOARD)) {
    //         setAccountImported(true);
    //     }
    // }, []);

    return (
        <ConnectedRouter history={history}>
            {!hasAccountImported ? (
                <>
                    <Switch>
                        {routerListNav(routeForAuthConfig)}
                        <Redirect to={RouterApp.rOnboarding} />
                    </Switch>
                </>
            ) : (
                <>
                    <Switch>
                        {routerListNav(routeAppConfig)}
                        <Redirect path="*" to={RouterApp.rOnboarding} />
                    </Switch>
                </>
            )}
        </ConnectedRouter>
    );
};

export default AppRoutes;
