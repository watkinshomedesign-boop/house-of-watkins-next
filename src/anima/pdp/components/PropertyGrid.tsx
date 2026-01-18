import { PropertyImage } from "@/components/PropertyImage";
import { PropertyInfo } from "@/components/PropertyInfo";
import { PropertyCard } from "@/components/PropertyCard";

export const PropertyGrid = () => {
  return (
    <div className="static box-content caret-black gap-x-[normal] block grid-cols-none min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:grid md:grid-cols-[repeat(3,1fr)] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <PropertyCard
        propertyImageComponent={<PropertyImage />}
        propertyInfoComponent={<PropertyInfo />}
      />
      <PropertyCard
        showPropertyDetails={true}
        imageVariant="bg-none bg-repeat bg-auto md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/df7bd524cbc1dddc5c304d0832e1b9b4eef78a1c.png?v=1766333665441')] md:bg-no-repeat md:bg-cover md:h-[238.208px] md:bg-center md:rounded-[28.416px]"
        title="Lakeside Villa"
        squareFeet="2,250 Sq Ft"
        price="$ 2350"
        bedrooms="5 Bed"
        bathrooms="3 Bath"
        garages="2 Garage"
        stories="2 Story"
      />
      <PropertyCard
        showPropertyDetails={true}
        imageVariant="bg-none bg-repeat bg-auto md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/46a8c2a4c81235676f9ca29ce371e3cb115b3adf.png?v=1766333665441')] md:bg-no-repeat md:bg-cover md:bg-center md:rounded-[28.416px]"
        title="Urban Loft"
        squareFeet="980 Sq Ft"
        price="$ 1120"
        bedrooms="2 Bed"
        bathrooms="1 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <PropertyCard
        showPropertyDetails={true}
        imageVariant="bg-none bg-repeat bg-auto md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/365565a5fea31bd5d707e85c89c8d999416d7b60.png?v=1766333665441')] md:bg-no-repeat md:bg-cover md:h-[238.208px] md:bg-center md:rounded-[28.416px]"
        title="Suburban Oasis"
        squareFeet="1,850 Sq Ft"
        price="$ 1875"
        bedrooms="4 Bed"
        bathrooms="2 Bath"
        garages="2 Garage"
        stories="1 Story"
      />
      <PropertyCard
        showPropertyDetails={true}
        imageVariant="bg-none bg-repeat bg-auto md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/2531b58346534205a30019ca6d7eb9e353020c6b.png?v=1766333665441')] md:bg-no-repeat md:bg-cover md:h-[238.208px] md:bg-center md:rounded-[28.416px]"
        title="Coastal Cottage"
        squareFeet="1,320 Sq Ft"
        price="$ 1690"
        bedrooms="3 Bed"
        bathrooms="2 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <PropertyCard
        imageVariant="bg-none bg-repeat bg-auto md:bg-[url('https://bxuvqsowxvmjanzzlbxd.supabase.co/storage/v1/object/public/make-e1b5930c-houses/f61d2bed0d86c268fa022476cee122ca004f30f6.png?v=1766333665441')] md:bg-no-repeat md:bg-cover md:h-[238.208px] md:bg-center md:rounded-[28.416px]"
        title="Modern Townhouse"
        squareFeet="1,560 Sq Ft"
        price="$ 1780"
        bedrooms="3 Bed"
        bathrooms="2 Bath"
        garages="1 Garage"
        stories="2 Story"
        showPropertyDetails={true}
      />
    </div>
  );
};
