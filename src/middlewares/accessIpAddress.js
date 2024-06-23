const extractIpAddress = (req, res, next) => {
    try{
       let clientsIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
       
        // Handle IPv6-mapped IPv4 addresses
        if (clientsIp.includes('::ffff:')) {
            clientsIp = clientsIp.substr(7);
        }
        res.locals.ip = clientsIp;
        next();
    }catch(error){
        console.log(error);
        next(error);
    }
}

export default extractIpAddress