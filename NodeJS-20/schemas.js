export const course = {
  properties: {
    courseTitle: {
      message: "Please enter course title",
      required: true,
    },
    courseDescription: {
      message: "Please enter course description",
      required: true,
    },
  },
};
export const lesson = {
  properties: {
    lessonTitle: {
      message: "Please enter lesson title",
      required: true,
    },
    lessonDescription: {
      message: "Please enter lesson description",
      required: true,
    },
  },
};
export const lesson_id = {
  properties: {
    _id: {
      message: "Please enter lesson id",
      required: true,
      pattern: /^[0-9a-fA-F]{24}$/,
    },
  },
};

export const comment = {
    properties: {
        commentText: {
          message: "Please enter comment",
          required: true,
        },
      },
}


export const resource = {
    properties: {
      fnltype: {
        message: "Please enter resource type (video or link)",
        required: true,
        pattern:/^(video|link)\b/,
        default: "link"
      },
      fileDescription: {
        message: "Please enter resource description",
        required: true,
      },
      rLink:{
        message: "Please enter resource link",
        required: true,
      }
    },
  };
  