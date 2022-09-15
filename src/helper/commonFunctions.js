export const sortTable = (key,type,data,sortConfig) => {
 
  console.log('sorting function')
    
    //sort base on the key and sortcofig

    var arr = data;

    function sortByKey(a, b) {

        if ((type ==='Float' ? parseFloat(a[key]) : a[key])  < (type ==='Float' ? parseFloat(b[key]): b[key])) {
            return sortConfig === 'ascending' ? -1 : 1;
          }
          if ((type ==='Float' ? parseFloat(a[key]): a[key]) > (type ==='Float' ? parseFloat(b[key]): b[key])) {
            return sortConfig === 'ascending' ? 1 : -1;
          }
          return 0;
        }
        

      const sorted = arr.sort(sortByKey);
      //        console.log(sorted);
    console.log('returning value...')
    return sorted;
  };
