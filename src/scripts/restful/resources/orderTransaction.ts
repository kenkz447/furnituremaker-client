import { Resource, ResourceType, restfulDataContainer } from 'react-restful';

import { apiEntry } from '@/restful/apiEntry';
import { genCodeWithCurrentDate, randomString } from '@/utilities/string';

import { Order } from './order';

export interface OrderTransaction {
    readonly id?: string;
    readonly name: string;
    readonly type: 'deposit' | 'payment' | 'refund';
    readonly note: string;
    readonly date: string;
    readonly order: Partial<Order>;
    readonly money: number;
    readonly code: string;
}

export const orderTransactionType = new ResourceType<OrderTransaction>({
    name: nameof<OrderTransaction>(),
    schema: [{
        field: 'id',
        type: 'PK'
    }, {
        resourceType: nameof<Order>(),
        field: nameof<OrderTransaction>(o => o.order),
        type: 'FK'
    }]
});

export const orderTransactionResources = {
    find: new Resource<OrderTransaction[]>({
        resourceType: orderTransactionType,
        url: apiEntry('/orderTransaction'),
        method: 'GET',
        mapDataToStore: (orderTransactions, resourceType, store) => {
            for (const orderTransaction of orderTransactions) {
                store.mapRecord(resourceType, orderTransaction);
            }
        }
    }),
    create: new Resource<OrderTransaction>({
        resourceType: orderTransactionType,
        url: apiEntry('/orderTransaction'),
        method: 'POST',
        mapDataToStore: (orderTransaction, resourceType, store) => {
            store.mapRecord(resourceType, orderTransaction);
        }
    }),
    delete: new Resource<OrderTransaction>({
        resourceType: orderTransactionType,
        url: apiEntry('/orderTransaction/:id'),
        method: 'DELETE',
        mapDataToStore: (orderTransaction, resourceType, store) => {
            store.removeRecord(resourceType, orderTransaction);
        }
    })
};

export const orderTransactionUtils = {
    getTypeSelectItems: (): ReadonlyArray<{
        readonly value: OrderTransaction['type'];
        readonly title: string;
    }> => {
        return [{
            value: 'deposit',
            title: 'Đặt cọc'
        }, {
            value: 'payment',
            title: 'Thanh toán'
        }, {
            value: 'refund',
            title: 'Hoàn tiền'
        }];
    },
    getTypeTitle: (type: OrderTransaction['type']) => {
        const typeSelectIitems = orderTransactionUtils.getTypeSelectItems();
        const typeItem = typeSelectIitems.find(o => o.value === type);
        return typeItem.title;
    },
    genName: (orderTransaction: OrderTransaction) => {
        if (!orderTransaction.order) {
            return null;
        }

        const typeSelectIitems = orderTransactionUtils.getTypeSelectItems();

        const typeItem = typeSelectIitems.find(o => o.value === orderTransaction.type);
        const title = typeItem.title;

        return `${title} đơn hàng #${orderTransaction.order.id}`;
    },
    genCode: () => genCodeWithCurrentDate()
};

export interface WithOrderTransactionProps {
    readonly orderTransactions?: OrderTransaction[];
}

export const withOrderTransactionsByOrder = (store) =>
    // tslint:disable-next-line:no-any
    (Component: React.ComponentType<WithOrderTransactionProps>): any =>
        restfulDataContainer<OrderTransaction, WithOrderTransactionProps>({
            store,
            resourceType: orderTransactionType,
            mapToProps: (data, ownProps: { readonly order: Order }) => {
                const orderTransactions = data.filter(orderTransaction => {
                    if (typeof orderTransaction.order === 'string') {
                        return orderTransaction.order === ownProps.order.id;
                    }
                    return orderTransaction.order.id === ownProps.order.id;
                });

                return {
                    orderTransactions
                };
            }
        })(Component);