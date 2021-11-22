module.exports = errorHandler;

function errorHandler(err, req, res, next) {
   
    if (typeof (err) === 'string') {
       
        console.log(err)
        
    }

    
    return res.status(500).json({ message: err.message });
}