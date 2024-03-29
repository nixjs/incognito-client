import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import QRCode from 'qrcode.react';
import { Modal, Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { makeSelectAccountSelected } from 'app/redux/incognito/selector';
import { onSetReceiveAssetState } from 'app/pages/account/redux/slice';
import { makeSelectReceiveAssetStatus } from 'app/pages/account/redux/selectors';

const ReceiveAssetStyled = styled.div`
    flex: 1;
    .ant-modal-body {
        padding-left: 0;
        padding-right: 0;
    }
    .inner-address {
        canvas {
            height: 15rem !important;
            width: 15rem !important;
            background: #ffffff;
            border: 0.063rem solid rgba(1, 18, 34, 0.05);
            box-shadow: 0 0.063rem 0.5rem rgba(0, 0, 0, 0.1);
            border-radius: 0.5rem;
            padding: 1.063rem;
        }
    }
`;

const ReceiveAsset = () => {
    const dispatch = useDispatch();
    const accountSelected = useSelector(makeSelectAccountSelected());
    const visible = useSelector(makeSelectReceiveAssetStatus());

    const onHandleCancel = () => {
        dispatch(onSetReceiveAssetState(false));
    };

    return (
        <Modal footer={null} visible={visible} title="Receive" onCancel={onHandleCancel} className="text-center custom-modal full-buttons">
            <ReceiveAssetStyled>
                <p className="caption">
                    All the wallet & account service will be sent directly to the main chain, we don’t store any data / keys on this
                    website.
                </p>
                {accountSelected && (
                    <div className="inner-address">
                        <QRCode value={accountSelected?.paymentAddressKeySerialized} />
                        <CopyToClipboard text={accountSelected?.paymentAddressKeySerialized}>
                            <Tooltip placement="bottom" title="Copy to clipboard" arrowPointAtCenter>
                                <Button className="address-clipboard full-width">
                                    <span className="ellipsis">{accountSelected?.paymentAddressKeySerialized}</span>
                                    <span className="indent">{accountSelected?.paymentAddressKeySerialized}</span>
                                    <CopyOutlined />
                                </Button>
                            </Tooltip>
                        </CopyToClipboard>
                    </div>
                )}
            </ReceiveAssetStyled>
        </Modal>
    );
};

ReceiveAsset.propTypes = {};

export default memo(ReceiveAsset);
