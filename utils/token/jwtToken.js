
import jwt from 'jsonwebtoken';
const generateToken = ({_id,email,roleId}) => {
 
  
  
  return jwt.sign({ _id,email,roleId }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });
}
export  {generateToken};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}
export {verifyToken};

