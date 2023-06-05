export const userHasAccess = function (course, userName) {
  const index = course.accessGrantedTo.findIndex(
    (x) => x.userName === userName
  );
  if (userName === course.courseCreator || index != -1) {
    return true;
  }
  return false;
};

export const userIsCreator = function (course, userName) {
  if (userName === course.courseCreator) {
    return true;
  }
  return false;
};
