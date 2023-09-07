class middlerware{
    auth(req,res,next){
        if(req.cookies.user) next();
        else res.redirect('/auth');
    }
}

module.exports = new middlerware();