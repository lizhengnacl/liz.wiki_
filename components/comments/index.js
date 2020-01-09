import dynamic from 'next/dynamic';

export const DynamicComponentWithNoSSR = dynamic(
  () => import('./comments'),
  {ssr: false},
);

export default DynamicComponentWithNoSSR;
