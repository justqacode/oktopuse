import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ReactNode } from 'react';

type CardTypes = {
  cardDescription: string;
  cardMainContent: string | number;
  topright?: ReactNode;
  footerTop?: ReactNode;
  footerBottom?: ReactNode;
};

export const DashCard = ({
  topright,
  cardDescription,
  cardMainContent,
  footerTop,
  footerBottom,
}: CardTypes) => {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardDescription>{cardDescription}</CardDescription>
        {footerTop || footerBottom ? (
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {cardMainContent}
          </CardTitle>
        ) : (
          <CardTitle className='pt-8 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {cardMainContent}
          </CardTitle>
        )}
        {topright && (
          <CardAction>
            <Badge variant='outline'>{topright}</Badge>
          </CardAction>
        )}
      </CardHeader>

      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        {footerTop && <div className='line-clamp-1 flex gap-2 font-medium'>{footerTop}</div>}
        {footerBottom && <div className='text-muted-foreground'>{footerBottom}</div>}
      </CardFooter>
    </Card>
  );
};

// Reference

{
  /* <Card className='@container/card'>
  <CardHeader>
    <CardDescription>Active Accounts</CardDescription>
    <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
      45,678
    </CardTitle>
    <CardAction>
      <Badge variant='outline'>
        <IconTrendingUp />
        +12.5%
      </Badge>
    </CardAction>
  </CardHeader>
  <CardFooter className='flex-col items-start gap-1.5 text-sm'>
    <div className='line-clamp-1 flex gap-2 font-medium'>
      Strong user retention <IconTrendingUp className='size-4' />
    </div>
    <div className='text-muted-foreground'>Engagement exceed targets</div>
  </CardFooter>
</Card>; */
}
