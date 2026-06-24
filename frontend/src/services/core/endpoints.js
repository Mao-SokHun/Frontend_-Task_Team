/**
 * API path constants — must match backend_rokkru routes (mount: /api/v1).
 *
 * Base URL (.env): VITE_API_URL=/api  →  full path = /api + path below
 */

const mentorRoutes = {
  list: '/v1/mentors',
  catalog: '/v1/mentors/catalog',
  byId: (userId) => `/v1/mentors/${userId}`,
  profileViews: (userId) => `/v1/mentors/${userId}/profile-views`,
  me: '/v1/mentors/me',
  myAnalytics: '/v1/mentors/me/analytics',
  myDashboard: '/v1/mentors/me/dashboard',
  myEditProfile: '/v1/mentors/me/edit-profile',
  myPosts: '/v1/mentors/me/posts',
  deleteMyAccount: '/v1/mentors/me/account',
  create: '/v1/mentors',
  skills: {
    byMentor: (userId) => `/v1/mentors/${userId}/skills`,
    item: (userId, subSkillId) => `/v1/mentors/${userId}/skills/${subSkillId}`,
  },
  portfolio: {
    byMentor: (userId) => `/v1/mentors/${userId}/portfolio`,
    item: (userId, link) =>
      `/v1/mentors/${userId}/portfolio/${encodeURIComponent(link)}`,
  },
  experience: {
    byMentor: (userId) => `/v1/mentors/${userId}/experience`,
    item: (userId, experienceId) =>
      `/v1/mentors/${userId}/experience/${experienceId}`,
  },
  posts: {
    listPublished: '/v1/mentors/posts',
    byMentor: (userId) => `/v1/mentors/${userId}/posts`,
    byId: (postId) => `/v1/mentors/posts/${postId}`,
  },
  ratings: {
    summary: (userId) => `/v1/mentors/${userId}/ratings/summary`,
    list: (userId) => `/v1/mentors/${userId}/ratings`,
    me: (userId) => `/v1/mentors/${userId}/ratings/me`,
    create: (userId) => `/v1/mentors/${userId}/ratings`,
  },
}

export const ENDPOINTS = {
  health: '/health',

  auth: {
    login: '/v1/auth/login',
    register: '/v1/auth/register',
    logout: '/v1/auth/logout',
    logoutAll: '/v1/auth/logout-all',
    refreshToken: '/v1/auth/refresh-token',
    me: '/v1/auth/profile',
    updateProfile: '/v1/auth/profile',
    deleteAccount: '/v1/auth/delete-user',
    verifyLoginOtp: '/v1/auth/verify-otp',
    forgotPassword: '/v1/auth/forgot-password',
    verifyResetOtp: '/v1/auth/verify-forgot-otp',
    setNewPassword: '/v1/auth/set-new-password',
    resetPassword: '/v1/auth/reset-password',
  },

  userTypes: {
    list: '/v1/user-types',
  },

  mentors: mentorRoutes,

  users: {
    me: '/v1/users/me',
    profilePicture: '/v1/users/me/profile-picture',
  },

  students: {
    me: '/v1/students/me',
    community: {
      types: '/v1/students/community/types',
      posts: '/v1/students/community/posts',
      myPosts: '/v1/students/community/my-posts',
      history: '/v1/students/community/history',
      postById: (id) => `/v1/students/community/posts/${id}`,
    },
    history: {
      account: '/v1/students/history/account',
      logs: '/v1/students/history/logs',
      full: '/v1/students/history',
    },
  },

  /** Likes, comments, trending — posts CRUD stays on /v1/students/community */
  community: {
    postLikes: (postId) => `/v1/community/posts/${postId}/like`,
    postComments: (postId) => `/v1/community/posts/${postId}/comments`,
    commentById: (commentId) => `/v1/community/comments/${commentId}`,
    trending: '/v1/community/posts/trending',
  },

  admin: {
    dashboard: {
      stats: '/v1/admin/dashboard/stats',
      users: '/v1/admin/dashboard/users',
      userById: (id) => `/v1/admin/dashboard/users/${id}`,
      userStatus: '/v1/admin/dashboard/users/status',
      userRole: (id) => `/v1/admin/dashboard/users/${id}/role`,
    },
    notifications: '/v1/admin/notifications',
    systemSettings: '/v1/admin/system-settings',
    systemSettingByKey: (key) => `/v1/admin/system-settings/${encodeURIComponent(key)}`,
  },

  stripe: {
    config: '/v1/stripe/config',
    plans: '/v1/stripe/plans',
    createCheckout: '/v1/stripe/create-checkout-session',
    session: (sessionId) => `/v1/stripe/session/${encodeURIComponent(sessionId)}`,
    receipt: (paymentId) => `/v1/stripe/receipt/${paymentId}`,
  },
}
