import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -3, shadow: '0 8px 30px rgba(0,0,0,0.1)' } : {}}
      className={`
        bg-white rounded-3xl shadow-soft border border-gray-100
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;