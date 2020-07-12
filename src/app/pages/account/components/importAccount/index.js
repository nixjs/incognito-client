import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button, Typography, Modal, Form, Input, notification } from 'antd';
import { Config } from 'configs';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import { masterAccount as MasterAccount, IncognitoInstance } from 'app/services/incognito';
import { onSetImportAccountState } from 'app/pages/account/redux/slice';
import { makeSelectImportedAccountStatus } from 'app/pages/account/redux/selectors';

const ImportAccount = ({ onGetStatusImported }) => {
    const dispatch = useDispatch();
    const visible = useSelector(makeSelectImportedAccountStatus());
    const { Title, Text } = Typography;
    const onHandleImportCancel = () => {
        dispatch(onSetImportAccountState(false));
    };

    const onImportAccount = async (values) => {
        if (values) {
            const { accountName, privateKey } = values;
            const account = await MasterAccount.importAccount(accountName, privateKey);
            if (!isEmpty(account)) {
                dispatch(onSetImportAccountState(false));
                notification.open({
                    message: 'Success',
                });
                const backupWalletString = await IncognitoInstance.wallet.backup(Config.WALLET_PASS);
                LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString);
                if (onGetStatusImported && typeof onGetStatusImported === 'function') {
                    onGetStatusImported(backupWalletString);
                }
            }
        }
    };

    return (
        <>
            <Modal footer={null} visible={visible} onCancel={onHandleImportCancel}>
                <Title>IMPORT ACCOUNT FROM PRIVATE KEYS</Title>
                <Form name="import-account" layout="vertical" onFinish={onImportAccount}>
                    <Form.Item
                        name="privateKey"
                        label={
                            <span>
                                Enter your account’s <strong>private keys</strong>
                            </span>
                        }
                        rules={[{ required: true, message: 'Enter your account’s private keys' }]}>
                        <Input spellCheck="false" />
                    </Form.Item>
                    <Form.Item
                        name="accountName"
                        label="Enter your account’s name"
                        rules={[{ required: true, message: 'Enter your account’s name' }]}>
                        <Input spellCheck="false" />
                    </Form.Item>
                    <Button type="primary" size="large" htmlType="submit">
                        Submit
                    </Button>
                </Form>
                <Text>
                    All the wallet & account service will be sent directly to the main chain, we don’t store any data / keys on this
                    website.
                </Text>
            </Modal>
        </>
    );
};

ImportAccount.propTypes = {
    onGetStatusImported: PropTypes.func,
};

export default ImportAccount;