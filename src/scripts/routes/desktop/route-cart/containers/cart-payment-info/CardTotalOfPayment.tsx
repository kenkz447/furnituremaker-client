import * as React from 'react';
import styled from 'styled-components';

import { Auth, withStoreValues } from '@/app';
import { AntdCol, AntdRow } from '@/components';
import { colorPrimary, CommonStoreProps } from '@/configs';
import {
    agencyUtils,
    OrderDetail,
    orderDetailUtils,
    orderUtils,
    withAllAgencies,
    WithAllAgenciesProps
} from '@/restful';
import { formatCurrency } from '@/utilities';

const TotalPrice = styled.div`
    text-align: right;
    font-size: 18px;
    color: #fff;
    font-weight: bold;
`;

interface CardTotalOfPaymentProps extends
    WithAllAgenciesProps,
    Pick<CommonStoreProps, 'selectedPromotion'>,
    Pick<CommonStoreProps, 'orderFormSelectedCity'> {
    readonly orderDetails: OrderDetail[];
}

@withAllAgencies()
@withStoreValues<CardTotalOfPaymentProps>(
    'selectedPromotion',
    'orderFormSelectedCity'
)
export class CardTotalOfPayment extends React.PureComponent<CardTotalOfPaymentProps> {
    render() {
        const {
            orderDetails,
            selectedPromotion,
            orderFormSelectedCity,
            agencies
        } = this.props;

        const user = Auth.instance.currentUser;
        const productTotalPayment = orderDetailUtils.getTotalOfPayment(orderDetails);

        const currentUserAgency = agencies.find(o => o.id === (user.agency && user.agency.id));

        const discountByAgencyLevel = agencyUtils
            .getOrderDiscountByLevel(currentUserAgency, productTotalPayment);

        const orderTransportFee = orderUtils.getTransportFee({
            orderDetails,
            shippingToCity: orderFormSelectedCity
        });

        const selectedPromotionDiscount = selectedPromotion ? selectedPromotion.discountPrice : 0;
        const totalDiscount = selectedPromotionDiscount + discountByAgencyLevel;
        const totalOfPayment = productTotalPayment + orderTransportFee - totalDiscount;
        const deposit = orderUtils.getDeposit(totalOfPayment);

        return (
            <div style={{ margin: '15px 0' }}>
                <AntdRow style={{ background: '#EFB416', padding: 15, marginBottom: 5 }}>
                    <AntdCol span={12}>
                        <div style={{ fontSize: 18, color: '#000' }}>
                            Tổng thanh toán:
                        </div>
                    </AntdCol>
                    <AntdCol span={12}>
                        <TotalPrice>
                            {
                                formatCurrency(totalOfPayment)
                            }
                        </TotalPrice>
                    </AntdCol>
                </AntdRow>
                <p>
                    <i>
                        Chú ý: bạn cần thanh toán trước 30%
                        (<b>{formatCurrency(deposit)}</b>)
                        để xác nhận đơn hàng này.
                    </i>
                </p>
            </div>

        );
    }
}