import './ThreeComponentList.scss';

import * as classNames from 'classnames';
import * as React from 'react';
import styled from 'styled-components';

import { AccessControl, withStoreValues } from '@/app';
import { AntdList, Img } from '@/components';
import { AntdTooltip } from '@/components/antd-component';
import { Loading } from '@/components/domain-components';
import { CreateComponentFormControl } from '@/forms/create-component';
import { FurnitureComponent } from '@/restful';

import {
    ThreeComponentListBase,
    ThreeComponentListProps
} from './ThreeComponentListBase';

const ListHeader = styled.div`
    margin: 15px 0;
`;

@withStoreValues<ThreeComponentListProps>(
    'selectedProduct',
    'product3Dsence',
    'selectedComponent',
    'selectedComponentGroup',
    'selectedObject',
    'components',
    'allComponents'
)
export class ThreeComponentList extends ThreeComponentListBase {
    render() {
        const { selectedObject, components, selectedComponentGroup } = this.props;
        const selectedComponent = components.find(o => o.id === selectedObject.name);

        let filteredComponentByGroup: FurnitureComponent[];
        if (selectedComponent.componentType.isBase) {
            filteredComponentByGroup = components;
        } else {
            filteredComponentByGroup = selectedComponentGroup ?
                components.filter(o => o.componentGroup && o.componentGroup.id === selectedComponentGroup.id) :
                components;
        }

        const child = selectedObject.children[0] as THREE.Mesh;
        (child.material as THREE.MeshPhongMaterial).map.needsUpdate = true;

        const { loading, nextSelectComponent } = this.state;
        return (
            <React.Fragment>
                <ListHeader>
                    Cấu kiện thay thế
                </ListHeader>
                <AntdList
                    dataSource={filteredComponentByGroup}
                    grid={{ gutter: 16, column: 3 }}
                    pagination={{
                        pageSize: 6,
                        simple: true,
                        style: { textAlign: 'center' }
                    }}
                    renderItem={(component: FurnitureComponent) => {
                        const isSelected = (selectedComponent.id === component.id);
                        const isNextSelected = nextSelectComponent && (nextSelectComponent.id === component.id);

                        return (
                            <AntdList.Item key={component.id}>
                                <AntdTooltip
                                    title={component.displayName}
                                >
                                    <div
                                        className={classNames(
                                            'three-component-list-component',
                                            { selected: isSelected }
                                        )}
                                    >
                                        <Img
                                            file={component.thumbnail}
                                            size="img256x256"
                                            onClick={() => this.onComponentSelect(component)}
                                        />

                                        <AccessControl allowRoles="root">
                                            {this.renderPopover(component)}
                                        </AccessControl>
                                        {(loading && isNextSelected) && (<Loading />)}
                                    </div>
                                </AntdTooltip>
                            </AntdList.Item>
                        );
                    }}
                />

            </React.Fragment>
        );
    }
} 