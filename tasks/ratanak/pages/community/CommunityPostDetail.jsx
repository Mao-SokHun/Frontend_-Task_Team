import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronLeft, Heart, MessageSquare, Share2 } from 'lucide-react'
import { useCommunityPostState } from '@/hooks'
import { isApiEnabled } from '@/constants'
import { fetchCommunityPostById } from '@/services/communities/communityService'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { CommunityPostComments } from '@/components'
import { PageAmbient } from '@/components'
import { useTranslation } from '@/i18n'
import clsx from 'clsx'

const CommunityPostDetail = () => {
  const { postId } = useParams()
  const { t } = useTranslation()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(isApiEnabled())
  const {
    isLiked,
    getLikeCount,
    commentsByPost,
    toggleLike,
    addComment,
    engagementLoading,
    engagementError,
  } = useCommunityPostState(postId)
  const [commentDraft, setCommentDraft] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  useEffect(() => {
    if (!postId || !isApiEnabled()) {
      setPost(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    fetchCommunityPostById(postId)
      .then((row) => {
        if (!cancelled) setPost(row)
      })
      .catch(() => {
        if (!cancelled) setPost(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [postId])

  if (loading) {
    return (
      <PageAmbient variant="community">
        <p className="text-sm text-slate-500 text-center py-16">{t('common.loading')}</p>
      </PageAmbient>
    )
  }

  if (!post) return <Navigate to="/community" replace />

  const liked = isLiked(post.id)
  const comments = commentsByPost[String(post.id)] || []
  const likeCount = getLikeCount(post.id, post.likes)
  const body = post.body || post.preview || post.content || ''

  const handleAddComment = async (text) => {
    setCommentSubmitting(true)
    try {
      await addComment(post.id, text)
      setCommentDraft('')
    } catch {
      /* engagementError shown below */
    } finally {
      setCommentSubmitting(false)
    }
  }

  return (
    <PageAmbient variant="community" className="space-y-4 sm:space-y-5">
      <Link
        to="/community"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to community
      </Link>

      <article className="glass-panel rounded-xl overflow-hidden w-full">
        <div className="px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <Avatar name={post.author} size="sm" className="flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-bold text-base text-slate-800">{post.author}</span>
                    <Badge variant={post.authorRole === 'Teacher' ? 'primary' : 'neutral'} size="sm">
                      {post.authorRole}
                    </Badge>
                  </div>
                  {post.dept && (
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                      {post.dept}
                    </p>
                  )}
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{post.time}</span>
              </div>
              {post.title ? (
                <h1 className="text-lg font-bold text-slate-800 mt-3">{post.title}</h1>
              ) : null}
              <p className="text-sm sm:text-base text-slate-700 mt-4 leading-relaxed whitespace-pre-line">
                {body}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 sm:px-6 py-2.5 border-t border-white/50 bg-white/10">
          <button
            type="button"
            onClick={() => toggleLike(post.id)}
            className={clsx(
              'flex items-center gap-1.5 text-xs font-medium transition-colors',
              liked ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'
            )}
          >
            <Heart className={clsx('w-4 h-4', liked && 'fill-primary-500')} />
            {likeCount}
          </button>
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MessageSquare className="w-4 h-4" />
            {comments.length || post.comments || 0}
          </span>
          <button
            type="button"
            className="ml-auto p-1 text-slate-400 hover:text-primary-600 rounded-md transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {engagementLoading ? (
          <p className="text-xs text-slate-500 text-center py-3">{t('common.loading')}</p>
        ) : null}
        {engagementError ? (
          <p className="text-xs text-red-500 text-center py-2 px-4">
            {engagementError?.message || t('communityFeed.commentError')}
          </p>
        ) : null}

        <CommunityPostComments
          comments={comments}
          draft={commentDraft}
          onDraftChange={setCommentDraft}
          onSubmit={handleAddComment}
          autoFocus={false}
        />
        {commentSubmitting ? (
          <p className="text-xs text-slate-400 text-center pb-2">{t('communityFeed.postingComment')}</p>
        ) : null}
      </article>
    </PageAmbient>
  )
}

export default CommunityPostDetail
