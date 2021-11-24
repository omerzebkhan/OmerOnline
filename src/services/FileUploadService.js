import http from "../http-common";

const upload = (file, onUploadProgress,id,path) => {
  let formData = new FormData();
  //try to put id as name of the file 
  //var newFileName = "newgeneratedid";
 //formData.append("file", file);
 console.log(`parameter filename = ${id}`)
  formData.append("path", path);
  formData.append("filename", id);
  formData.append('file', file);

  
  if (process.env.REACT_APP_S3 ==="True"){
  //////////////for Amazon S3 upload 12 months free
  return http.post("/uploadS3/", formData, {headers: {"Content-Type": "multipart/form-data" // "Content-type": "application/json"
},onUploadProgress,});
  }
  else{
  ////////////////for local upload
   return http.post("/upload/", formData, {headers: {"Content-Type": "multipart/form-data" // "Content-type": "application/json"
   },onUploadProgress,});
  }
  

};

const getFiles = () => {
  return http.get("/get/files");
};

const getImage = (data) => {
 // console.log(`data ==${data.path}`);
  return http.post(`/get/image`,data);
};

export default {
  upload,
  getFiles,
  getImage,
};