import 'antd-mobile/lib/tabs/style/css';

import Tabs from 'antd-mobile/lib/tabs';
import * as React from 'react';

import { withStoreValues } from '@/app';
import { FullScreenModal, FullScreenModalProps } from '@/components';
import { CommonStoreProps } from '@/configs';
import { ProductDesign, ProductDesignGroup } from '@/restful';

import {
    ProductDesignGroupList,
    ProductDesignList
} from './product-designs-modal';

export type DesignModalProps = CommonStoreProps & {
    readonly showDesignsModal?: boolean;
    readonly productDesigns: ProductDesign[];
    readonly productDesignGroups: ProductDesignGroup[];
    readonly onModalClose: FullScreenModalProps['onClose'];
    readonly onDesignClick: (productDesign: ProductDesign) => void;
};

@withStoreValues(nameof<DesignModalProps>(o => o.showDesignsModal))
export class DesignModal extends React.Component<DesignModalProps> {
    render() {
        const {
            productDesignGroups,
            productDesigns,
            showDesignsModal,
            onModalClose,
            onDesignClick
        } = this.props;

        return (
            <ProductDesignList
                designs={productDesigns}
                onDesignClick={onDesignClick}
            />
        );
    }
}