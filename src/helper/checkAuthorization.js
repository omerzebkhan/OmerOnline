  import UserService from "../services/user.service";
  // import { useSelector } from "react-redux";

  
  export const checkAdmin =  () => {
      //var res = "";
      return UserService.getAdminBoard()
      .then(
          (response) => {
            console.log(`check Admin has been called...`);
            console.log(response.data);
          //   res = response.data;
          return (response.data);
          }
          ,
          (error) => {
            const content =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
    
            return (content);
          }
        );
      // console.log(`function returned .....${res}`)
      // return(`function returned .....${res}`)
      };

  export const checkAccess = (srcName,rights) =>{
    //const currentUser = useSelector((state) => state.user.user);
   // console.log(`rights are ${rights}  ${rights[0]}`)
   var access = rights.some(function (val) { 
    var sName = val.split(",");
    //console.log(`${sName[0]}  ${sName[1]}`) 
    return srcName ===sName[0] && sName[1]==="TRUE" ;
  });
  //console.log(`Access value = ${access}`)
  return access;


    // for (var i = 0; i < rights.length; i++) {  
    //     var sName = rights[i].split(",");
    //     console.log(` inside loop rights are ${sName[0]} = ${srcName} is ${sName[1]} = True`)
    //     //if (sName[0]===srcName && sName[1]==="True"){
    //       if (sName[0]===srcName && sName[1]==="TRUE"){
    //       console.log("Access allowed")
    //       return "Allowed";
    //       break;
    //        }

    //       }
    
  };

  

    