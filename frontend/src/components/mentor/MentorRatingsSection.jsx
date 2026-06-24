import { useState } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'
import StarRating from '../ui/StarRating'
import Button from '../ui/Button'
import { useMentorRatings } from '@/hooks/mentor/useMentorRatings'
import { useTranslation } from '@/i18n'

function formatRatingDate(timestamp, lang) {
  if (!timestamp) return ''
  try {
    return new Date(timestamp).toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

const MentorRatingsSection = ({ mentorId, showSummary = true }) => {
  const { t, lang } = useTranslation()
  const {
    ratings,
    summary,
    myRating,
    loading,
    saving,
    error,
    canRate,
    saveRating,
  } = useMentorRatings(mentorId)

  const [draft, setDraft] = useState(0)
  const [hovered, setHovered] = useState(0)

  const average = summary.average ?? 0
  const count = summary.count ?? 0

  const handleSave = async () => {
    if (draft < 1 || myRating) return
    try {
      await saveRating(draft)
      setDraft(0)
    } catch {
      /* error surfaced below */
    }
  }

  return (
    <div className="space-y-5">
      {showSummary && count > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-slate-800">
            {average ? average.toFixed(1) : '—'}
          </span>
          <div>
            <StarRating rating={average} size="md" />
            <p className="text-xs text-slate-400 mt-0.5">
              {t('mentorProfile.reviews', { count })}
            </p>
          </div>
        </div>
      )}

      {canRate && (
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
          {myRating ? (
            <>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                {t('mentorDetail.yourRating')}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={myRating.rating} size="md" />
                <span className="text-xs text-slate-400">
                  {formatRatingDate(myRating.timestamp, lang)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-3">{t('mentorDetail.alreadyRated')}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-700 mb-3">
                {t('mentorDetail.rateThisMentor')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setDraft(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={clsx(
                          'w-8 h-8 transition-colors',
                          (hovered || draft) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        )}
                      />
                    </button>
                  ))}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={draft < 1 || saving}
                >
                  {saving ? t('mentorDetail.savingRating') : t('mentorDetail.submitRating')}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {error ? (
        <p className="text-sm text-red-500">
          {error?.status === 409
            ? t('mentorDetail.alreadyRated')
            : error?.message || t('mentorDetail.ratingError')}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500 text-center py-4">{t('student.loadingMentors')}</p>
      ) : ratings.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-4">{t('mentorDetail.noReviews')}</p>
      ) : (
        <div className="space-y-4">
          {ratings.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {myRating?.id === item.id
                    ? t('mentorDetail.yourRating')
                    : t('mentorDetail.anonymousStudent')}
                </p>
                <p className="text-xs text-slate-400">
                  {formatRatingDate(item.timestamp, lang)}
                </p>
              </div>
              <StarRating rating={item.rating} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MentorRatingsSection
