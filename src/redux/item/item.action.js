import ItemActionType from './item.types';
import itemService from "../../services/item.services";


export const fetchItemStart = () =>({
    type:ItemActionType.FETCH_ITEM_START
});

export const fetchItemSuccess = itemMap =>({
    type:ItemActionType.FETCH_ITEM_SUCCESS,
    payload:itemMap
});

export const fetchItemFailure = errorMessage => ({
    type:ItemActionType.FETCH_ITEM_FAILURE,
    payload:errorMessage
})

export const setCurrentItem= item =>({
    type:ItemActionType.SET_CURRENT_ITEM,
    payload:item
})

export const fetchItemStartAsync = () => {
    
    return dispatch =>{
        
        dispatch (fetchItemStart());
        itemService.getAll()
        .then(response => {
          const itemMap = response.data;
          console.log(itemMap);
          dispatch(fetchItemSuccess(itemMap)); 

        })
        .catch(error=>{
            dispatch(fetchItemFailure(error.response.request.response.message))
        });
}}



//combine two collections in on new array
export const fetchItemTwoItemStartAsync = () => {
    // let item ={};
    // let stock ={};
    //let combine = {};
    return dispatch =>{
        // const collectionRef = firestore.collection('Items');
        // dispatch (fetchItemStart());
        // collectionRef.get()
        // .then (snapshot =>{
        //     snapshot.forEach((doc) => {
        //         const {name} = doc.data();                
        //         firestore.collection('Stock')
        //         //.child(doc.data().uid)
        //         .where("itemName","==",name)
        //         .get()
        //         .then((userDoc) => {
        //             userDoc.forEach((doc) => {
        //                 const {quantity} = doc.data();
        //               combine = {
        //                     name:name,
        //                     quantity:quantity
        //                 };
        //             //     console.log(item.name)
        //             //     console.log(stock)
        //              console.log(combine)
        //             //    //item[doc.data().name].quantity =stock[doc.itemName].quantity;
        //                 //console.log(stock)
        //               }); 
        //         });
        //     //const itemMap = convertItemSnapshotToMap(snapshot);
        //        //console.log(`printing itemmap ${itemMap}`)
        //        //dispatch(fetchItemSuccess(itemMap));          
        //  })})
        //  .catch(error=>dispatch(fetchItemFailure(error.message)));
}}


export const fetchItemByInputAsync = (categoryId) => {
  //  console.log(categoryId)
   return dispatch =>{
   
    dispatch (fetchItemStart());
    itemService.getItemByCat(categoryId)
    .then(response => {
      const itemMap = response.data;
      console.log(itemMap);
      dispatch(fetchItemSuccess(itemMap)); 

    })
    .catch(error=>{
        dispatch(fetchItemFailure(error.response.request.response.message))
    });
    
    }}


