type Props = {
  children: React.ReactNode;
};

export function Theme({ children }: Props) {
  const root = window.document.documentElement;
  root.classList.add("dark");

  return <>{children}</>;
}
