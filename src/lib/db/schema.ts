import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hero section content (enhanced with video/image support like ubrand.sa)
export const heroContent = pgTable("hero_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: text("title_nl").notNull(),
  titleEn: text("title_en").notNull(),
  subtitleNl: text("subtitle_nl").notNull(),
  subtitleEn: text("subtitle_en").notNull(),
  primaryCtaNl: varchar("primary_cta_nl").notNull(),
  primaryCtaEn: varchar("primary_cta_en").notNull(),
  secondaryCtaNl: varchar("secondary_cta_nl").notNull(),
  secondaryCtaEn: varchar("secondary_cta_en").notNull(),
  backgroundImage: varchar("background_image"),
  videoUrl: varchar("video_url"),
  videoType: varchar("video_type").default("upload"), // "upload" or "youtube"
  mediaType: varchar("media_type").default("image"), // "image" or "video"
  overlayOpacity: integer("overlay_opacity").default(50), // 0-100
  textAlign: varchar("text_align").default("center"), // "left", "center", "right"
  displayStyle: varchar("display_style").default("overlay"), // "overlay", "split", "fullscreen", "minimal"
  headerOverlay: boolean("header_overlay").default(true), // Show header over hero
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Statistics (bilingual)
export const statistics = pgTable("statistics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labelNl: varchar("label_nl").notNull(),
  labelEn: varchar("label_en").notNull(),
  value: varchar("value").notNull(),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// About section content (bilingual)
export const aboutContent = pgTable("about_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: text("title_nl").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionNl: text("description_nl").notNull(),
  descriptionEn: text("description_en").notNull(),
  image: varchar("image"),
  featuresNl: jsonb("features_nl"), // Array of {title, description}
  featuresEn: jsonb("features_en"), // Array of {title, description}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services (bilingual)
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: varchar("title_nl").notNull(),
  titleEn: varchar("title_en").notNull(),
  descriptionNl: text("description_nl").notNull(),
  descriptionEn: text("description_en").notNull(),
  icon: varchar("icon"), // Icon name or SVG path
  image: varchar("image"),
  slugNl: varchar("slug_nl"),
  slugEn: varchar("slug_en"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects (bilingual)
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: varchar("title_nl").notNull(),
  titleEn: varchar("title_en").notNull(),
  descriptionNl: text("description_nl").notNull(),
  descriptionEn: text("description_en").notNull(),
  categoryNl: varchar("category_nl").notNull(), // residential, commercial, infrastructure
  categoryEn: varchar("category_en").notNull(),
  location: varchar("location"),
  year: varchar("year"),
  image: varchar("image"),
  gallery: jsonb("gallery"), // Array of image URLs with metadata
  featuredImage: varchar("featured_image"), // URL of the featured image from gallery
  status: varchar("status").default("completed"), // completed, in-progress, planned
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog articles (bilingual)
export const blogArticles = pgTable("blog_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: varchar("title_nl").notNull(),
  titleEn: varchar("title_en").notNull(),
  excerptNl: text("excerpt_nl"),
  excerptEn: text("excerpt_en"),
  contentNl: text("content_nl").notNull(),
  contentEn: text("content_en").notNull(),
  categoryNl: varchar("category_nl"),
  categoryEn: varchar("category_en"),
  
  // Enhanced SEO Fields
  metaDescriptionNl: text("meta_description_nl"), // SEO meta description
  metaDescriptionEn: text("meta_description_en"),
  keywordsNl: text("keywords_nl"), // SEO keywords
  keywordsEn: text("keywords_en"),
  
  // Image handling
  image: varchar("image"), // Featured image URL
  imageAlt: varchar("image_alt"), // Alt text for accessibility
  ogImage: varchar("og_image"), // Open Graph specific image
  
  // URL handling  
  slugNl: varchar("slug_nl").notNull(),
  slugEn: varchar("slug_en").notNull(),
  canonicalUrl: varchar("canonical_url"), // Canonical URL for SEO
  
  // Tags and categorization
  tagsNl: text("tags_nl").array(), // Array of tags in Dutch
  tagsEn: text("tags_en").array(), // Array of tags in English
  
  // Content flags
  isFeatured: boolean("is_featured").default(false), // Featured articles
  isPublished: boolean("is_published").default(false),
  
  // Social media optimization
  twitterCard: varchar("twitter_card").default("summary_large_image"), // Twitter card type
  ogType: varchar("og_type").default("article"), // Open Graph type
  
  // Author and timestamps
  authorId: varchar("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  readingTime: integer("reading_time"), // Estimated reading time in minutes
  viewCount: integer("view_count").default(0), // View counter
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners (bilingual)
export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  descriptionNl: text("description_nl"),
  descriptionEn: text("description_en"),
  logo: varchar("logo"),
  categoryNl: varchar("category_nl"),
  categoryEn: varchar("category_en"),
  website: varchar("website"),
  since: varchar("since"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners Settings - إعدادات قسم الشركاء
export const partnersSettings = pgTable("partners_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Section texts (bilingual)
  titleNl: varchar("title_nl").default("Onze Partners"),
  titleEn: varchar("title_en").default("Our Partners"),
  descriptionNl: text("description_nl").default("Samen bouwen we een betere toekomst. We werken samen met betrouwbare partners om de beste service en kwaliteit te bieden. Ontdek de bedrijven waar we mee samenwerken voor innovatieve bouwoplossingen."),
  descriptionEn: text("description_en").default("Together we build a better future. We work together with reliable partners to offer the best service and quality. Discover the companies we collaborate with for innovative building solutions."),
  
  // CTA section
  ctaTitleNl: varchar("cta_title_nl").default("Geïnteresseerd in samenwerking?"),
  ctaTitleEn: varchar("cta_title_en").default("Interested in collaboration?"),
  ctaDescriptionNl: text("cta_description_nl").default("Ontdek hoe we samen kunnen groeien en succesvol kunnen zijn in de bouwsector."),
  ctaDescriptionEn: text("cta_description_en").default("Discover how we can grow together and be successful in the construction sector."),
  ctaButtonTextNl: varchar("cta_button_text_nl").default("Neem Contact Op"),
  ctaButtonTextEn: varchar("cta_button_text_en").default("Contact Us"),
  
  // Display settings
  displayStyle: varchar("display_style").default("grid"), // grid, list, carousel, minimal
  itemsPerRow: integer("items_per_row").default(4), // 2, 3, 4, 5, 6
  showLogos: boolean("show_logos").default(true),
  showCategories: boolean("show_categories").default(true),
  showSince: boolean("show_since").default(true),
  showCta: boolean("show_cta").default(true),
  
  // Layout options
  backgroundStyle: varchar("background_style").default("muted"), // muted, white, primary, gradient
  cardStyle: varchar("card_style").default("default"), // default, minimal, elevated, bordered
  
  // SEO settings
  metaTitleNl: varchar("meta_title_nl").default("Onze Partners | BuildIt Professional"),
  metaTitleEn: varchar("meta_title_en").default("Our Partners | BuildIt Professional"),
  metaDescriptionNl: text("meta_description_nl").default("Ontdek onze betrouwbare partners die met ons samenwerken om excellente bouwdiensten te leveren."),
  metaDescriptionEn: text("meta_description_en").default("Discover our trusted partners who work with us to deliver excellent construction services."),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Settings - إعدادات قسم المدونة
export const blogSettings = pgTable("blog_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Section texts (bilingual)
  titleNl: varchar("title_nl").default("Laatste Inzichten"),
  titleEn: varchar("title_en").default("Latest Insights"),
  descriptionNl: text("description_nl").default("Blijf op de hoogte van de laatste ontwikkelingen in de bouwsector"),
  descriptionEn: text("description_en").default("Stay updated with the latest developments in the construction sector"),
  
  // Button text
  readMoreTextNl: varchar("read_more_text_nl").default("Lees Meer"),
  readMoreTextEn: varchar("read_more_text_en").default("Read More"),
  allArticlesButtonNl: varchar("all_articles_button_nl").default("Alle Artikelen"),
  allArticlesButtonEn: varchar("all_articles_button_en").default("All Articles"),
  
  // Display settings
  articlesPerRow: integer("articles_per_row").default(3), // 2, 3, 4
  maxArticles: integer("max_articles").default(3), // Max articles to show on homepage
  showDate: boolean("show_date").default(true),
  showCategory: boolean("show_category").default(true),
  showExcerpt: boolean("show_excerpt").default(true),
  showReadMore: boolean("show_read_more").default(true),
  showAllArticlesButton: boolean("show_all_articles_button").default(true),
  
  // Layout options
  backgroundStyle: varchar("background_style").default("white"), // white, muted, primary, gradient
  cardStyle: varchar("card_style").default("default"), // default, minimal, elevated, bordered
  
  // SEO settings
  metaTitleNl: varchar("meta_title_nl").default("Blog | BuildIt Professional"),
  metaTitleEn: varchar("meta_title_en").default("Blog | BuildIt Professional"),
  metaDescriptionNl: text("meta_description_nl").default("Lees de laatste artikelen en inzichten over bouw, renovatie en duurzaamheid."),
  metaDescriptionEn: text("meta_description_en").default("Read the latest articles and insights about construction, renovation and sustainability."),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company Initiatives - مبادرات الشركة (simplified replacement for maatschappelijke)
export const companyInitiatives = pgTable("company_initiatives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: text("title_nl").notNull(),
  titleEn: text("title_en"),
  descriptionNl: text("description_nl").notNull(),
  descriptionEn: text("description_en"),
  icon: varchar("icon"), // Lucide icon name
  image: varchar("image"), // Optional image URL
  category: varchar("category").default("community"), // community, environment, social, innovation
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company Initiatives Settings - إعدادات ديناميكية للنص والأزرار
export const companyInitiativesSettings = pgTable("company_initiatives_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Hero section
  titleNl: text("title_nl").notNull().default("Maatschappelijke Verantwoordelijkheid"),
  titleEn: text("title_en").notNull().default("Corporate Responsibility"),
  descriptionNl: text("description_nl").notNull().default("Samen kunnen we een duurzamere en verantwoordelijke toekomst bouwen. Ontdek hoe jij onderdeel kunt zijn van onze maatschappelijke impact initiatieven."),
  descriptionEn: text("description_en").notNull().default("Together we can build a more sustainable and responsible future. Discover how you can be part of our social impact initiatives."),
  heroButtonTextNl: varchar("hero_button_text_nl").default("Meer Over Onze Impact"),
  heroButtonTextEn: varchar("hero_button_text_en").default("Learn More About Our Impact"),
  
  // Statistics section
  statsTitleNl: varchar("stats_title_nl").default("Onze Impact in Cijfers"),
  statsTitleEn: varchar("stats_title_en").default("Our Impact in Numbers"),
  statsDescriptionNl: text("stats_description_nl").default("Bekijk hoe we het verschil maken in gemeenschappen door heel Nederland"),
  statsDescriptionEn: text("stats_description_en").default("See how we're making a difference in communities across the Netherlands"),
  
  // Hero URLs
  heroButtonUrlNl: varchar("hero_button_url_nl").default("/contact"),
  heroButtonUrlEn: varchar("hero_button_url_en").default("/contact"),
  
  // Key initiatives section
  initiativesTitleNl: varchar("initiatives_title_nl").default("Onze Belangrijkste Initiatieven"),
  initiativesTitleEn: varchar("initiatives_title_en").default("Our Key Initiatives"),
  initiativesDescriptionNl: text("initiatives_description_nl").default("Ontdek de programma's en projecten die blijvende verandering teweegbrengen"),
  initiativesDescriptionEn: text("initiatives_description_en").default("Discover the programs and projects that are creating lasting change"),
  
  // CTA section
  ctaTitleNl: varchar("cta_title_nl").default("Klaar om het Verschil te Maken?"),
  ctaTitleEn: varchar("cta_title_en").default("Ready to Make a Difference?"),
  ctaDescriptionNl: text("cta_description_nl").default("Sluit je aan bij onze missie om duurzame gemeenschappen te bouwen en blijvende positieve impact te creëren."),
  ctaDescriptionEn: text("cta_description_en").default("Join us in our mission to build sustainable communities and create lasting positive impact."),
  ctaButtonTextNl: varchar("cta_button_text_nl").default("Doe Mee"),
  ctaButtonTextEn: varchar("cta_button_text_en").default("Get Involved"),
  ctaButtonUrlNl: varchar("cta_button_url_nl").default("/contact"),
  ctaButtonUrlEn: varchar("cta_button_url_en").default("/contact"),
  learnMoreTextNl: varchar("learn_more_text_nl").default("Meer Informatie"),
  learnMoreTextEn: varchar("learn_more_text_en").default("Learn More"),
  learnMoreUrlNl: varchar("learn_more_url_nl").default("/about"),
  learnMoreUrlEn: varchar("learn_more_url_en").default("/about"),
  
  // Display settings
  showStatistics: boolean("show_statistics").default(true),
  showInitiatives: boolean("show_initiatives").default(true),
  showCallToAction: boolean("show_call_to_action").default(true),
  maxStatsItems: integer("max_stats_items").default(4),
  maxInitiativesItems: integer("max_initiatives_items").default(3),
  
  // Page media
  heroImage: varchar("hero_image"),
  heroVideoUrl: varchar("hero_video_url"),
  heroMediaType: varchar("hero_media_type").default("image"), // image, video, gradient
  
  // SEO metadata
  metaTitleNl: varchar("meta_title_nl").default("Maatschappelijke Verantwoordelijkheid | BuildIt Professional"),
  metaTitleEn: varchar("meta_title_en").default("Corporate Responsibility | BuildIt Professional"),
  metaDescriptionNl: text("meta_description_nl").default("Ontdek onze maatschappelijke initiatieven voor duurzaamheid, gemeenschapsbetrokkenheid en sociale verantwoordelijkheid."),
  metaDescriptionEn: text("meta_description_en").default("Discover our social initiatives for sustainability, community engagement and corporate responsibility."),
  ogImage: varchar("og_image"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Maatschappelijke Statistics - إحصائيات خاصة بالمبادرات المجتمعية
export const maatschappelijkeStatistics = pgTable("maatschappelijke_statistics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labelNl: varchar("label_nl").notNull(),
  labelEn: varchar("label_en"),
  value: varchar("value").notNull(),
  description: text("description"), // وصف اختياري للإحصائية
  icon: varchar("icon"), // أيقونة للإحصائية
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Section visibility and ordering system
export const sectionSettings = pgTable("section_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectionKey: varchar("section_key").notNull().unique(), // hero, statistics, about, services, etc.
  titleNl: varchar("title_nl").notNull(),
  titleEn: varchar("title_en").notNull(),
  isVisible: boolean("is_visible").default(true),
  showInHeader: boolean("show_in_header").default(true),
  showInFooter: boolean("show_in_footer").default(true),
  order: integer("order").notNull().default(0),
  route: varchar("route"), // URL route for the section
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer testimonials/reviews (bilingual with structured data support)
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: varchar("customer_name").notNull(),
  customerTitle: varchar("customer_title"), // Job title or company
  customerImage: varchar("customer_image"), // Customer photo
  testimonialNl: text("testimonial_nl").notNull(),
  testimonialEn: text("testimonial_en").notNull(),
  rating: integer("rating").notNull().default(5), // 1-5 rating
  projectType: varchar("project_type"), // Type of project they hired for
  location: varchar("location"), // Customer location
  featured: boolean("featured").default(false), // Highlight important testimonials
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials Settings - إعدادات قسم شهادات العملاء
export const testimonialsSettings = pgTable("testimonials_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Section texts (bilingual)
  titleNl: varchar("title_nl").default("Wat Onze Klanten Zeggen"),
  titleEn: varchar("title_en").default("What Our Clients Say"),
  descriptionNl: text("description_nl").default("Ontdek wat onze tevreden klanten zeggen over onze services en kwaliteit. Hun ervaringen spreken voor zich."),
  descriptionEn: text("description_en").default("Discover what our satisfied clients say about our services and quality. Their experiences speak for themselves."),
  
  // CTA section
  ctaTitleNl: varchar("cta_title_nl").default("Tevreden over ons werk?"),
  ctaTitleEn: varchar("cta_title_en").default("Satisfied with our work?"),
  ctaDescriptionNl: text("cta_description_nl").default("Deel uw ervaring met ons en help andere klanten de juiste keuze te maken."),
  ctaDescriptionEn: text("cta_description_en").default("Share your experience with us and help other clients make the right choice."),
  ctaButtonTextNl: varchar("cta_button_text_nl").default("Deel Uw Ervaring"),
  ctaButtonTextEn: varchar("cta_button_text_en").default("Share Your Experience"),
  
  // Display settings
  displayStyle: varchar("display_style").default("grid"), // grid, list, carousel, masonry
  itemsPerRow: integer("items_per_row").default(3), // 2, 3, 4, 5
  showRatings: boolean("show_ratings").default(true),
  showCustomerImages: boolean("show_customer_images").default(true),
  showProjectType: boolean("show_project_type").default(true),
  showLocation: boolean("show_location").default(true),
  showFeaturedOnly: boolean("show_featured_only").default(false),
  showCta: boolean("show_cta").default(true),
  
  // Layout options
  backgroundStyle: varchar("background_style").default("muted"), // muted, white, primary, gradient
  cardStyle: varchar("card_style").default("default"), // default, minimal, elevated, bordered, modern
  animationStyle: varchar("animation_style").default("none"), // none, fade, slide, scale
  
  // Rating display options
  ratingStyle: varchar("rating_style").default("stars"), // stars, numbers, both
  starColor: varchar("star_color").default("yellow"), // yellow, gold, blue, custom
  
  // SEO settings
  metaTitleNl: varchar("meta_title_nl").default("Klantbeoordelingen | BuildIt Professional"),
  metaTitleEn: varchar("meta_title_en").default("Customer Reviews | BuildIt Professional"),
  metaDescriptionNl: text("meta_description_nl").default("Lees de beoordelingen van onze tevreden klanten over onze bouwservices en projecten."),
  metaDescriptionEn: text("meta_description_en").default("Read reviews from our satisfied customers about our construction services and projects."),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Contact form configuration
export const contactFormSettings = pgTable("contact_form_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldKey: varchar("field_key").notNull().unique(), // first_name, last_name, email, etc.
  labelNl: varchar("label_nl").notNull(),
  labelEn: varchar("label_en").notNull(),
  placeholder: varchar("placeholder"),
  isRequired: boolean("is_required").default(true),
  isVisible: boolean("is_visible").default(true),
  fieldType: varchar("field_type").default("text"), // text, email, tel, textarea, select
  options: jsonb("options"), // For select fields
  order: integer("order").notNull().default(0),
  validationRules: jsonb("validation_rules"), // Custom validation rules
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Contact information management
export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // address, phone, email, hours
  labelNl: varchar("label_nl").notNull(),
  labelEn: varchar("label_en").notNull(),
  value: text("value").notNull(),
  icon: varchar("icon"), // Lucide icon name
  isActive: boolean("is_active").default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Footer management
export const footerSettings = pgTable("footer_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyDescriptionNl: text("company_description_nl"),
  companyDescriptionEn: text("company_description_en"),
  copyrightText: varchar("copyright_text"),
  showSocialMedia: boolean("show_social_media").default(true),
  showNewsletter: boolean("show_newsletter").default(true),
  showServices: boolean("show_services").default(true),
  newsletterTitleNl: varchar("newsletter_title_nl"),
  newsletterTitleEn: varchar("newsletter_title_en"),
  newsletterDescriptionNl: text("newsletter_description_nl"),
  newsletterDescriptionEn: text("newsletter_description_en"),
  // Social Media Links
  facebookUrl: varchar("facebook_url"),
  twitterUrl: varchar("twitter_url"),
  linkedinUrl: varchar("linkedin_url"),
  instagramUrl: varchar("instagram_url"),
  youtubeUrl: varchar("youtube_url"),
  whatsappUrl: varchar("whatsapp_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Statistics display settings
export const statisticsSettings = pgTable("statistics_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  displayStyle: varchar("display_style").default("simple"), // simple, modern, advanced
  animationStyle: varchar("animation_style").default("none"), // none, simple, advanced
  cardStyle: varchar("card_style").default("flat"), // flat, cards, gradient
  colorScheme: varchar("color_scheme").default("default"), // default, brand, custom
  showIcons: boolean("show_icons").default(false),
  showBackground: boolean("show_background").default(false),
  enableHover: boolean("enable_hover").default(false),
  enableAnimation: boolean("enable_animation").default(false),
  animationDuration: integer("animation_duration").default(2000), // milliseconds
  sectionTitleNl: varchar("section_title_nl").default("Onze Prestaties"),
  sectionTitleEn: varchar("section_title_en").default("Our Achievements"),
  sectionSubtitleNl: text("section_subtitle_nl"),
  sectionSubtitleEn: text("section_subtitle_en"),
  customColors: jsonb("custom_colors"), // {primary: "#color", secondary: "#color"}
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company Initiatives settings are built into the simple structure above

// NEW: Social media links
export const socialMediaLinks = pgTable("social_media_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: varchar("platform").notNull(), // facebook, twitter, linkedin, instagram
  url: varchar("url").notNull(),
  icon: varchar("icon"), // Icon name or path
  isActive: boolean("is_active").default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Legal pages management
export const legalPages = pgTable("legal_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: varchar("title_nl").notNull(),
  titleEn: varchar("title_en").notNull(),
  contentNl: text("content_nl").notNull(), // HTML content
  contentEn: text("content_en").notNull(), // HTML content
  slugNl: varchar("slug_nl").notNull(),
  slugEn: varchar("slug_en").notNull(),
  pageType: varchar("page_type").notNull(), // privacy, terms, cookies
  showInFooter: boolean("show_in_footer").default(true),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team members (bilingual)
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Personal information
  nameNl: varchar("name_nl").notNull(),
  nameEn: varchar("name_en").notNull(),
  titleNl: varchar("title_nl").notNull(), // Job title
  titleEn: varchar("title_en").notNull(),
  bioNl: text("bio_nl"), // Biography/description
  bioEn: text("bio_en"),
  
  // Contact & social
  email: varchar("email"),
  phone: varchar("phone"),
  linkedinUrl: varchar("linkedin_url"),
  twitterUrl: varchar("twitter_url"),
  
  // Media
  image: varchar("image"), // Profile image
  videoIntroUrl: varchar("video_intro_url"), // Video introduction
  
  // Professional details
  department: varchar("department"), // Engineering, Management, Design, etc.
  specialties: text("specialties").array(), // Array of specialties
  experienceYears: integer("experience_years"),
  startDate: varchar("start_date"), // When they joined the company
  
  // Skills and certifications
  skills: jsonb("skills"), // {technical: [], soft: [], languages: []}
  certifications: jsonb("certifications"), // [{name, year, issuer}]
  achievements: jsonb("achievements"), // Notable accomplishments
  
  // Display settings
  showInHomepage: boolean("show_in_homepage").default(true), // Show in homepage team section
  showContactInfo: boolean("show_contact_info").default(false), // Show contact details publicly
  showBio: boolean("show_bio").default(true), // Show biography
  showVideo: boolean("show_video").default(false), // Show video introduction
  
  // Organization
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false), // Featured team members
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team Settings - إعدادات قسم الفريق
export const teamSettings = pgTable("team_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Homepage section texts (bilingual)
  homepageTitleNl: varchar("homepage_title_nl").default("Ons Team"),
  homepageTitleEn: varchar("homepage_title_en").default("Our Team"),
  homepageDescriptionNl: text("homepage_description_nl").default("Ontmoet de experts die uw dromen werkelijkheid maken. Ons toegewijde team combineert jarenlange ervaring met innovatieve benaderingen om uitzonderlijke resultaten te leveren."),
  homepageDescriptionEn: text("homepage_description_en").default("Meet the experts who make your dreams reality. Our dedicated team combines years of experience with innovative approaches to deliver exceptional results."),
  
  // Team page texts (bilingual)  
  pageTitleNl: varchar("page_title_nl").default("Ons Professionele Team"),
  pageTitleEn: varchar("page_title_en").default("Our Professional Team"),
  pageDescriptionNl: text("page_description_nl").default("Leer het getalenteerde team kennen dat de ruggengraat vormt van onze organisatie. Van ervaren projectmanagers tot gespecialiseerde vakmannen - iedereen draagt bij aan onze missie om excellente bouwprojecten op te leveren."),
  pageDescriptionEn: text("page_description_en").default("Get to know the talented team that forms the backbone of our organization. From experienced project managers to specialized craftsmen - everyone contributes to our mission of delivering excellent construction projects."),
  
  // CTA section
  ctaTitleNl: varchar("cta_title_nl").default("Wil je deel uitmaken van ons team?"),
  ctaTitleEn: varchar("cta_title_en").default("Want to be part of our team?"),
  ctaDescriptionNl: text("cta_description_nl").default("We zijn altijd op zoek naar getalenteerde professionals die willen bijdragen aan innovatieve bouwprojecten en excellente service."),
  ctaDescriptionEn: text("cta_description_en").default("We are always looking for talented professionals who want to contribute to innovative construction projects and excellent service."),
  ctaButtonTextNl: varchar("cta_button_text_nl").default("Bekijk Vacatures"),
  ctaButtonTextEn: varchar("cta_button_text_en").default("View Careers"),
  ctaButtonUrlNl: varchar("cta_button_url_nl").default("/contact"),
  ctaButtonUrlEn: varchar("cta_button_url_en").default("/contact"),
  
  // Display settings for homepage
  homepageMaxMembers: integer("homepage_max_members").default(4), // Max members to show on homepage
  homepageShowDepartments: boolean("homepage_show_departments").default(true),
  homepageShowTitles: boolean("homepage_show_titles").default(true),
  homepageShowBios: boolean("homepage_show_bios").default(false),
  
  // Display settings for team page
  pageLayout: varchar("page_layout").default("grid"), // grid, list, cards
  pageItemsPerRow: integer("page_items_per_row").default(3), // 2, 3, 4
  pageShowDepartments: boolean("page_show_departments").default(true),
  pageShowBios: boolean("page_show_bios").default(true),
  pageShowContactInfo: boolean("page_show_contact_info").default(false),
  pageShowSkills: boolean("page_show_skills").default(true),
  pageShowExperience: boolean("page_show_experience").default(true),
  pageShowSocial: boolean("page_show_social").default(true),
  
  // Filtering options
  enableDepartmentFilter: boolean("enable_department_filter").default(true),
  enableSkillsFilter: boolean("enable_skills_filter").default(false),
  enableSearch: boolean("enable_search").default(true),
  
  // Layout options
  backgroundStyle: varchar("background_style").default("white"), // white, muted, gradient
  cardStyle: varchar("card_style").default("default"), // default, minimal, elevated, modern
  animationStyle: varchar("animation_style").default("simple"), // none, simple, advanced
  imageShape: varchar("image_shape").default("rounded-full"), // rounded-full, rounded-lg, rounded-md, rounded-none
  
  // Homepage integration
  showInHomepage: boolean("show_in_homepage").default(true),
  homepageButtonTextNl: varchar("homepage_button_text_nl").default("Ontmoet Het Volledige Team"),
  homepageButtonTextEn: varchar("homepage_button_text_en").default("Meet The Full Team"),
  
  // SEO settings
  metaTitleNl: varchar("meta_title_nl").default("Ons Team | BuildIt Professional"),
  metaTitleEn: varchar("meta_title_en").default("Our Team | BuildIt Professional"),
  metaDescriptionNl: text("meta_description_nl").default("Ontmoet het professionele team van ervaren bouwexperts die uw projecten tot leven brengen met vakmanschap en innovatie."),
  metaDescriptionEn: text("meta_description_en").default("Meet the professional team of experienced construction experts who bring your projects to life with craftsmanship and innovation."),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// About Us detailed page content (bilingual with rich HTML editor)
export const aboutUsPage = pgTable("about_us_page", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titleNl: text("title_nl").notNull(),
  titleEn: text("title_en").notNull(),
  subtitleNl: text("subtitle_nl"),
  subtitleEn: text("subtitle_en"),
  contentNl: text("content_nl").notNull(), // Rich HTML content
  contentEn: text("content_en").notNull(), // Rich HTML content
  heroImage: varchar("hero_image"),
  gallery: jsonb("gallery"), // Array of image URLs
  metaTitleNl: varchar("meta_title_nl"),
  metaTitleEn: varchar("meta_title_en"),
  metaDescriptionNl: text("meta_description_nl"),
  metaDescriptionEn: text("meta_description_en"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact inquiries
export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  company: varchar("company").notNull(),
  projectType: varchar("project_type").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("new"), // new, contacted, closed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Site settings
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  value: text("value"),
  type: varchar("type").default("text"), // text, json, boolean, number
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company details (BTW, KVK, etc.)
export const companyDetails = pgTable("company_details", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyNameNl: varchar("company_name_nl").notNull(),
  companyNameEn: varchar("company_name_en").notNull(),
  btwNumber: varchar("btw_number"), // BTW-nummer (Dutch VAT number)
  kvkNumber: varchar("kvk_number"), // KVK-nummer (Chamber of Commerce number)
  address: text("address"),
  city: varchar("city"),
  postalCode: varchar("postal_code"),
  country: varchar("country").default("Netherlands"),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  iban: varchar("iban"), // For invoicing
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media files
export const mediaFiles = pgTable("media_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: integer("size").notNull(), // in bytes
  width: integer("width"),
  height: integer("height"),
  path: varchar("path").notNull(),
  url: varchar("url").notNull(),
  thumbnail: varchar("thumbnail"), // compressed/thumbnail version
  uploadedById: varchar("uploaded_by_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog comments
export const blogComments = pgTable("blog_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").notNull().references(() => blogArticles.id),
  parentId: varchar("parent_id"), // for nested comments - will reference blog_comments.id
  authorName: varchar("author_name").notNull(),
  authorEmail: varchar("author_email").notNull(),
  content: text("content").notNull(),
  status: varchar("status").default("pending"), // pending, approved, rejected, spam
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  status: varchar("status").default("active"), // active, unsubscribed, bounced
  source: varchar("source").default("website"), // website, admin, import
  unsubscribeToken: varchar("unsubscribe_token").unique(),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics tracking
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: varchar("event_type").notNull(), // page_view, click, download, contact_form, etc.
  path: varchar("path").notNull(),
  referrer: varchar("referrer"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
  sessionId: varchar("session_id"),
  metadata: jsonb("metadata"), // additional event data
  createdAt: timestamp("created_at").defaultNow(),
});

// Content backups
export const contentBackups = pgTable("content_backups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  backupType: varchar("backup_type").notNull(), // full, incremental, content_specific
  status: varchar("status").default("pending"), // pending, completed, failed
  filePath: varchar("file_path"),
  fileSize: integer("file_size"), // in bytes
  tablesIncluded: jsonb("tables_included"), // array of table names
  recordCount: integer("record_count"),
  triggeredBy: varchar("triggered_by").default("automatic"), // automatic, manual
  contentType: varchar("content_type"), // hero, statistics, services, projects, etc.
  contentId: varchar("content_id"), // ID of the original content
  backupData: jsonb("backup_data"), // actual content data for restoration
  description: text("description"), // backup description
  version: integer("version").default(1), // backup version number
  expiresAt: timestamp("expires_at"), // when backup can be auto-deleted
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email templates
export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  subject: varchar("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  templateType: varchar("template_type").notNull(), // contact_confirmation, contact_reply, newsletter, notification
  variables: jsonb("variables"), // available template variables
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email settings
export const emailSettings = pgTable("email_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  description: text("description"),
  settingType: varchar("setting_type").default("text"), // text, boolean, json
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email logs
export const emailLogs = pgTable("email_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  to: varchar("to").notNull(),
  from: varchar("from").notNull(),
  subject: varchar("subject").notNull(),
  templateId: varchar("template_id").references(() => emailTemplates.id),
  status: varchar("status").default("pending"), // pending, sent, failed, delivered
  errorMessage: text("error_message"),
  messageId: varchar("message_id"), // Microsoft Graph message ID
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  metadata: jsonb("metadata"), // additional data like variables used
  relatedType: varchar("related_type"), // contact_inquiry, newsletter, manual
  relatedId: varchar("related_id"), // ID of related record
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertHeroContentSchema = createInsertSchema(heroContent).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStatisticSchema = createInsertSchema(statistics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAboutContentSchema = createInsertSchema(aboutContent).omit({ id: true, createdAt: true, updatedAt: true });
export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogArticleSchema = createInsertSchema(blogArticles).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true, 
  authorId: true, 
  viewCount: true,
  readingTime: true 
});
export const insertPartnerSchema = createInsertSchema(partners).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPartnersSettingsSchema = createInsertSchema(partnersSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogSettingsSchema = createInsertSchema(blogSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({ id: true, createdAt: true, updatedAt: true, uploadedById: true });
export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).omit({ id: true, createdAt: true, updatedAt: true, unsubscribeToken: true });
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({ id: true, createdAt: true });
export const insertContentBackupSchema = createInsertSchema(contentBackups).omit({ id: true, createdAt: true });
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmailSettingSchema = createInsertSchema(emailSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({ id: true, createdAt: true });

// NEW: Insert schemas for new tables
export const insertCompanyInitiativeSchema = createInsertSchema(companyInitiatives).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompanyInitiativesSettingsSchema = createInsertSchema(companyInitiativesSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMaatschappelijkeStatisticSchema = createInsertSchema(maatschappelijkeStatistics).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSectionSettingSchema = createInsertSchema(sectionSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTestimonialsSettingsSchema = createInsertSchema(testimonialsSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContactFormSettingSchema = createInsertSchema(contactFormSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFooterSettingSchema = createInsertSchema(footerSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStatisticsSettingSchema = createInsertSchema(statisticsSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSocialMediaLinkSchema = createInsertSchema(socialMediaLinks).omit({ id: true, createdAt: true, updatedAt: true });
export const insertLegalPageSchema = createInsertSchema(legalPages).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCompanyDetailsSchema = createInsertSchema(companyDetails).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAboutUsPageSchema = createInsertSchema(aboutUsPage).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamSettingsSchema = createInsertSchema(teamSettings).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type HeroContent = typeof heroContent.$inferSelect;
export type InsertHeroContent = z.infer<typeof insertHeroContentSchema>;
export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = z.infer<typeof insertStatisticSchema>;
export type AboutContent = typeof aboutContent.$inferSelect;
export type InsertAboutContent = z.infer<typeof insertAboutContentSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = z.infer<typeof insertBlogArticleSchema>;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type PartnersSettings = typeof partnersSettings.$inferSelect;
export type InsertPartnersSettings = z.infer<typeof insertPartnersSettingsSchema>;
export type BlogSettings = typeof blogSettings.$inferSelect;
export type InsertBlogSettings = z.infer<typeof insertBlogSettingsSchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type ContentBackup = typeof contentBackups.$inferSelect;
export type InsertContentBackup = z.infer<typeof insertContentBackupSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailSetting = typeof emailSettings.$inferSelect;
export type InsertEmailSetting = z.infer<typeof insertEmailSettingSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;

// NEW: Types for new tables
export type CompanyInitiative = typeof companyInitiatives.$inferSelect;
export type InsertCompanyInitiative = z.infer<typeof insertCompanyInitiativeSchema>;
export type CompanyInitiativesSettings = typeof companyInitiativesSettings.$inferSelect;
export type InsertCompanyInitiativesSettings = z.infer<typeof insertCompanyInitiativesSettingsSchema>;
export type MaatschappelijkeStatistic = typeof maatschappelijkeStatistics.$inferSelect;
export type InsertMaatschappelijkeStatistic = z.infer<typeof insertMaatschappelijkeStatisticSchema>;
export type SectionSetting = typeof sectionSettings.$inferSelect;
export type InsertSectionSetting = z.infer<typeof insertSectionSettingSchema>;
export type ContactFormSetting = typeof contactFormSettings.$inferSelect;
export type InsertContactFormSetting = z.infer<typeof insertContactFormSettingSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type FooterSetting = typeof footerSettings.$inferSelect;
export type InsertFooterSetting = z.infer<typeof insertFooterSettingSchema>;
export type StatisticsSetting = typeof statisticsSettings.$inferSelect;
export type InsertStatisticsSetting = z.infer<typeof insertStatisticsSettingSchema>;
export type SocialMediaLink = typeof socialMediaLinks.$inferSelect;
export type InsertSocialMediaLink = z.infer<typeof insertSocialMediaLinkSchema>;
export type LegalPage = typeof legalPages.$inferSelect;
export type InsertLegalPage = z.infer<typeof insertLegalPageSchema>;
export type CompanyDetails = typeof companyDetails.$inferSelect;
export type InsertCompanyDetails = z.infer<typeof insertCompanyDetailsSchema>;
export type AboutUsPage = typeof aboutUsPage.$inferSelect;
export type InsertAboutUsPage = z.infer<typeof insertAboutUsPageSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamSettings = typeof teamSettings.$inferSelect;
export type InsertTeamSettings = z.infer<typeof insertTeamSettingsSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type TestimonialsSettings = typeof testimonialsSettings.$inferSelect;
export type InsertTestimonialsSettings = z.infer<typeof insertTestimonialsSettingsSchema>;
