import { createSelector } from 'reselect';
import { KEY_REDUCER_INCOGNITO, FIELDS_STATE } from './consts';
import { initState } from './reducer';

const incognitoSelector = (state) => state[KEY_REDUCER_INCOGNITO] || initState;

export const makeSelectIncognitoLoading = () => createSelector(incognitoSelector, (item) => item[FIELDS_STATE.INCOGNITO_LOADING]);
export const makeSelectWallet = () => createSelector(incognitoSelector, (item) => item[FIELDS_STATE.WALLET]);
export const makeSelectMasterAccount = () => createSelector(incognitoSelector, (item) => item[FIELDS_STATE.MASTER_ACCOUNT]);
export const makeSelectAccountSelected = () => createSelector(incognitoSelector, (item) => item[FIELDS_STATE.ACCOUNT_SELECTED]);
