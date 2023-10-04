class middlerware{
    auth(req,res,next){
        if(req.cookies.user) next();
        else res.redirect('/auth');
    }

    sortMiddleware(req,res,next){
        res.locals._sort = {
            enabled : false,
            order : 'default'
        }

        if(req.query.hasOwnProperty('_sort')){
            Object.assign(res.locals._sort,{
                enabled : true,
                order : req.query.order,
                column : req.query.column
            })
        }

        next();
    }
}

module.exports = new middlerware();