import Select from '~/components/select'
import { useAmp } from 'next/amp'

const VersionSwitcher = ({ onChange, version }) => {
  const isAmp = useAmp()
  const href = `/docs/${version === 'v1' ? 'v2' : 'v1'}`
  const curSelect = (
    <span>
      <Select
        width="50%"
        onChange={onChange}
        defaultValue={version}
        on={
          isAmp
            ? `change:AMP.navigateTo(url='${href}', target=_top)`
            : undefined
        }
        small
      >
        <option selected disabled>
          Platform Version
        </option>
        <option value="v2">2.0 (Latest)</option>
        <option value="v1">1.0</option>
      </Select>

      <style jsx>{`
        span {
          display: block;
        }

        span :global(.select) {
          color: var(--accents-5);
        }

        span :global(.select .arrow > svg) {
          stroke: var(--accents-5);
        }
      `}</style>
    </span>
  )
  if (!isAmp) return curSelect
  // have to wrap it in a form to use `autoComplete="off"`
  return (
    <form action="/" method="GET" autoComplete="off" target="_top">
      {curSelect}
    </form>
  )
}

export default VersionSwitcher
