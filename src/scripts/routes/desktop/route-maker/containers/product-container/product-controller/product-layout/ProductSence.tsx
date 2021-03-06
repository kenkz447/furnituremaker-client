import * as React from 'react';
import * as Sticky from 'sticky-js';
import styled from 'styled-components';

import { withStoreValues } from '@/app';
import { ThreeMaterialListProps, ThreeSence } from '@/components';
import { SenceProductInfo } from '@/components/three-controls/three-sence';
import { CommonStoreProps } from '@/configs';
import {
    ProductExtended,
    uploadedFileUtils,
    withComponents,
    WithComponentsProps,
    WithMaterialProps,
    withMaterials
} from '@/restful';

const ProductSenceWrapper = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

interface ProductSenceProps extends
    CommonStoreProps,
    WithComponentsProps,
    WithMaterialProps,
    Partial<Pick<ThreeMaterialListProps, 'selectedMaterial'>> {
    readonly selectedObject?: THREE.Group | null;
    readonly product: ProductExtended;
}

@withComponents()
@withMaterials()
@withStoreValues(
    nameof<ProductSenceProps>(o => o.selectedObject),
    nameof<ProductSenceProps>(o => o.selectedProduct),
)
export class ProductSence extends React.PureComponent<ProductSenceProps> {
    // tslint:disable-next-line:readonly-keyword
    sticky: Sticky;

    componentDidMount() {
        // this.sticky = new Sticky('.sticky');
    }

    componentWillUnmount() {
        // this.sticky.destroy();
    }

    render() {
        const { setStore, selectedProduct, selectedObject, product } = this.props;
        return (
            <ProductSenceWrapper>
                <ThreeSence
                    onObjectSelect={this.onObjectSelect}
                    selectedObject={selectedObject}
                    productModules={product.modules}
                    productType={selectedProduct.productType}
                    setSence={(threeScreen) => {
                        setStore({
                            [nameof<CommonStoreProps>(o => o.product3Dsence)]: threeScreen
                        });
                    }}
                />
                <SenceProductInfo
                    selectedObject={selectedObject}
                />
            </ProductSenceWrapper>
        );
    }

    readonly onObjectSelect = (object: THREE.Group) => {
        // this.sticky.destroy();

        if (!object) {
            return this.props.setStore({
                materials: [],
                components: [],
                selectedObject: object,
                selectedMaterial: null
            });
        }

        const { components, materials } = this.props;

        const componentData = components.find(o => o.id === object.name);
        const sameTypeComponents = components.filter(o => {
            if (!o.componentType) {
                return false;
            }

            return o.componentType.id === componentData.componentType.id;
        });

        const child = object.children[0] as THREE.Mesh;
        const objectMaterial = child.material as THREE.MeshPhongMaterial | THREE.MeshPhongMaterial[];

        const selectedMaterial = materials.find(material => {
            if (Array.isArray(objectMaterial)) {
                return uploadedFileUtils.getUrl(material.texture) === objectMaterial[0].map.image.src;
            }
            return uploadedFileUtils.getUrl(material.texture) === objectMaterial.map.image.src;
        });

        const selectedComponent = components.find(o => o.id === object.name);
        let selectedMaterialType = selectedMaterial.materialType;
        if (!selectedMaterialType) {
            selectedMaterialType = selectedComponent.materialTypes[0];
        }

        // this.sticky = new Sticky('.sticky');

        return this.props.setStore<ProductSenceProps>({
            materials: [],
            selectedObject: object,
            selectedMaterial: {
                ...selectedMaterial,
                materialType: selectedMaterialType
            },
            components: sameTypeComponents,
            allComponents: components,
            selectedMaterialType: selectedMaterialType,
            selectedComponent: selectedComponent,
            selectedComponentDiameter: String(selectedComponent.diameter),
            selectedComponentLengthinesss: String(selectedComponent.lengthiness),
            selectedComponentHeight: String(selectedComponent.height),
        });
    }
}