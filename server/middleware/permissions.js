module.exports = {
    messageOwner: (req, res, next) => {
        const {body, decoded} = req;
        if(body.user.email === decoded.email){
            next();
        }else{
            res.status(500).send({
                message: "Sorry, You are not owner for this message!"
            });
        }
    },
    canDelete: (req, res, next) => {

        next();
    }
};