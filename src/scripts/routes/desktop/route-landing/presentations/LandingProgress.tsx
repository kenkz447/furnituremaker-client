import * as React from 'react';
import styled from 'styled-components';

import { AntdCol, AntdRow, Container, Img } from '@/components';
import { mobileSize } from '@/configs';

const Header = styled.div`
    border-top: 1px solid #AFAFAF;
    border-bottom: 1px solid #AFAFAF;
    height: 80px;
    text-align: center;
    font-weight: 900;
    line-height: 80px;
    font-size: 20px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #3D3D3D;
    @media screen and (max-width: ${mobileSize}px) {
        border-bottom: 0;
        height: auto;
        line-height: 1.5;
        padding: 24px;
        padding-bottom: 0;
        letter-spacing: 0;
    }
`;

const LandingProgressWrapper = styled.div`
    display: block;
    .bar {
        position: absolute;
        width: 100%;
        top: 15px;
        background: #EEEEEE;
        height: 10px;
        @media screen and (max-width: ${mobileSize}px) {
            display: none;
        }
    }
`;

const Item = styled.div`
    display: 'block';
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .index {
        height: 38px;
        width: 38px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 50%;
        background: #C4C4C4;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        margin-bottom: 15px;
    }
    @media screen and (max-width: ${mobileSize}px) {
        margin-bottom: 24px;
    }
`;

const Title = styled.span`
    font-weight: bold;
    line-height: 24px;
    font-size: 14px;
    text-align: center;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3D3D3D;
    margin-bottom: 15px;
    @media screen and (max-width: ${mobileSize}px) {
        margin-bottom: 0;
    }
`;

const Description = styled.p`
    line-height: 18px;
    font-size: 12px;
    text-align: center;
    letter-spacing: 0.1em;
    max-width: 200px;
    color: #000000;
`;

const features = [{
    title: 'THIẾT KẾ',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    width: '50px'
}, {
    title: 'ĐẶT HÀNG',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    width: '150px'
}, {
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    title: 'THEO GIỎI ĐƠN HÀNG',
    width: '150px'
}, {
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    title: 'NHẬN HÀNG',
    width: '150px'
}];

export function LandingProgress() {
    return (
        <React.Fragment>
            {
                window.innerWidth <= mobileSize ?
                    <Header>BẠN THIẾT KẾ<br /> CHÚNG TÔI SẢN XUẤT</Header> :
                    <Header>BẠN THIẾT KẾ - CHÚNG TÔI SẢN XUẤT</Header>
            }
            <Container>
                <LandingProgressWrapper>
                    <AntdRow>
                        <AntdCol offset={3} span={18}>
                            <div className="bar" />
                        </AntdCol>
                        {
                            features.map((o, index) => {
                                const i = index + 1;
                                return (
                                    <AntdCol key={i} span={24} lg={6}>
                                        <Item>
                                            <span className="index">{i}</span>
                                            <Title>{o.title}</Title>
                                            <Description>{o.description}</Description>
                                        </Item>
                                    </AntdCol>
                                );
                            })
                        }
                    </AntdRow>
                </LandingProgressWrapper>
            </Container>
        </React.Fragment>
    );
}