const uploadImageToCloudinary = async (file: File): Promise<string> => {
    

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "hed-visiting");
  const name=process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const response = await fetch(`https://api.cloudinary.com/v1_1/${name}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log(data)
  if (!response.ok) throw new Error(data.error?.message || "Upload failed");

  return data.secure_url;
};
export default uploadImageToCloudinary