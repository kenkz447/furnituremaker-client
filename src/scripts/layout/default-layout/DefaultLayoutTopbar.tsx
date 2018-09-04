import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Auth } from '@/app';
import { AntdIcon, Container } from '@/components';

const DefaultLayoutTopbarWrapper = styled.div`
   background: #D59B01; 
`;

const DefaultLayoutTopbarContent = styled.div`
   display: flex;
   >div:first-child {
       flex-grow: 1;
       line-height: 30px;
       color: white;
   }
`;

const Menu = styled.ul`
    list-style: none;
    margin: 0;
    text-align: right;
    .link {
        color: white;
        line-height: 30px;
    }
`;

export class DefaultLayoutTopbar extends React.Component {
    render() {
        return (
            <DefaultLayoutTopbarWrapper>
                <Container>
                    <DefaultLayoutTopbarContent>
                        <div>
                            Xin chào, {Auth.instance.currentUser.name}!
                        </div>
                        <Menu>
                            <li>
                                <Link to="/orders" className="link">
                                    <AntdIcon type="copy" /> Đơn hàng
                                </Link>
                            </li>
                        </Menu>
                    </DefaultLayoutTopbarContent>
                </Container>
            </DefaultLayoutTopbarWrapper>
        );
    }
}