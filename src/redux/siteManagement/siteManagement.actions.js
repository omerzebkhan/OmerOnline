import SiteManagementActionType from './siteManagement.types';
import {firestore,convertSiteHeaderSnapshotToMap} from '../../firebase/firebase.util';

export const fetchSiteManagementStart = () =>({
    type:SiteManagementActionType.FETCH_SITEMANAGEMENT_START
});

export const fetchSiteManagementSuccess = siteMap =>({
    type:SiteManagementActionType.FETCH_SITEMANAGEMENT_SUCCESS,
    payload:siteMap
});

export const fetchSiteManagementFailure = errorMessage => ({
    type:SiteManagementActionType.FETCH_SITEMANAGEMENT_FAILURE,
    payload:errorMessage
})

export const fetchSiteStartAsync = () => {
    console.log("executing fetchSite management..")
    return dispatch =>{
        console.log("executing fetchSite management..")
        const collectionRef = firestore.collection('Header').where("name", "==","SiteHeader");
        //const collectionRef = firestore.collection('Header');
        dispatch (fetchSiteManagementStart());
        collectionRef.get()
        .then (snapshot =>{
                const siteMap = convertSiteHeaderSnapshotToMap(snapshot);
                dispatch(fetchSiteManagementSuccess(siteMap));          
         })
         .catch(error=>dispatch(fetchSiteManagementFailure(error.message)))
         ;}
}

