import { Location, UnregisterCallback } from 'history';
import * as React from 'react';
import {
    RequestParameter,
    RestfulRender,
    RestfulRenderChildProps,
    RestfulRenderProps
} from 'react-restful';

import { withStoreValues } from '@/app';
import { CommonStoreProps, CommonStoreValues } from '@/configs';
import {
    Product,
    productResources,
    restfulFetcher,
    restfulStore
} from '@/restful';

import { HomeFeatureProductsController } from './home-feature-products';

const getDefaultSearchParams = (): RequestParameter[] => [
    {
        type: 'query',
        parameter: `${nameof<Product>(o => o.isFeatureProduct)}`,
        value: true
    },
    {
        type: 'query',
        parameter: 'design',
        value: undefined
    }
];

interface HomeFeatureProductsProps extends
    Pick<CommonStoreProps, 'selectedProductType'>,
    Pick<CommonStoreProps, 'selectedProductDesign'>,
    Pick<CommonStoreProps, 'history'> {
}

interface HomeFeatureProductsState {
    readonly fetchedProducts: Product[];
    readonly fetchParams: RequestParameter[];
}

@withStoreValues<HomeFeatureProductsProps>(
    'selectedProductType',
    'selectedProductDesign',
    'history'
)

@withStoreValues<HomeFeatureProductsProps>('selectedProductType')
export class HomeFeatureProducts extends React.PureComponent<HomeFeatureProductsProps, HomeFeatureProductsState> {
    // tslint:disable-next-line:readonly-keyword
    unregisterCallback: UnregisterCallback;
    static readonly getDerivedStateFromProps =
        (nextProps: HomeFeatureProductsProps, prevState: HomeFeatureProductsState) => {
            // * for init design param
            const designParam = prevState.fetchParams.find(param =>
                param.parameter === nameof<Product>(product => product.design)
            );
            const { selectedProductDesign } = nextProps;

            // * design has changed
            if (
                selectedProductDesign &&
                selectedProductDesign.id !== designParam.value
            ) {
                const defaultSearchParams = getDefaultSearchParams();
                const defaultDesignParams = defaultSearchParams.find(param =>
                    param.parameter === nameof<Product>(product => product.design)
                );
                defaultDesignParams.value = selectedProductDesign.id;

                return {
                    ...prevState,
                    fetchParams: [...defaultSearchParams]
                };
            }
            return null;
        }
    constructor(props: HomeFeatureProductsProps) {
        super(props);
        const { history } = props;
        this.unregisterCallback = history.listen(this.onRouteChange);
        this.state = {
            fetchedProducts: [],
            fetchParams: getDefaultSearchParams()
        };
    }

    componentWillUnmount() {
        this.unregisterCallback();
    }

    readonly onRouteChange = (location: Location) => {
        const { fetchParams } = this.state;
        const prevFetchDesignParam = fetchParams.find(o => o.parameter === 'design');

        const currentSearchParams = new URLSearchParams(location.search);
        const currentDesignSortParam = currentSearchParams.get('design');

        if (prevFetchDesignParam.value === currentDesignSortParam) {
            return null;
        }

        prevFetchDesignParam.value = currentDesignSortParam;

        this.setState({
            fetchParams: [
                ...fetchParams
            ]
        });
    }

    readonly renderComponent = (renderProps: RestfulRenderChildProps<Product[]>) => {
        if (
            !renderProps.data ||
            !renderProps.data.length
        ) {
            return null;
        }

        return (
            <HomeFeatureProductsController
                products={renderProps.data}
            />
        );
    }

    render() {
        const { selectedProductType, selectedProductDesign } = this.props;

        if (!selectedProductType
            || !selectedProductDesign
        ) {
            return null;
        }

        const { fetchParams } = this.state;

        return (
            <RestfulRender
                fetcher={restfulFetcher}
                resource={productResources.find}
                parameters={fetchParams}
                render={this.renderComponent}
            />
        );
    }
}