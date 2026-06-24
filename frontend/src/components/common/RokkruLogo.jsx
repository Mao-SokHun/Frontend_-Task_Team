import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { brand } from '@/constants'

const RokkruLogo = ({ to = '/', className, size = 'md', showText = true }) => {
  const sizes = {
    sm: { text: 'text-base' },
    md: { text: 'text-lg' },
    lg: { text: 'text-lg' },
  }
  const s = sizes[size] || sizes.md

  const content = (
    <>
      {showText && (
        <span className={clsx('font-bold text-primary-600 capitalize', s.text)}>{brand.name}</span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={clsx('flex items-center gap-2', className)}>
        {content}
      </Link>
    )
  }

  return <div className={clsx('flex items-center gap-2', className)}>{content}</div>
}

export default RokkruLogo
