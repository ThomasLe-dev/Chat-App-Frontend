export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser.userWithoutPassword._id ? users[1].userName : users[0].userName;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser.userWithoutPassword._id ? users[1] : users[0];
};