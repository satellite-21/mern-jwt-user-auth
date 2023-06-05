// const jwt = require("jsonwebtoken");
// const config = require("../config/auth.config.js");
// const db = require("../models");
// const User = db.user;
// const Role = db.role;

// const verifyToken = (req, res, next) => {
//     let token = req.headers["x-access-token"];

//     if(!token){
//         return res.status(403).send({message: "No Token Provided!"});
//     }

//     jwt.verify(token, config.secret, (err, decoded) => {
//         if(err){
//             return res.status(401).send({message : "Unauthorized!"})
//         }

//         req.userId = decoded.id;
//         next();
//     });
// };


// const isAdmin = (req, res, next) => {
//     User.findById(req.userId).exec((err, user) => {
//         if(err){
//             res.status(500).send({message: err})
//             return
//         }

//         Role.find(
//             {
//                 _id: { $in: user.roles }
//             },
//             (err, roles ) => {
//                 if(err) {
//                     res.status(500).send({message: err});
//                     return;
//                 }

//                 for(let i = 0; i<roles.length; i++){
//                     if (roles[i].name === 'admin'){
//                         next();
//                         return;
//                     }
//                 }

//                 res.status(403).send({message: "require admin role"});
//                 return 
//             }
//         );

//     });
// };


// const isModerator = (req, res, next) => {
//     User.findById(req.userId).exec((err, user) => {
//         if(err){
//             res.status(500).send({message: err})
//             return
//         }

//         Role.find(
//             {
//                 _id: { $in: user.roles }
//             },
//             (err, roles ) => {
//                 if(err) {
//                     res.status(500).send({message: err});
//                     return;
//                 }

//                 for(let i = 0; i<roles.length; i++){
//                     if (roles[i].name === 'moderator'){
//                         next();
//                         return;
//                     }
//                 }

//                 res.status(403).send({message: "require moderator role"});
//                 return 
//             }
//         );

//     });
// };


// const authJwt = {
//     verifyToken,
//     isAdmin,
//     isModerator
// };

// module.exports = authJwt;

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No Token Provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then(user => {
      if (!user) {
        res.status(500).send({ message: "User not found" });
        return;
      }

      Role.find({ _id: { $in: user.roles } })
        .exec()
        .then(roles => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
              next();
              return;
            }
          }

          res.status(403).send({ message: "Require admin role" });
        })
        .catch(err => {
          res.status(500).send({ message: err });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId)
    .exec()
    .then(user => {
      if (!user) {
        res.status(500).send({ message: "User not found" });
        return;
      }

      Role.find({ _id: { $in: user.roles } })
        .exec()
        .then(roles => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
              next();
              return;
            }
          }

          res.status(403).send({ message: "Require moderator role" });
        })
        .catch(err => {
          res.status(500).send({ message: err });
        });
    })
    .catch(err => {
      res.status(500).send({ message: err });
    });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};

module.exports = authJwt;
