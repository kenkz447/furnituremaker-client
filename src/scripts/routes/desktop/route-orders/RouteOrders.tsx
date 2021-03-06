import * as React from 'react';
import { RouteComponentProps, RouteProps } from 'react-router';
import { Link } from 'react-router-dom';

import { AppPage, PageProps, readyState } from '@/app';
import { AntdBreadcrumb, AntdIcon, Page } from '@/components';
import { CommonStoreProps } from '@/configs';
import { DefaultLayout, ProfileLayout } from '@/layout';

import { OrderListContainer, OrderPageHeader } from './containers';

type RouteOrdersProps = CommonStoreProps & RouteComponentProps<{}> & PageProps;

@readyState()
export class RouteOrders extends AppPage<RouteOrdersProps> {
    render() {
        return (
            <Page>
                <DefaultLayout breadcrumb={this.renderBreadcrumb()}>
                    <ProfileLayout>
                        <OrderPageHeader />
                        <OrderListContainer />
                    </ProfileLayout>
                </DefaultLayout>
            </Page>
        );
    }

    renderBreadcrumb() {
        return (
            <AntdBreadcrumb>
                <AntdBreadcrumb.Item>
                    <Link to="/"><AntdIcon type="home" /></Link>
                </AntdBreadcrumb.Item>
                <AntdBreadcrumb.Item>Đơn hàng</AntdBreadcrumb.Item>
            </AntdBreadcrumb>
        );
    }
}