export const getSender = (loggedUser, users) => {
  console.log(loggedUser.userWithoutPassword._id, users[0]._id);
    return users[0]._id === loggedUser.userWithoutPassword._id ? users[1].userName : users[0].userName;
};