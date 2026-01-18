import type { StructureBuilder } from "sanity/desk";
import PreviewPane from "./preview/PreviewPane";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem().title("Home").child(
                S.document()
                  .schemaType("homePage")
                  .documentId("homePage")
                  .views([S.view.form(), S.view.component(PreviewPane).title("Preview").options({ path: "/" })]),
              ),
              S.listItem().title("About").child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
                  .views([S.view.form(), S.view.component(PreviewPane).title("Preview").options({ path: "/about" })]),
              ),
              S.listItem()
                .title("Portfolio Index")
                .child(
                  S.document()
                    .schemaType("portfolioIndexPage")
                    .documentId("portfolioIndexPage")
                    .views([S.view.form(), S.view.component(PreviewPane).title("Preview").options({ path: "/portfolio" })]),
                ),
              S.listItem()
                .title("House Plans")
                .child(
                  S.list()
                    .title("House Plans")
                    .items([
                      S.listItem().title("House Plans Page").child(
                        S.document()
                          .schemaType("housePlansPage")
                          .documentId("housePlansPage")
                          .views([
                            S.view.form(),
                            S.view.component(PreviewPane).title("Preview").options({ path: "/house-plans" }),
                          ]),
                      ),
                      S.listItem().title("Plan Media").child(S.documentTypeList("planMedia").title("Plan Media")),
                    ]),
                ),
              S.listItem().title("FAQ").child(
                S.document()
                  .schemaType("faqPage")
                  .documentId("faqPage")
                  .views([S.view.form(), S.view.component(PreviewPane).title("Preview").options({ path: "/faq" })]),
              ),
              S.listItem()
                .title("What's Included")
                .child(S.document().schemaType("whatsIncludedPage").documentId("whatsIncludedPage")),
              S.listItem()
                .title("Contractors")
                .child(S.document().schemaType("contractorsPage").documentId("contractorsPage")),
              S.listItem().title("Contact").child(
                S.document()
                  .schemaType("contactPage")
                  .documentId("contactPage")
                  .views([S.view.form(), S.view.component(PreviewPane).title("Preview").options({ path: "/contact-us" })]),
              ),

              S.divider(),

              S.listItem()
                .title("Legacy pages")
                .child(
                  S.list()
                    .title("Legacy pages")
                    .items([
                      S.listItem()
                        .title("Published")
                        .child(
                          S.documentList()
                            .title("Published pages")
                            .schemaType("sitePage")
                            .filter('_type == "sitePage" && status == "published"')
                            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                        ),
                      S.listItem()
                        .title("Drafts")
                        .child(
                          S.documentList()
                            .title("Draft pages")
                            .schemaType("sitePage")
                            .filter('_type == "sitePage" && status == "draft"')
                            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                        ),
                      S.divider(),
                      S.documentTypeListItem("sitePage").title("All pages"),
                    ]),
                ),
            ]),
        ),

      S.listItem().title("Redirects").child(S.documentTypeList("redirect").title("Redirects")),

      S.listItem()
        .title("Site settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      S.listItem().title("Blog posts").child(S.documentTypeList("post").title("Blog posts")),
      S.listItem()
        .title("Portfolio projects")
        .child(
          S.list()
            .title("Portfolio projects")
            .items([
              S.listItem()
                .title("High Desert Contemporary")
                .child(
                  S.document().schemaType("portfolioProject").documentId("portfolioProject.high-desert-contemporary"),
                ),
              S.listItem()
                .title("Transitional Farmhouse")
                .child(
                  S.document().schemaType("portfolioProject").documentId("portfolioProject.transitional-farmhouse"),
                ),
              S.listItem()
                .title("Farmhouse")
                .child(S.document().schemaType("portfolioProject").documentId("portfolioProject.farmhouse")),
              S.listItem()
                .title("Narrow Lot with Casita")
                .child(
                  S.document().schemaType("portfolioProject").documentId("portfolioProject.narrow-lot-with-casita"),
                ),
              S.listItem()
                .title("Contemporary Home")
                .child(
                  S.document().schemaType("portfolioProject").documentId("portfolioProject.contemporary-home"),
                ),
              S.listItem()
                .title("Modern Home")
                .child(S.document().schemaType("portfolioProject").documentId("portfolioProject.modern-home")),
              S.listItem()
                .title("Classic Ranch")
                .child(S.document().schemaType("portfolioProject").documentId("portfolioProject.classic-ranch")),
              S.divider(),
              S.listItem()
                .title("All portfolio projects (legacy)")
                .child(S.documentTypeList("portfolioProject").title("Portfolio projects")),
            ]),
        ),
      S.listItem().title("Plan Media").child(S.documentTypeList("planMedia").title("Plan Media")),
    ]);
