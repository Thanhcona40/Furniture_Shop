export const uploadToCloudinary = async (pics) => {

    if(pics){
        const data = new FormData();
        data.append("file", pics)
        data.append("upload_preset", "furniture_shop")
        data.append("cloud_name","ddrywxdoy")
        data.append("public_id", `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);

        const res = await fetch("https://api.cloudinary.com/v1_1/ddrywxdoy/image/upload",
            {
                method:"post",
                body:data
            }
        )

        const fileData = await res.json();
        return fileData.url.toString()
    }
    else console.log("error from upload function")
}