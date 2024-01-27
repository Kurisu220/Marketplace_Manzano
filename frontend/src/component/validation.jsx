function validation(values, isSignup) {
    let errors = {};
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
    if (values.name === undefined || (values.name === "" && isSignup)) {
      errors.name = "Name should not be empty";
    } else if (values.name && values.name.length > 15) {
      errors.name = "Username should not exceed 15 characters";
    } else {
      errors.name = "";
    }
  
    if (values.email === "") {
      errors.email = "Email should not be empty";
    } else if (!emailPattern.test(values.email)) {
      errors.email = "Invalid email format";
    } else {
      errors.email = "";
    }
  
    if (values.password === "") {
      errors.password = "Password should not be empty";
    } else if (!passwordPattern.test(values.password)) {
      errors.password = "Password must contain at least 8 characters, including uppercase, lowercase, and digits";
    } else {
      errors.password = "";
    }
  
    return errors;
  }
  
  export default validation;