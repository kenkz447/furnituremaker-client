import * as React from 'react';

import { AntdCol, AntdDivider, AntdList, AntdRow } from '@/components';
import {
    OrderDetail,
    orderDetailUtils,
    restfulStore,
    withTempOrderDetails,
    WithTempOrderDetails
} from '@/restful';

import { OrderDetailItem } from './cart-drawer-content';

interface CartDrawerContentProps extends WithTempOrderDetails {
}

@withTempOrderDetails(restfulStore)
export class CartDrawerContent extends React.Component<CartDrawerContentProps> {
    render() {
        const { orderDetails } = this.props;
        return (
            <div>
                <AntdList
                    itemLayout="vertical"
                    dataSource={orderDetails}
                    renderItem={(item: OrderDetail) => {
                        return (
                            <OrderDetailItem
                                productType={item.productType}
                                orderDetail={item}
                            />
                        );
                    }}
                />
                <AntdDivider />
                <AntdRow style={{ margin: '0 0 10px 0' }}>
                    <AntdCol span={12}>
                        Số lượng sản phẩm:
                    </AntdCol>
                    <AntdCol span={12}>
                        <div style={{ textAlign: 'right' }}>
                            {orderDetailUtils.getQuantity(orderDetails)}
                        </div>
                    </AntdCol>
                </AntdRow>
                <AntdRow>
                    <AntdCol span={12}>
                        Tổng khối lượng:
                    </AntdCol>
                    <AntdCol span={12}>
                        <div style={{ textAlign: 'right' }}>
                            {orderDetailUtils.getTotalVolume(orderDetails)} m<sup>3</sup>
                        </div>
                    </AntdCol>
                </AntdRow>
            </div>
        );
    }
}