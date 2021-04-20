module.exports = function (users, message, client) {
    users.forEach(function (user) { return client.users.fetch(user.id, false)
        .then(function (u) { return u.send("`" + message + "`"); }); });
};
