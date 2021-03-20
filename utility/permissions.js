module.exports = {
  name: 'permissions',
  description: 'get user permission by role',
  check(member, roles) {
    let hasPermission = false;

    roles.forEach((allowedRole) => {
      if (member.roles.cache.has(allowedRole)) hasPermission = true;
    });

    return hasPermission;
  },
};
