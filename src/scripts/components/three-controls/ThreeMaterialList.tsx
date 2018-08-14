import './ThreeMaterialList.scss';

import * as classNames from 'classnames';
import * as React from 'react';
import styled from 'styled-components';

import { withStoreValues } from '@/app';
import { AntdIcon, AntdList } from '@/components';
import { Img } from '@/components/domain-components';
import { CommonStoreProps } from '@/configs';
import {
    FurnutureMaterial,
    Product,
    restfulStore,
    uploadedFileUtils,
    WithMaterialProps,
    withMaterialsByType
} from '@/restful';

const { THREE } = window;

const ListHeader = styled.div`
    margin: 15px 0;
`;

export interface ThreeMaterialListProps extends CommonStoreProps, WithMaterialProps {
    readonly materials: FurnutureMaterial[];
    readonly selectedObject: THREE.Mesh;
    readonly selectedMaterial: FurnutureMaterial;
}

@withMaterialsByType(restfulStore)
@withStoreValues(
    nameof<ThreeMaterialListProps>(o => o.selectedMaterial),
    nameof<ThreeMaterialListProps>(o => o.selectedProduct),
)
class ThreeMaterialListComponent extends React.PureComponent<ThreeMaterialListProps> {
    render() {
        const { selectedMaterial, materials } = this.props;

        return (
            <div className="three-material-list">
                <div
                    className="three-material-list-backbtn"
                    onClick={() => this.props.setStore({ selectedObject: null })}
                >
                    <AntdIcon type="arrow-left" />
                </div>
                <ListHeader>Vật liệu khả dụng</ListHeader>
                <AntdList
                    dataSource={materials}
                    grid={{ gutter: 16, column: 3 }}
                    pagination={{
                        pageSize: 6,
                        simple: true
                    }}
                    renderItem={(material: FurnutureMaterial) => (
                        <AntdList.Item>
                            <div
                                className={classNames(
                                    'three-material-list-material',
                                    { selected: selectedMaterial.id === material.id }
                                )}
                            >
                                <Img
                                    file={material.texture}
                                    size="img256x256"
                                    onClick={() => this.onMaterialSelect(material)}
                                />
                            </div>
                        </AntdList.Item>
                    )}
                />
            </div>
        );
    }

    onMaterialSelect(material: FurnutureMaterial) {
        const { selectedObject, selectedProduct } = this.props;
        const texture = new THREE.TextureLoader();
        const textureFile = uploadedFileUtils.getUrl(material.texture);
        texture.load(textureFile, (map) => {
            // tslint:disable-next-line:no-string-literal
            selectedObject.material['map'].image = map.image;
            // tslint:disable-next-line:no-string-literal
            selectedObject.material['map'].needsUpdate = true;
            // tslint:disable-next-line:no-string-literal
            selectedObject.material['needsUpdate'] = true;

            const nextSelectedProduct: Product = {
                ...selectedProduct,
                modules: selectedProduct.modules.map(productModule => {

                    const nextMaterial = (selectedObject.name === productModule.component.id) ?
                        material : productModule.material;
                    
                    return {
                        ...productModule,
                        material: nextMaterial,
                        materialPrice: nextMaterial.price
                    };
                })
            };
            this.props.setStore({
                [nameof<ThreeMaterialListProps>(o => o.selectedMaterial)]: material,
                [nameof<ThreeMaterialListProps>(o => o.selectedProduct)]: nextSelectedProduct
            });
        });
    }
}

export const ThreeMaterialList = withStoreValues(
    'selectedObject',
    'selectedMaterial',
    nameof<CommonStoreProps>(o => o.selectedMaterialType)
)(ThreeMaterialListComponent);
