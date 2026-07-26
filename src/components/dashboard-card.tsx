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
  bgClass?: string;
};

export const DashCard = ({
  topright,
  cardDescription,
  cardMainContent,
  footerTop,
  footerBottom,
  bgClass,
}: CardTypes) => {
  return (
    <Card className={'@container/card border border-border/70 hover:border-primary/30 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-card text-card-foreground ' + (bgClass ? ' ' + bgClass : '')}>
      <CardHeader className='pb-3'>
        <CardDescription className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>{cardDescription}</CardDescription>
        {footerTop || footerBottom ? (
          <CardTitle className='text-2xl font-extrabold tracking-tight tabular-nums @[250px]/card:text-3xl text-foreground mt-1'>
            {cardMainContent}
          </CardTitle>
        ) : (
          <CardTitle className='pt-6 text-2xl font-extrabold tracking-tight tabular-nums @[250px]/card:text-3xl text-foreground mt-1'>
            {cardMainContent}
          </CardTitle>
        )}
        {topright && (
          <CardAction>
            <Badge variant='secondary' className='text-[10px] font-bold px-2 py-0.5 rounded-full'>{topright}</Badge>
          </CardAction>
        )}
      </CardHeader>

      {(footerTop || footerBottom) && (
        <CardFooter className='flex-col items-start gap-1 pt-0 text-xs border-t border-border/40 mt-3 pt-3'>
          {footerTop && <div className='line-clamp-1 flex gap-1.5 font-medium text-foreground'>{footerTop}</div>}
          {footerBottom && <div className='text-muted-foreground/80'>{footerBottom}</div>}
        </CardFooter>
      )}
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
