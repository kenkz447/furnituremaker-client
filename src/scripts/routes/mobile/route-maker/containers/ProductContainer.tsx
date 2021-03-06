import * as React from 'react';
import { RestfulRender } from 'react-restful';

import { withStoreValues } from '@/app';
import { CommonStoreProps } from '@/configs';
import {
    FurnitureComponent,
    furnitureComponentResources,
    restfulFetcher,
    withMaterialTypes,
    WithMaterialTypesProps
} from '@/restful';

import { NoProductData, ProductController } from './product-container';

type ProductContainerProps =
    Pick<CommonStoreProps, 'selectedProductDesign'> &
    WithMaterialTypesProps;

@withMaterialTypes()
@withStoreValues<ProductContainerProps>('selectedProductDesign')
export class ProductContainer extends React.PureComponent<ProductContainerProps> {

    constructor(props: ProductContainerProps) {
        super(props);
    }

    render() {
        const { materialTypes, selectedProductDesign } = this.props;
        if (!selectedProductDesign) {
            return null;
        }

        return (
            <RestfulRender
                fetcher={restfulFetcher}
                parameters={[{
                    type: 'query',
                    parameter: nameof<FurnitureComponent>(o => o.design),
                    value: selectedProductDesign.id
                }, {
                    type: 'query',
                    parameter: '_sort',
                    value: `name:ASC`
                }]}
                resource={furnitureComponentResources.find}
                render={(renderProps) => {
                    if (renderProps.data && !renderProps.fetching) {
                        if (!renderProps.data.length) {
                            return <NoProductData />;
                        }

                        return (
                            <ProductController
                                furnitureComponents={renderProps.data}
                                materialTypes={materialTypes}
                                selectedProductDesign={selectedProductDesign}
                            />
                        );
                    }
                    return null;
                }}
            />
        );
    }
}
