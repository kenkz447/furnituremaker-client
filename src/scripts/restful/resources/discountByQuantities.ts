import { Record, Resource, ResourceType, withRestfulData } from 'react-restful';

import { apiEntry, restfulStore } from '@/restful/environment';
import { formatCurrency } from '@/utilities';

import { ProductExtended, productUtils } from './product';
import { ProductType } from './productType';

const sortBy = require('lodash/sortBy');

export interface DiscountByQuantity extends Record {
    readonly id?: string;
    readonly discountPerProduct: number;
    readonly quantity: number;
    readonly productType: ProductType;
}

export const discountByQuantitiesResourceType = new ResourceType<DiscountByQuantity>({
    store: restfulStore,
    name: 'discountByQuantity',
    schema: [{
        field: 'id',
        type: 'PK'
    }]
});

export const discountByQuantitiesResources = {
    find: new Resource<DiscountByQuantity[]>({
        resourceType: discountByQuantitiesResourceType,
        url: apiEntry('/discountByQuantity'),
        method: 'GET',
        mapDataToStore: (items, resourceType, store) => {
            for (const item of items) {
                store.dataMapping(resourceType, item);
            }
        }
    })
};

export const discountByQuantitiesUtils = {
    format: (
        discountByQuantity: DiscountByQuantity,
        product: ProductExtended,
        getPrice?: (rawPrice: number) => number
    ) => {
        const { quantity, discountPerProduct } = discountByQuantity;
        const rawPrice = productUtils.getOriginPrice(product) - (discountPerProduct);
        const absPrice = Math.abs(rawPrice);
        const price = getPrice ?
            getPrice(absPrice) :
            absPrice;

        return `mua ${quantity} - ${formatCurrency(price)}/cái`;
    },
    getDiscountValue: (
        discountByQuantities: DiscountByQuantity[] = [],
        quantity: number = 0
    ) => {
        const entity = discountByQuantitiesUtils.getNearestDiscountQuantityInList(discountByQuantities, quantity);
        return entity ? entity.discountPerProduct : 0;
    },
    sort: (discountByquantities: DiscountByQuantity[]) => {
        return sortBy(
            discountByquantities,
            nameof<DiscountByQuantity>(o => o.quantity)
        );
    },
    getNearestDiscountQuantityInList: (discountByQuantities: DiscountByQuantity[], quantity: number) => {
        if (!discountByQuantities.length) {
            return null;
        }
        const entity = discountByQuantities.find(o => o.quantity === quantity);
        if (!entity) {
            const sortedDiscountByQuantities =
                discountByQuantitiesUtils.sort(discountByQuantities).reverse();

            for (const discountByQuantity of sortedDiscountByQuantities) {
                if (
                    quantity > discountByQuantity.quantity ||
                    quantity === discountByQuantity.quantity
                ) {
                    return discountByQuantity;
                }
            }
            return null;
        }
        return entity;
    }
};

export interface WithDiscountByQuantities {
    readonly discountByQuantities?: DiscountByQuantity[];
}

export interface WithDiscountByQuantitiesOwnProps
    extends WithDiscountByQuantities {
    readonly productType: ProductType;
}

// tslint:disable-next-line:no-any
export const withDiscountByQuantities = <T extends WithDiscountByQuantitiesOwnProps>(): any =>
    withRestfulData<DiscountByQuantity, WithDiscountByQuantities, T>({
        store: restfulStore,
        resourceType: discountByQuantitiesResourceType,
        mapToProps: (data, ownProps) => {
            const { productType } = ownProps;
            if (!productType) {
                return {
                    discountByQuantities: data
                };
            }

            const discountByQuantities = data.filter(o => o.productType.id === productType.id);
            return {
                discountByQuantities: discountByQuantities
            };
        }
    });