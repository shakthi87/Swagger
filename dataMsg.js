


const emailValidation =(email)=>{
            const emailRegex=/^[a-zA-Z0-9]+@gmail+.com$/;
            return emailRegex.test(email)
}
const passwordValidation=(password)=>{
      const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!^%*?&]{6,15}$/
      return passwordRegex.test(password)
}
const nameValidation=(name)=>{
      const nameRegex=/^[a-zA-Z]{1,50}$/
      return nameRegex.test(name)
}
const phoneValidation=(phone_no)=>{
      const phoneRegex=/^([1-9]\d*|0{10})$/
      return phoneRegex.test(phone_no)
}
const dofValidation=(DOB)=>{
      const DOBRegex=/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/
      return DOBRegex.test(DOB)
}

const dataMsg = {
      required_emailMsg: "Invalid email formate Email formate be ****@gmail.com",
      required_passwordMsg:"Invail password formate At least one Upper case,lower case,numbers,one special character,minimum 6 character",
      required_nameMsg:"Invalid name formate",
      required_phone_noMsg:"Invalid phone number formate not more than 10 numbers",
      required_dofMsg:"Invalid date of birth formate 'YYYY-MM-DD'",
      required_common:"Required field are needed",
      required_descrption:"Description required Needed",
      required_type:"Required type is needed ",
      required_media_name:"Media name is Required",
      required_Cdescription:"Description cannot be image or video type",      
      required_Comment:"Comment is Required",
      required_feed_id:"Feed id needed",
      required_user_id:"user id needed",
      required_comment_id:"comment id needed",
      required_JWT:"invaild token",
      required_unauthorized:"unauthorized",
      required_page:"Page number needed",
      required_limit:"Limit range is needed",
      required_text:"Text feed cannot have an file ",
      required_file:"File upload required for image or video feed_type",
      required_other_media:'Invalid file type. Only picture and video file on type PNG,JPEG,JPG,MP4 are allowed!'
}


module.exports={
      emailValidation,
      passwordValidation,
      nameValidation,
      phoneValidation,
      dofValidation,
      dataMsg
}