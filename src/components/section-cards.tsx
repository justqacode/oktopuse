import { DashCard } from './dashboard-card';

export function SectionCards() {
  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <DashCard
        cardDescription='Unit'
        cardMainContent='12B'
        footerTop='Marple Apt.'
        footerBottom='12 Mario Street, Invict drive.'
      />
      <DashCard
        cardDescription='Lease End'
        cardMainContent='31st'
        footerTop='December'
        footerBottom='2025'
      />
      <DashCard cardDescription='Montly rent' cardMainContent='$1,200' />
    </div>
  );
}
