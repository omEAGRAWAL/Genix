// import { useState } from "react";
// import AWS from "aws-sdk";

// const S3_BUCKET = "genixabb";
// const REGION = "Asia Pacific (Mumbai) ap-south-1";

// AWS.config.update({
//   accessKeyId: "AKIA4MTWJGWQLCWBOVVS",
//   secretAccessKey: "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",
// });

// const myBucket = new AWS.S3({
//   params: { Bucket: S3_BUCKET },
//   region: REGION,
// });

// function UploadImage() {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileInput = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const uploadFile = () => {
//     const params = {
//       ACL: "public-read",
//       Body: selectedFile,
//       Bucket: S3_BUCKET,
//       Key: selectedFile.name,
//     };

//     myBucket.putObject(params).send((err) => {
//       if (err) console.log(err);
//     });
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileInput} />
//       <button onClick={uploadFile}> Upload to S3 </button>
//     </div>
//   );
// }

// export default UploadImage;
