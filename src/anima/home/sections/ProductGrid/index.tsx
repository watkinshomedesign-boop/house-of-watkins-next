import { ProductCard } from "@/sections/ProductGrid/components/ProductCard";

export const ProductGrid = () => {
  return (
    <div className="static box-content caret-black gap-x-[normal] block grid-cols-none min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:grid md:grid-cols-[repeat(3,1fr)] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <ProductCard
        imageVariant="bg-[url('https://c.animaapp.com/mi4ourt2lDMZ7U/assets/7.png')]"
        title="Mountain Retreat"
        squareFeet="1,440 Sq Ft"
        price="$ 1456"
        bedrooms="4 Bed"
        bathrooms="2 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <ProductCard
        imageVariant="md:bg-[url('https://c.animaapp.com/mi4ourt2lDMZ7U/assets/4.png')]"
        title="Lakeside Villa"
        squareFeet="2,250 Sq Ft"
        price="$ 2350"
        bedrooms="5 Bed"
        bathrooms="3 Bath"
        garages="2 Garage"
        stories="2 Story"
      />
      <ProductCard
        imageVariant="md:bg-[url('https://c.animaapp.com/mi4ourt2lDMZ7U/assets/3.png')]"
        title="Urban Loft"
        squareFeet="980 Sq Ft"
        price="$ 1120"
        bedrooms="2 Bed"
        bathrooms="1 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <ProductCard
        imageVariant="bg-[url('https://c.animaapp.com/mi4ourt2lDMZ7U/assets/8.png')]"
        title="Suburban Oasis"
        squareFeet="1,850 Sq Ft"
        price="$ 1875"
        bedrooms="4 Bed"
        bathrooms="2 Bath"
        garages="2 Garage"
        stories="1 Story"
      />
      <ProductCard
        imageVariant="md:bg-[url('https://c.animaapp.com/mi4ourt2lDMZ7U/assets/6.png')]"
        title="Coastal Cottage"
        squareFeet="1,320 Sq Ft"
        price="$ 1690"
        bedrooms="3 Bed"
        bathrooms="2 Bath"
        garages="1 Garage"
        stories="1 Story"
      />
      <ProductCard
        imageVariant="md:bg-[url('https://c.animaapp.com/mi4ourt2lDMZ7U/assets/5.png')]"
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
