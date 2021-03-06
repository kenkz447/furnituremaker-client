import * as React from 'react';
import { submit } from 'redux-form';

import { Auth, withStoreValues } from '@/app';
import { AntdModal, fetchErrorHandler } from '@/components';
import { CommonStoreProps } from '@/configs';
import {
    City,
    Order,
    OrderDetail,
    orderDetailUtils,
    orderResources,
    orderUtils,
    promotionUtils,
    restfulFetcher,
    withAllAgencies,
    WithAllAgenciesProps
} from '@/restful';

import {
    CreateOrderForm,
    createOrderForm,
    CreateOrderFormProps,
    CreateOrderFormValues
} from './create-order-control';

export interface CreateOrderControlProps extends
    WithAllAgenciesProps,
    Pick<CommonStoreProps, 'selectedPromotion'>,
    Pick<CommonStoreProps, 'history'>,
    Pick<CommonStoreProps, 'setStore'>,
    Pick<CommonStoreProps, 'dispatch'> {
    readonly orderDetails: OrderDetail[];
    readonly part: CreateOrderFormProps['part'];
}

@withAllAgencies()
@withStoreValues<CreateOrderControlProps>('history', 'selectedPromotion')
export class CreateOrderControl extends React.Component<CreateOrderControlProps> {
    readonly onCreateOrder = async (formValues: CreateOrderFormValues) => {
        try {
            const { orderDetails, selectedPromotion } = this.props;
            const { order } = formValues;

            const productsTotalPayment = orderDetailUtils.getTotalOfPayment(orderDetails);
            const transportFee = orderUtils.getTransportFee({
                orderDetails,
                shippingToCity: order.shippingToCity
            });

            const orderTotalPrice = productsTotalPayment;

            // * Discount
            const productsDiscount = orderDetailUtils.getTotalDiscount(orderDetails);
            const promotionDiscount = promotionUtils.getDiscount(selectedPromotion);
            const orderTotalDiscount = promotionDiscount + productsDiscount;
            // * End Discount

            const orderTotalOfPayment = orderTotalPrice + transportFee - orderTotalDiscount;

            const newOrder: Partial<Order> = {
                ...order,
                totalPrice: orderTotalPrice,
                orderDetails: orderDetails,
                promotion: selectedPromotion,
                shippingFee: transportFee,
                totalOfPayment: orderTotalOfPayment,
                totalDiscount: orderTotalDiscount,
                productsDiscount: productsDiscount,
                promotionDiscount: promotionDiscount,
                depositRequired: orderUtils.getDeposit(orderTotalOfPayment),
                code: orderUtils.genCode(),
                agencyOrderer: Auth.instance.currentUser.agency,
                created_by: Auth.instance.currentUser
            };

            const createdOrder = await restfulFetcher.fetchResource(
                orderResources.add,
                [{
                    type: 'body',
                    value: newOrder
                }]
            );

            return createdOrder;
        } catch (error) {
            throw await fetchErrorHandler(error);
        }
    }

    componentWillMount() {
        const { setStore, dispatch } = this.props;
        const submitFormAction = submit(createOrderForm);
        setStore<CommonStoreProps>({
            submitOrderForm: () => dispatch(submitFormAction)
        });
    }

    render() {
        const { setStore, part, history, agencies } = this.props;
        const shippingDate = orderUtils.getShippingDate();
        const user = Auth.instance.currentUser;

        const agency = agencies && agencies.find(o => o.user.id === user.id);

        return (
            <CreateOrderForm
                part={part}
                onSubmit={this.onCreateOrder}
                onFormStatusChange={(status) => {
                    setStore<CommonStoreProps>({ orderFormStatus: status });
                }}
                onCityChange={(city: City) => {
                    setStore<CommonStoreProps>({ orderFormSelectedCity: city });
                }}
                initialValues={{
                    order: {
                        email: agency && agency.email,
                        phone: agency && agency.phone,
                        shippingAddress: agency && agency.address,
                        shippingDate: shippingDate.toISOString(),
                        depositRequired: 0,
                        status: 'new',
                        shippingToCity: agency && agency.city,
                        shippingToCounty: agency && agency.county,
                        addressType: 'apartment'
                    },
                    // tslint:disable-next-line:no-any
                    city_county: [
                        agency && agency.city.id,
                        agency && agency.county.id
                    ]
                }}
                onSubmitSuccess={(order: Order) => {
                    const toOrderDetailPageUrl = orderUtils.getDetailPageUrl(order);
                    AntdModal.success({
                        title: 'Đặt hàng thành công',
                        content: 'Nhân viên của Furniture Maker sẽ liên hệ với bạn trong thời gian sớm nhất!',
                        okText: 'Xem đơn hàng',
                        okType: 'default',
                        cancelText: 'Tiếp tục mua sắm',
                        onOk: () => history.push(toOrderDetailPageUrl),
                        onCancel: () => history.push('/')
                    });
                }}
            />
        );
    }
}