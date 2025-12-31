import { useAuth } from '../../context/useAuth';

const RoleGuard = ({ children, allowedRoles, fallback = null }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return children;
};

export default RoleGuard;
