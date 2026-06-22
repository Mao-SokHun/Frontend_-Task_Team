/**
 * Student UI ↔ backend `students` table fields.
 * Allowed PUT /v1/students/me: firstname, lastname, phone_number,
 * study_major, university, description, address
 */

import { getPhoneDigits } from '@/utils/phoneInput'
import {
  validateStudentOnboardingStep1 as validateStudentOnboardingStep1Shared,
  validateStudentOnboardingStep2 as validateStudentOnboardingStep2Shared,
} from '@/lib/validation/student/index.js'

export function validateStudentOnboardingStep1(form, ctx) {
  return validateStudentOnboardingStep1Shared(form, ctx)
}

export function validateStudentOnboardingStep2(interests) {
  return validateStudentOnboardingStep2Shared(interests)
}

export function studentOnboardingFormFromUser(user = {}) {
  return {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    location: user.location ?? user.province ?? '',
    phone: user.phone ?? '',
    bio: user.bio ?? '',
  }
}

export function studentOnboardingSelectionsFromUser(user = {}) {
  const interests = Array.isArray(user.interests) ? user.interests : []
  const goals = Array.isArray(user.goals) ? user.goals : []
  return { interests, goals }
}

/** UI profile → PUT /v1/students/me body */
export function studentProfileToApiPayload(profile = {}) {
  const firstname = profile.firstName?.trim() ?? ''
  const lastname = profile.lastName?.trim() ?? ''
  const bio = profile.bio?.trim() || null
  const learningFocus = profile.learningFocus?.trim() || null

  return {
    firstname,
    lastname,
    phone_number: getPhoneDigits(profile.phone) || null,
    address: profile.location || profile.province || null,
    description: bio,
    study_major: learningFocus,
    university: profile.university?.trim() || null,
  }
}

/** GET /v1/students/me row → session user patch */
export function studentApiRowToProfile(row = {}) {
  if (!row || typeof row !== 'object') return {}
  const firstName = row.firstname ?? row.firstName ?? ''
  const lastName = row.lastname ?? row.lastName ?? ''
  return {
    firstName,
    lastName,
    name: [firstName, lastName].filter(Boolean).join(' ').trim(),
    phone: row.phone_number ?? row.phone ?? '',
    location: row.address ?? row.location ?? '',
    province: row.address ?? row.province ?? '',
    bio: row.description ?? row.bio ?? '',
    learningFocus: row.study_major ?? row.learningFocus ?? '',
    university: row.university ?? '',
    interests: row.interests ?? [],
    goals: row.goals ?? [],
  }
}
