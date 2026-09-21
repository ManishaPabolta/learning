const User = require("../models/User");
const Course = require("../models/Course");
const Notification = require("../models/Notification");

// ======================================================
// CREATE SINGLE NOTIFICATION
// ======================================================

const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  course = null,
  assignment = null,
  project = null,
  invitation = null,
  link = null,
  metadata = {},
}) => {
  try {
    if (!recipient) {
      console.warn(
        "NOTIFICATION: recipient is missing"
      );
      return null;
    }

    if (!type) {
      console.warn(
        "NOTIFICATION: notification type is missing"
      );
      return null;
    }

    if (!title) {
      console.warn(
        "NOTIFICATION: notification title is missing"
      );
      return null;
    }

    if (!message) {
      console.warn(
        "NOTIFICATION: notification message is missing"
      );
      return null;
    }

    const notification =
      await Notification.create({
        recipient,
        sender,
        type,
        title,
        message,
        course,
        assignment,
        project,
        invitation,
        link,
        metadata,
        isRead: false,
        readAt: null,
      });

    return notification;
  } catch (error) {
    // --------------------------------------------------
    // IMPORTANT:
    // Notification failure should NOT break the
    // original course/assignment/project operation.
    // --------------------------------------------------

    console.error(
      "CREATE NOTIFICATION ERROR:",
      error.message
    );

    return null;
  }
};

// ======================================================
// CREATE NOTIFICATIONS FOR MULTIPLE USERS
// ======================================================

const createNotifications = async ({
  recipients = [],
  sender = null,
  type,
  title,
  message,
  course = null,
  assignment = null,
  project = null,
  invitation = null,
  link = null,
  metadata = {},
}) => {
  try {
    if (!Array.isArray(recipients)) {
      return [];
    }

    // --------------------------------------------------
    // Remove empty IDs + duplicate users
    // --------------------------------------------------

    const uniqueRecipients = [
      ...new Set(
        recipients
          .filter(Boolean)
          .map((id) => id.toString())
      ),
    ];

    if (uniqueRecipients.length === 0) {
      return [];
    }

    const documents = uniqueRecipients.map(
      (recipient) => ({
        recipient,
        sender,
        type,
        title,
        message,
        course,
        assignment,
        project,
        invitation,
        link,
        metadata,
        isRead: false,
        readAt: null,
      })
    );

    const notifications =
      await Notification.insertMany(
        documents,
        {
          ordered: false,
        }
      );

    return notifications;
  } catch (error) {
    console.error(
      "CREATE MULTIPLE NOTIFICATIONS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// GET ALL ADMINS
// ======================================================

const getAdminIds = async () => {
  try {
    const admins = await User.find({
      role: "admin",
      isVerified: true,
    })
      .select("_id")
      .lean();

    return admins.map((admin) =>
      admin._id.toString()
    );
  } catch (error) {
    console.error(
      "GET ADMIN IDS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// NOTIFY ALL ADMINS
// ======================================================

const notifyAdmins = async ({
  sender = null,
  type,
  title,
  message,
  course = null,
  assignment = null,
  project = null,
  invitation = null,
  link = null,
  metadata = {},
}) => {
  try {
    const adminIds = await getAdminIds();

    if (adminIds.length === 0) {
      return [];
    }

    return await createNotifications({
      recipients: adminIds,
      sender,
      type,
      title,
      message,
      course,
      assignment,
      project,
      invitation,
      link,
      metadata,
    });
  } catch (error) {
    console.error(
      "NOTIFY ADMINS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// GET ALL NORMAL VERIFIED USERS
// ======================================================

const getStudentIds = async () => {
  try {
    const students = await User.find({
      role: "user",
      isVerified: true,
    })
      .select("_id")
      .lean();

    return students.map((student) =>
      student._id.toString()
    );
  } catch (error) {
    console.error(
      "GET STUDENT IDS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// NOTIFY ALL STUDENTS / NORMAL USERS
// ======================================================

const notifyAllStudents = async ({
  sender = null,
  type,
  title,
  message,
  course = null,
  assignment = null,
  project = null,
  invitation = null,
  link = null,
  metadata = {},
}) => {
  try {
    const studentIds = await getStudentIds();

    if (studentIds.length === 0) {
      return [];
    }

    return await createNotifications({
      recipients: studentIds,
      sender,
      type,
      title,
      message,
      course,
      assignment,
      project,
      invitation,
      link,
      metadata,
    });
  } catch (error) {
    console.error(
      "NOTIFY ALL STUDENTS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// GET COURSE STUDENTS
// ======================================================
//
// Course model currently contains:
//
// students: [User ObjectIds]
//
// ======================================================

const getCourseStudentIds = async (
  courseId
) => {
  try {
    const course = await Course.findById(courseId)
      .select("students")
      .lean();

    if (!course) {
      return [];
    }

    return (course.students || []).map((student) =>
      student.toString()
    );
  } catch (error) {
    console.error(
      "GET COURSE STUDENTS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// NOTIFY STUDENTS ENROLLED IN A COURSE
// ======================================================

const notifyCourseStudents = async ({
  courseId,
  sender = null,
  type,
  title,
  message,
  course = null,
  assignment = null,
  project = null,
  invitation = null,
  link = null,
  metadata = {},
  excludeRecipients = [],
}) => {
  try {
    if (!courseId) {
      return [];
    }

    let studentIds =
      await getCourseStudentIds(courseId);

    // --------------------------------------------------
    // Exclude specific users if required
    // --------------------------------------------------

    const excluded = new Set(
      (excludeRecipients || []).map((id) =>
        id.toString()
      )
    );

    studentIds = studentIds.filter(
      (id) => !excluded.has(id)
    );

    if (studentIds.length === 0) {
      return [];
    }

    return await createNotifications({
      recipients: studentIds,
      sender,
      type,
      title,
      message,
      course: course || courseId,
      assignment,
      project,
      invitation,
      link,
      metadata,
    });
  } catch (error) {
    console.error(
      "NOTIFY COURSE STUDENTS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// NOTIFY SPECIFIC USERS
// ======================================================
//
// Useful for project members / assignment submission etc.
// ======================================================

const notifyUsers = async ({
  userIds = [],
  sender = null,
  type,
  title,
  message,
  course = null,
  assignment = null,
  project = null,
  invitation = null,
  link = null,
  metadata = {},
}) => {
  try {
    if (!Array.isArray(userIds)) {
      return [];
    }

    return await createNotifications({
      recipients: userIds,
      sender,
      type,
      title,
      message,
      course,
      assignment,
      project,
      invitation,
      link,
      metadata,
    });
  } catch (error) {
    console.error(
      "NOTIFY USERS ERROR:",
      error.message
    );

    return [];
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createNotification,
  createNotifications,

  getAdminIds,
  getStudentIds,
  getCourseStudentIds,

  notifyAdmins,
  notifyAllStudents,
  notifyCourseStudents,
  notifyUsers,
};