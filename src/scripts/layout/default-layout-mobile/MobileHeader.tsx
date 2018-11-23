import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { AntdAffix, Container } from '@/components';

import { DrawerControl } from './mobile-header';

const HeaderWrapper = styled.div`
    background-color: rgb(239, 180, 22);
    height: 54px;
    display: flex;
    align-items: center;
`;

const HeaderContent = styled.div`
    display: flex;
`;

const HeaderLogo = styled.img`
    width: 40px;
    height: 40px;
`;

const HeaderDescription = styled.div`
    height: 40px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 0 0 0 5px;
    flex-grow: 1;
    .header-text {
        color: #FFFFFF;
        font-size: 18px;
    }
`;

export class MobileHeader extends React.PureComponent {
    render() {
        return (
            <AntdAffix>
                <HeaderWrapper id="header">
                    <Container>
                        <HeaderContent>
                            <Link to="/">
                                <HeaderLogo src="/static/assets/logo.png" />
                            </Link>
                            <HeaderDescription>
                                <h1 className="header-text">Furniture Maker</h1>
                            </HeaderDescription>
                            <DrawerControl />
                        </HeaderContent>
                    </Container>
                </HeaderWrapper >
            </AntdAffix>
        );
    }
}