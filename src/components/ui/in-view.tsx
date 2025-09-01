import { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
interface Props {
  children?: ReactNode;
}
function LazyLoadedVideo({ children }: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  return <div ref={ref}>{inView && children}</div>;
}

export default LazyLoadedVideo;
