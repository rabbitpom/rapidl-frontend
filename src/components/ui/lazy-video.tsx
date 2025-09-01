import { useInView } from "react-intersection-observer";
interface Props {
  src: string;
}
function LazyLoadedVideo({ src }: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  return (
    <div ref={ref}>
      {inView && <video src={src} autoPlay muted loop controls={false}></video>}
    </div>
  );
}

export default LazyLoadedVideo;
