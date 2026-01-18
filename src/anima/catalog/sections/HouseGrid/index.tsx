import { HouseCard } from "@/sections/HouseGrid/components/HouseCard";

export const HouseGrid = () => {
  return (
    <div className="relative text-[15.2625px] box-border caret-transparent gap-x-[22.875px] grid grid-cols-[repeat(1,1fr)] leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] gap-y-[22.875px] w-full overflow-hidden md:text-[14.208px] md:gap-x-[17.792px] md:grid-cols-[repeat(2,1fr)] md:leading-[21.312px] md:gap-y-[17.792px] md:overflow-visible">
      <HouseCard
        imageVariant="md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/0d7da24ac0bafe7483e1f21855c531a9e32c00c5.png?v=1766325957723')]"
        title="Mountain Retreat"
        squareFeet="1,440 Sq Ft"
        price="$ 1456"
        bedrooms="4 Bed"
        bathrooms="2 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <HouseCard
        imageVariant="md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/df7bd524cbc1dddc5c304d0832e1b9b4eef78a1c.png?v=1766325957723')]"
        title="Lakeside Villa"
        squareFeet="2,250 Sq Ft"
        price="$ 2350"
        bedrooms="5 Bed"
        bathrooms="3 Bath"
        garages="2 Garage"
        stories="2 Story"
      />
      <HouseCard
        imageVariant="md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/46a8c2a4c81235676f9ca29ce371e3cb115b3adf.png?v=1766325957723')]"
        title="Urban Loft"
        squareFeet="980 Sq Ft"
        price="$ 1120"
        bedrooms="2 Bed"
        bathrooms="1 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <HouseCard
        imageVariant="md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/365565a5fea31bd5d707e85c89c8d999416d7b60.png?v=1766325957723')]"
        title="Suburban Oasis"
        squareFeet="1,850 Sq Ft"
        price="$ 1875"
        bedrooms="4 Bed"
        bathrooms="2 Bath"
        garages="2 Garage"
        stories="1 Story"
      />
      <HouseCard
        imageVariant="md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/2531b58346534205a30019ca6d7eb9e353020c6b.png?v=1766325957723')]"
        title="Coastal Cottage"
        squareFeet="1,320 Sq Ft"
        price="$ 1690"
        bedrooms="3 Bed"
        bathrooms="2 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <HouseCard
        imageVariant="md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/f61d2bed0d86c268fa022476cee122ca004f30f6.png?v=1766325957723')]"
        title="Modern Townhouse"
        squareFeet="1,560 Sq Ft"
        price="$ 1780"
        bedrooms="3 Bed"
        bathrooms="2 Bath"
        garages="1 Garage"
        stories="2 Story"
      />
    </div>
  );
};
