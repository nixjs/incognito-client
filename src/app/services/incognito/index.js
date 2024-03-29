import { Config } from 'configs';
import { LOCAL_STORAGE_KEY } from 'app/consts';
import LocalStorageServices from 'app/utils/localStorage';
import loadWASM from '../wasm';
import MasterAccount from './account';
import { walletInstance } from './wallet';

// const loadWallet = async () => {
//     try {
//         const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
//         if (!walletBackup) {
//             history.push(RouterApp.rOnboarding);
//             return null;
//         }
//         const wallet = await walletInstance.restore(Config.WALLET_PASS, walletBackup);
//         return { wallet, masterAccount: new MasterAccount(wallet) };
//     } catch (err) {
//         return { error: MSG.RESTORED_WALLET_FAILED };
//     }
// };

// const createWallet = async (encryptedWallet, password = Config.WALLET_PASS) => {
//     try {
//         const wallet = await walletInstance.createWallet(encryptedWallet, password);
//         if (!wallet) {
//             return null;
//         }
//         const strWallet = await walletInstance.backup(password, wallet);
//         LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, strWallet);
//         return { wallet, masterAccount: new MasterAccount(wallet) };
//     } catch (err) {
//         return { error: MSG.CREATED_WALLET_FAILED };
//     }
// };

export let IncognitoInstance = {};
export let masterAccount = null;
let semaphore = false;
// const getInstance = async () => {
//     console.log(instance && !semaphore);

//     if (instance && !semaphore) {
//         semaphore = true; // mark awaited constructor
//         const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
//         let wallet;
//         if (!walletBackup) {
//             wallet = await walletInstance.createWallet(Config.WALLET_PASS, 'ABC');
//         } else {
//             wallet = await walletInstance.restore(Config.WALLET_PASS, walletBackup);
//         }
//         instance.wallet = wallet;
//         instance.masterAccount = new MasterAccount(wallet);
//     }
//     console.log(instance);

//     return { ...instance };
// };

const loadIncognito = async (walletName = '') => {
    if (IncognitoInstance && !semaphore) {
        await loadWASM();
        semaphore = true; // mark awaited constructor
        const walletBackup = LocalStorageServices.getItem(LOCAL_STORAGE_KEY.WALLET);
        let wallet;
        if (!walletBackup) {
            wallet = await walletInstance.createWallet(Config.WALLET_PASS, walletName || Config.WALLET_NAME);
            const backupWalletString = wallet.backup(Config.WALLET_PASS);
            LocalStorageServices.setItem(LOCAL_STORAGE_KEY.WALLET, backupWalletString);
            console.log('init wallet');
        } else {
            wallet = await walletInstance.restore(Config.WALLET_PASS, walletBackup);
            // const t = wallet.masterAccount.getAccounts();
            // const ac = t[0];
            // const token = await ac.getFollowingPrivacyToken();
            // const balanceBN = await token.getTotalBalance();
            // console.log('Token total balance', balanceBN);
            console.log('restore wallet');
        }
        IncognitoInstance.wallet = wallet;
        masterAccount = new MasterAccount(wallet);
        IncognitoInstance.masterAccount = masterAccount;
    }
};

export default loadIncognito;
