import TypingHeading from '@/components/uis/TypingHeading';

export default function HomeHeadline({
  firstLine,
  secondLine,
}: {
  firstLine: string;
  secondLine: string;
}) {
  return (
    <TypingHeading id="home-title" className="home-title">
      {firstLine}
      <br />
      <span className="text-muted-foreground">{secondLine}</span>
    </TypingHeading>
  );
}
