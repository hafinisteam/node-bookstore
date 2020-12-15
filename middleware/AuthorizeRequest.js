const ROLES = {
  ADMIN: 1,
  USER: 2
}

const authorizedRequest = function(minRole) {
  return function(req, res, next) {
    if(!req.user) {
      return res.status(401).send('No authentication')
    }
    if(ROLES[req.user.role] > ROLES[minRole]){
      return res.status(403).send('No persmission')
    }
    return next();
  }
}

module.exports = authorizedRequest