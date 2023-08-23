const success = (message , data=null) =>{
    var response = {
        status : 200,
        message:message,
        data : data
    }
    return JSON.stringify(response)
}


const failure = (message , err=null) =>{
    var error =  {
        status : 400,
        message:message,
        err : err
       
    }

    return JSON.stringify(error)
}

module.exports={success,failure}