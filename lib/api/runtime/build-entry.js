import slugify from '@sindresorhus/slugify'
import isEntryHead from './is-entry-head'
import isMainSectionHead from './is-main-section-head'
import isSectionHead from './is-section-head'

const isEntryEnd = child =>
  isEntryHead(child) || isMainSectionHead(child) || isSectionHead(child)

export default function createBuildEntry(title) {
  const slug = slugify(title, { decamelize: false })
  return function buildEntry(children, prevContent) {
    const [child, ...rest] = children

    if (isEntryEnd(child) || rest.length === 0) {
      const content = rest.length !== 0 ? prevContent : [...prevContent, child]
      const structure = { title, slug, content }
      return [{ structure }, rest.length !== 0 ? children : null]
    }

    return buildEntry(rest, [...prevContent, child])
  }
}
