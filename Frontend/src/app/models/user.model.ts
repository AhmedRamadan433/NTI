export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "Admin" | "Member";
  isActive: boolean;
  isDeleted: boolean;
  userImage?: string;
  userBio?: string;
  userSkills: string[];
  userSocialLinks?: Record<string, string>;
  userProjects: string[];
  userTasks: string[];
  userComments: string[];
  userNotifications: string[];
  userMessages: string[];
  userActivities: string[];
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
