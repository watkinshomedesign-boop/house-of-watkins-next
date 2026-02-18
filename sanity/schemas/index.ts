import { post } from "./post";
import { portfolioProject } from "./portfolioProject";
import { siteSettings } from "./siteSettings";
import { sitePage } from "./sitePage";
import { redirect } from "./redirect";

import { imageBlock, pageSection, videoBlock } from "./blocks";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { portfolioIndexPage, portfolioMosaicTile } from "./portfolioIndexPage";
import { faqPage } from "./faqPage";
import { whatsIncludedPage } from "./whatsIncludedPage";
import { contractorsPage } from "./contractorsPage";
import { contactPage } from "./contactPage";
import { housePlansPage } from "./housePlansPage";
import { planMedia } from "./planMedia";
import { builderLandingPage } from "./builderLandingPage";

export const schemaTypes = [
  imageBlock,
  videoBlock,
  pageSection,
  homePage,
  aboutPage,
  housePlansPage,
  portfolioMosaicTile,
  portfolioIndexPage,
  faqPage,
  whatsIncludedPage,
  contractorsPage,
  contactPage,
  post,
  portfolioProject,
  planMedia,
  siteSettings,
  sitePage,
  redirect,
  builderLandingPage,
];
