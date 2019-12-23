export default function getFragment({ category, section, entry }) {
  return `${category}${section ? `/${section}` : ''}${entry ? `/${entry}` : ''}`
}
