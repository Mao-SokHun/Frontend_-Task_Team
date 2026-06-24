import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCommunityPostState } from '@/hooks'
import { useAuth } from '@/hooks'
import { COMMUNITY_FEED_TABS } from '@/constants'
import { isApiEnabled } from '@/constants'
import {
  SubjectTabs,
  CommunityPostCard,
  PageAmbient,
  CommunityComposePrompt,
  CreatePostModal,
} from '@/components'
import { useTranslation } from '@/i18n'
import { useCommunityFeed } from '@/hooks/useCommunityFeed'
import { useCommunities } from '@/hooks/useCommunities'

const Community = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState('ALL POSTS')
  const [createOpen, setCreateOpen] = useState(false)
  const { isLiked, getLikeCount, commentsByPost, toggleLike } = useCommunityPostState()
  const { posts, loading } = useCommunityFeed({ limit: 100 })
  const { communities: types } = useCommunities()

  const feedTabs = useMemo(() => {
    if (!types.length) return COMMUNITY_FEED_TABS
    const names = types
      .map((row) => String(row.name ?? '').trim().toUpperCase())
      .filter(Boolean)
    return ['ALL POSTS', ...[...new Set(names)]]
  }, [types])

  useEffect(() => {
    if (location.state?.openCreatePost) {
      setCreateOpen(true)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const displayed =
    activeFilter === 'ALL POSTS'
      ? posts
      : posts.filter((p) => p.category === activeFilter)

  const handleCloseCreate = () => {
    setCreateOpen(false)
    if (location.pathname === '/community/create-post') {
      navigate('/community', { replace: true })
    }
  }

  return (
    <PageAmbient variant="community" className="space-y-6 sm:space-y-8">
      <section className="space-y-3 sm:space-y-3.5 w-full">
        <CommunityComposePrompt
          userName={user?.name || t('auth.student')}
          onClick={() => setCreateOpen(true)}
        />

        <div className="glass-panel rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5">
          <SubjectTabs spread tabs={feedTabs} active={activeFilter} onChange={setActiveFilter} />
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:gap-5 w-full">
        {loading && isApiEnabled() ? (
          <p className="text-sm text-slate-500 text-center py-12">{t('common.loading')}</p>
        ) : displayed.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-12">{t('communityPost.emptyFeed')}</p>
        ) : (
          displayed.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              comments={commentsByPost[String(post.id)] || []}
              liked={isLiked(post.id)}
              likeCount={getLikeCount(post.id, post.likes)}
              onLike={() => toggleLike(post.id)}
            />
          ))
        )}
      </div>

      <CreatePostModal open={createOpen} onClose={handleCloseCreate} />
    </PageAmbient>
  )
}

export default Community
