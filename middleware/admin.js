

module.exports = function (req,res,next) {
    // 401 unauthorized - invalid token please try again
    // 403 forbidden - user does not have permission to access resource
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');
    next();
}