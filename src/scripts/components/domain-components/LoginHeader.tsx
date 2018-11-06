import * as React from 'react';
import styled from 'styled-components';

const LoginHeaderWrapper = styled.div`
margin-bottom: 25px;
`;

const LoginLogo = styled.img`
width: 55px;
height: 55px;
display: inline-block;
vertical-align: top;
margin-right: 16px;
`;

const LoginSiteDescription = styled.div`
display: inline-block;
`;

const LoginBranchName = styled.a`
line-height: 30px;
font-size: 33px;
color: rgba(0,0,0,.85);
font-weight: 600;
position: relative;
display: block;
`;

const LoginBranchSlogan = styled.span`
height: 30px;
line-height: 30px;
font-size: 14px;
color: rgba(0,0,0,.45);
margin-top: 12px;
`;

export function LoginHeader() {
    return (
        <LoginHeaderWrapper>
            <LoginLogo src="/static/assets/logo.svg" />
            <LoginSiteDescription>
                <LoginBranchName>Furniture Maker</LoginBranchName>
                <LoginBranchSlogan>Chọn mua sofa theo phong cách riêng của bạn</LoginBranchSlogan>
            </LoginSiteDescription>
        </LoginHeaderWrapper>
    );
}