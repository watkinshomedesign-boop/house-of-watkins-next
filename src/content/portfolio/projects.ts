import type { PortfolioProject } from "@/lib/portfolio/types";

export const projects: PortfolioProject[] = [
  {
    title: "High Desert Contemporary",
    slug: "3-bedroom-contemporary-house-plan-with-ofice-and-casita-and-3-car-garage-portfolio-images",
    status: "published",
    order: 1,
    coverImage: {
      image: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-image-of-front-v1.jpg",
      alt: "High Desert Contemporary exterior",
    },
    gallery: [
      { image: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-livingroom.jpg", alt: "Living room" },
      { image: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-kitchen-view-1.jpg", alt: "Kitchen" },
      { image: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-bedroom-1-v1.jpg", alt: "Bedroom" },
      { image: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-laundry-room.jpg", alt: "Laundry" },
      { image: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-bedroom-two-view-1.jpg", alt: "Bedroom 2" },
      { image: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-kitchen-view-2.jpg", alt: "Kitchen 2" },
    ],
    planDetailsUrl: "/catalog/high-desert",
    oldSlugs: ["high-desert-contemporary", "pinecrest-modern", "pinecrest"],
  },
  {
    title: "Transitional Farmhouse",
    slug: "4-bedroom-contemporary-house-plan-with-office-loft-and-3-car-side-load-garage-portfolio-images",
    status: "published",
    order: 2,
    coverImage: { image: "/plans/Desert%20Rain/gallery/01.jpg", alt: "Desert Rain exterior" },
    gallery: [
      { image: "/plans/Desert%20Rain/gallery/01.jpg", alt: "Exterior" },
      { image: "/plans/Desert%20Rain/gallery/02.jpg", alt: "Courtyard" },
      { image: "/plans/Desert%20Rain/gallery/03.jpg", alt: "Living" },
      { image: "/plans/Desert%20Rain/gallery/04.jpg", alt: "Kitchen" },
      { image: "/plans/Desert%20Rain/gallery/05.jpg", alt: "Sunset" },
      { image: "/plans/Desert%20Rain/gallery/06.jpg", alt: "Pool" },
    ],
    oldSlugs: ["transitional-farmhouse", "desert-rain"],
  },
  {
    title: "Farmhouse",
    slug: "4-bedroom-3-bath-2-story-contemporary-farmhouse-house-plan-with-loft-with-office-with-4-car-garage-portfolio-images",
    status: "published",
    order: 3,
    coverImage: { image: "/plans/Boardwalk%204-%20Car/gallery/01.jpg", alt: "Boardwalk exterior" },
    gallery: [
      { image: "/plans/Boardwalk%204-%20Car/gallery/01.jpg", alt: "Exterior" },
      { image: "/plans/Boardwalk%204-%20Car/gallery/02.jpg", alt: "Exterior alternate" },
      { image: "/plans/Boardwalk%204-%20Car/gallery/03.jpg", alt: "Living" },
      { image: "/plans/Boardwalk%204-%20Car/gallery/04.jpg", alt: "Kitchen" },
    ],
    planDetailsUrl: "/catalog/boardwalk-4-car",
    oldSlugs: ["farmhouse", "boardwalk"],
  },
  {
    title: "Narrow Lot with Casita",
    slug: "3-bedroom-contemporary-house-plan-with-side-entrance-portfolio-images",
    status: "published",
    order: 4,
    coverImage: { image: "/plans/Mountain%20Retreat/gallery/01.jpg", alt: "Mountain Retreat exterior" },
    gallery: [
      { image: "/plans/Mountain%20Retreat/gallery/01.jpg", alt: "Exterior" },
      { image: "/plans/Mountain%20Retreat/gallery/02.jpg", alt: "Entry" },
      { image: "/plans/Mountain%20Retreat/gallery/03.jpg", alt: "Kitchen" },
      { image: "/plans/Mountain%20Retreat/gallery/04.jpg", alt: "Great room" },
      { image: "/plans/Mountain%20Retreat/gallery/05.jpg", alt: "Deck" },
      { image: "/plans/Mountain%20Retreat/gallery/06.jpg", alt: "Night exterior" },
    ],
    oldSlugs: ["narrow-lot-with-casita", "mountain-retreat"],
  },
  {
    title: "Contemporary Home",
    slug: "contemporary-2-story-4-bedroom-with-office-and-loft-house-plan-with-3-car-garage-portfolio-images",
    status: "published",
    order: 5,
    coverImage: { image: "/plans/Classic%20Midcentury/gallery/01.jpg", alt: "Classic Midcentury exterior" },
    gallery: [
      { image: "/plans/Classic%20Midcentury/gallery/01.jpg", alt: "Exterior" },
      { image: "/plans/Classic%20Midcentury/gallery/02.jpg", alt: "Living" },
      { image: "/plans/Classic%20Midcentury/gallery/03.jpg", alt: "Kitchen" },
      { image: "/plans/Classic%20Midcentury/gallery/04.jpg", alt: "Bedroom" },
    ],
    oldSlugs: ["contemporary-home", "classic-midcentury", "midcentury"],
  },
  {
    title: "Modern Home",
    slug: "3-bedroom-3-bath-modern-house-plan-with-3-car-garage-portfolio-images",
    status: "published",
    order: 6,
    coverImage: { image: "/plans/The%20Metropolitan/gallery/01.jpg", alt: "The Metropolitan exterior" },
    gallery: [
      { image: "/plans/The%20Metropolitan/gallery/01.jpg", alt: "Exterior" },
      { image: "/plans/The%20Metropolitan/gallery/02.jpg", alt: "Exterior detail" },
      { image: "/plans/The%20Metropolitan/gallery/03.jpg", alt: "Kitchen" },
      { image: "/plans/The%20Metropolitan/gallery/04.jpg", alt: "Living" },
      { image: "/plans/The%20Metropolitan/gallery/05.jpg", alt: "Bedroom" },
    ],
    planDetailsUrl: "/catalog/the-metropolitan",
    oldSlugs: ["modern-home", "the-metropolitan"],
  },
  {
    title: "Classic Ranch",
    slug: "3-bedroom-3-bath-1-story-house-plan-with-office-with-3-car-garage-portfolio-images",
    status: "published",
    order: 7,
    coverImage: { image: "/plans/Oak%20Ridge%20Side%20Garage/gallery/01.jpg", alt: "Oak Ridge exterior" },
    gallery: [
      { image: "/plans/Oak%20Ridge%20Side%20Garage/gallery/01.jpg", alt: "Exterior" },
      { image: "/plans/Oak%20Ridge%20Side%20Garage/gallery/02.jpg", alt: "Exterior angle" },
      { image: "/plans/Oak%20Ridge%20Side%20Garage/gallery/03.jpg", alt: "Kitchen" },
      { image: "/plans/Oak%20Ridge%20Side%20Garage/gallery/04.jpg", alt: "Living" },
    ],
    oldSlugs: ["classic-ranch", "oak-ridge"],
  },
  {
    title: "2-Bed ADU",
    slug: "2-bed-adu",
    status: "published",
    order: 8,
    coverImage: { image: "/plans/2-bed-adu/gallery/01.jpg", alt: "2-Bed ADU exterior" },
    gallery: [
      { image: "/plans/2-bed-adu/gallery/01.jpg", alt: "Exterior" },
      { image: "/plans/2-bed-adu/gallery/02.jpg", alt: "Interior" },
      { image: "/plans/2-bed-adu/gallery/03.jpg", alt: "Kitchen" },
      { image: "/plans/2-bed-adu/gallery/04.jpg", alt: "Bedroom" },
    ],
    planDetailsUrl: "/catalog/2-bed-adu",
  },
];

export function getAllProjects(): PortfolioProject[] {
  return [...projects]
    .filter((p) => p.status === "published")
    .sort((a, b) => {
      const ao = typeof a.order === "number" ? a.order : 9999;
      const bo = typeof b.order === "number" ? b.order : 9999;
      return ao - bo;
    });
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((p) => p.slug === slug || (p.oldSlugs ?? []).includes(slug));
}
