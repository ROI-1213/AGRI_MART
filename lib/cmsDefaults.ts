export interface HeroBannerItem {
  id: number;
  title: string;
  image: string;
  link: string;
  active: boolean;
}

export interface PromoBannerItem {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  link: string;
  buttonText: string;
}

export interface SectionHeaderCms {
  badge: string;
  title: string;
  subtitle: string;
}

export interface BrandCmsItem {
  name: string;
  tagline: string;
  href: string;
  logo: string;
}

export interface TopPickCmsItem {
  id: string;
  brand: string;
  tagline: string;
  brandLogo: string;
  brandSubtitle: string;
  category: string;
  leadTitle: string;
  leadSubtitle: string;
  priceRange: string;
  specs: string;
  bannerImage: string;
  badge: string;
  route: string;
}

export interface FeaturedProductCmsItem {
  id: string;
  name: string;
  code: string;
  brand: string;
  category: string;
  keyFeature: string;
  image: string;
  secondaryImage?: string;
  badge: string;
  isFlagship?: boolean;
}

export interface AwardCmsItem {
  id: number;
  title: string;
  organization: string;
  image: string;
}

export interface TestingInstituteCmsItem {
  id: string;
  code: string;
  name: string;
  logo: string;
}

export interface AppDownloadCmsData {
  title?: string;
  subtitle?: string;
  bannerImage: string;
  googlePlayLink: string;
  appStoreLink: string;
}

export interface HomepageCmsData {
  heroBanners: HeroBannerItem[];
  promoBanners: PromoBannerItem[];
  promoHeader?: { title: string };
  categoriesSection?: SectionHeaderCms;
  brandsSection?: {
    header: SectionHeaderCms;
    brands: BrandCmsItem[];
  };
  topPicksSection?: {
    header: SectionHeaderCms;
    picks: TopPickCmsItem[];
  };
  featuredProductsSection?: {
    header: SectionHeaderCms;
    products: FeaturedProductCmsItem[];
  };
  awardsSection?: {
    header: SectionHeaderCms;
    awards: AwardCmsItem[];
  };
  institutesSection?: {
    header: SectionHeaderCms;
    institutes: TestingInstituteCmsItem[];
  };
  appBanner?: AppDownloadCmsData;
}

export interface AboutUsCmsData {
  title: string;
  subtitle: string;
  foundedYear: string;
  parentGroup: string;
  flagshipBrand: string;
  showroomImage: string;
  warehouseImage?: string;
  description: string;
  vision: string;
  mission: string;
  headquarters: string;
  helpline: string;
}

export interface ContactUsCmsData {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  companyName: string;
  headOfficeAddress: string;
  tollFreePhone: string;
  supportPhone?: string;
  email: string;
  supportEmail?: string;
  workingHoursWeekday: string;
  workingHoursWeekend: string;
  mapEmbedUrl?: string;
  googleMapsLink?: string;
}

export interface FooterCmsData {
  aboutText: string;
  logoImage?: string;
  backgroundImage?: string;
  corporateBrochureUrl?: string;
  corporateBrochureText?: string;
  brandBrochureUrl?: string;
  brandBrochureText?: string;
  address: string;
  helplinePhone: string;
  email: string;
  workingHours: string;
  googlePlayLink: string;
  appStoreLink: string;
  touchpointsCount: string;
  touchpointsLabel: string;
  statesCoveredCount: string;
  statesCoveredLabel: string;
  networkMapImage?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  copyrightText?: string;
}

export const DEFAULT_HOMEPAGE_CMS: HomepageCmsData = {
  heroBanners: [
    {
      id: 1,
      title: 'AGRIMATE — Reliable Farm Equipment for a Better Tomorrow | Agrimart',
      image: '/assets/banners/hero_agrimate_hd.png',
      link: '/products?brand=AGRIMATE',
      active: true,
    },
    {
      id: 2,
      title: 'KASEI — Advanced Technology Powerful Performance | Agrimart',
      image: '/assets/banners/hero_kasei_hd.png',
      link: '/products?brand=KASEI',
      active: true,
    },
    {
      id: 3,
      title: 'OLEO-MAC — Italian Design & Engineering to meet Indian Fields | Agrimart',
      image: '/assets/banners/hero_oleomac_hd.png',
      link: '/products?brand=OLEO-MAC',
      active: true,
    },
    {
      id: 4,
      title: 'Become a Dealer Today — Ratnagiri Impex & Agrimart Authorised Dealer | Elevate your Future',
      image: '/assets/banners/hero_dealer_partner_hd.png',
      link: '/become-a-partner',
      active: true,
    },
  ],
  promoBanners: [
    {
      id: 1,
      title: 'Become a Partner',
      subtitle: 'GROW TOGETHER',
      desc: '1,200+ partners across India are already making profit. Partner with us today!',
      link: '/become-a-partner',
      buttonText: 'Partner With Us',
    },
    {
      id: 2,
      title: 'Buy, Earn and Rent',
      subtitle: 'MORE VALUE FOR YOU',
      desc: 'Be a pioneer in the booming Indian rural retail marketing.',
      link: '/cms/buy-earn-rent',
      buttonText: 'Explore Opportunities',
    },
    {
      id: 3,
      title: 'Knowledge Bank',
      subtitle: 'KNOW MORE, GROW MORE',
      desc: 'Access expert guides, product information and farming insights.',
      link: '/cms/knowledge-bank',
      buttonText: 'Explore Resources',
    },
  ],
  promoHeader: {
    title: 'Agrimart Growth & Opportunities',
  },
  categoriesSection: {
    badge: 'Equipment Catalog',
    title: 'Shop by Category',
    subtitle: 'Browse our full spectrum of agricultural, horticulture, plantation and garden mechanization machinery.',
  },
  brandsSection: {
    header: {
      badge: 'Authorized Global & In-House Brands',
      title: 'Our Brands',
      subtitle: 'Agrimart works with world-class manufacturers, experienced engineers, and trusted in-house brands to improve productivity for farmers and profitability for our partners.',
    },
    brands: [
      {
        name: 'AGRIMATE',
        tagline: 'Reliable, Powerful Farm Machinery',
        href: '/products?brand=AGRIMATE',
        logo: '/assets/brands/partner_strip/agrimate.png',
      },
      {
        name: 'KASEI',
        tagline: 'High-Performance Power Equipment',
        href: '/products?brand=KASEI',
        logo: '/assets/brands/partner_strip/kasei_hd.png',
      },
      {
        name: 'OLEO-MAC',
        tagline: 'Italian Technology & Global Reliability',
        href: '/products?brand=OLEO-MAC',
        logo: '/assets/brands/partner_strip/oleo_mac_hd.png',
      },
    ],
  },
  topPicksSection: {
    header: {
      badge: 'Flagship Agricultural Machinery',
      title: "Agrimart's Top Picks",
      subtitle: 'Hand-picked flagship agricultural machinery built for maximum field reliability, powerful engines, and certified after-sales support.',
    },
    picks: [
      {
        id: 'brand_agrimate',
        brand: 'AGRIMATE',
        tagline: 'Apnalo Munafa Badalo',
        brandLogo: '/assets/brands/partner_strip/agrimate.png',
        brandSubtitle: 'Ratnagiri Impex • Flagship Brand',
        category: 'POWER WEEDER & TILLERS',
        leadTitle: 'Agrimate Heavy-Duty Power Weeder & Tiller',
        leadSubtitle: 'Powerful diesel engines & multi-crop rotavators engineered for tough Indian farms.',
        priceRange: 'Price on Request',
        specs: 'Commercial Diesel Engine • Multi-Crop Rotavator Tillers • SMAM Subsidy',
        bannerImage: '/assets/toppicks_banners/brand_agrimate.png',
        badge: 'FLAGSHIP FARM MECHANIZATION',
        route: '/products?brand=AGRIMATE',
      },
      {
        id: 'brand_kasei',
        brand: 'KASEI',
        tagline: 'Advanced Technology',
        brandLogo: '/assets/brands/partner_strip/kasei_hd.png',
        brandSubtitle: 'Global Technology Partner',
        category: 'TEA HARVESTERS & POWER EQUIPMENT',
        leadTitle: 'KASEI Professional Tea Harvester & Cutters',
        leadSubtitle: 'Precision high-velocity agricultural machinery & commercial tea harvesters built for peak field efficiency.',
        priceRange: 'Price on Request',
        specs: 'High Air-Flow Engine • Precision Cutting Blades • Plantation Grade',
        bannerImage: '/assets/toppicks_banners/brand_kasei.png',
        badge: 'ADVANCED JAPANESE TECHNOLOGY',
        route: '/products?brand=KASEI',
      },
      {
        id: 'brand_oleomac',
        brand: 'OLEO-MAC',
        tagline: 'Our Power, Your Passion',
        brandLogo: '/assets/brands/partner_strip/oleo_mac_hd.png',
        brandSubtitle: 'Italy • Germany • USA Engineered',
        category: 'PROSINT LUBRICANTS & SPECIAL OILS',
        leadTitle: 'Oleo-Mac Prosint 2 EVO Synthetic Lubricants',
        leadSubtitle: 'Special 50:1 2% synthetic lubricant oil for high-performance 2-stroke agricultural engines.',
        priceRange: 'Price on Request',
        specs: '100% Synthetic Formula • Anti-Wear Protection • Italian Quality',
        bannerImage: '/assets/toppicks_banners/brand_oleomac.png',
        badge: 'EUROPEAN PRECISION SERIES',
        route: '/products?brand=OLEO-MAC',
      },
    ],
  },
  featuredProductsSection: {
    header: {
      badge: 'Engineered for Indian Agriculture',
      title: 'Featured Agricultural Machinery',
      subtitle: 'Direct from manufacturer — certified genuine parts, manufacturer warranty, and nationwide after-sales service.',
    },
    products: [
      {
        id: 'am-mptc-6600-9p-intercultivator-power-weeder-back-rotary',
        name: 'AM-MPTC-6600-9P Back Rotary Intercultivator & Power Weeder',
        code: 'RIPL037320',
        brand: 'AGRIMATE',
        category: 'INTERCULTIVATOR/POWER WEEDER',
        keyFeature: '301 CC 177FP Engine • 1800 RPM • Back Rotary Ditching & Weeding',
        image: '/assets/products/ripl037320/img_3.jpg',
        badge: '★ Flagship Back Rotary',
        isFlagship: true,
      },
      {
        id: 'am-ccmg-400-3hp-elite-chaff-cutter-with-copper-motor',
        name: 'AM-CCMG-400-3HP Elite Chaff Cutter with Copper Motor',
        code: 'RIPL036956',
        brand: 'AGRIMATE',
        category: 'CHAFF CUTTER / SHREDDER',
        keyFeature: '3 HP Copper Motor • 2800 RPM • 6 Blades (5 Rotating + 1 Fixed)',
        image: '/assets/products/ripl036956/img_1.jpg',
        badge: 'Copper Motor Chaff Cutter',
      },
      {
        id: 'am-mt-320m-wt-wheel-trolley-transporter',
        name: 'AM-MT-320M-WT Heavy Wheel Trolley & Transporter',
        code: 'RIPL036445',
        brand: 'AGRIMATE',
        category: 'TRANSPORTER',
        keyFeature: '7 HP / 212 CC Engine • 350 KG Max Load • 3 Forward + 1 Reverse',
        image: '/assets/products/ripl036445/img_1.jpg',
        badge: 'Heavy Farm Transporter',
      },
      {
        id: 'am-rtp-7212-pro-classic-inter-cultivator-power-weeder',
        name: 'AM-RTP-7212 Pro-Classic Intercultivator & Power Weeder',
        code: 'RIPL038521',
        brand: 'AGRIMATE',
        category: 'INTERCULTIVATOR/POWER WEEDER',
        keyFeature: '212 CC Petrol Engine • 3600 RPM • 550-750-1000mm Tilling Width',
        image: '/assets/products/ripl038521/img_1.jpg',
        badge: 'Flagship Power Weeder',
      },
      {
        id: 'am-champion-16-ltrs-12v-8ah-battery-sprayer',
        name: 'AM Champion 16L 12V/8Ah Commercial Battery Sprayer',
        code: 'RIPL026669',
        brand: 'AGRIMATE',
        category: 'SPRAYER',
        keyFeature: '16L PP Tank • 12V/8AH Battery • 7.5 L/min Discharge • 0.55 MPa',
        image: '/assets/products/ripl026669/img_1.jpg',
        badge: 'High-Efficiency Battery Sprayer',
      },
      {
        id: 'am708-2s-al-ms-20l-knapsack-power-sprayer',
        name: 'AM-708-2S-AL-MS+ 20L Knapsack Power Sprayer',
        code: 'RIPL036461',
        brand: 'AGRIMATE',
        category: 'SPRAYER',
        keyFeature: '25.6 CC 2-Stroke • 20L Chemical Tank • 35 kg/cm² Pressure',
        image: '/assets/products/ripl036461/img_1.jpg',
        badge: 'Heavy Plant Protection',
      },
      {
        id: 'kz-4000bc-2s-delite-brush-cutter-kasei-plus',
        name: 'KZ-4000BC-2S-DELITE Brush Cutter Kasei Plus',
        code: 'RIPL037692',
        brand: 'KASEI',
        category: 'BRUSH CUTTER - WEED CUTTER',
        keyFeature: '40.2 CC 2-Stroke • 10000 RPM High-Speed Recoil • Heavy Weeding',
        image: '/assets/products/ripl037692/img_1.jpg',
        badge: 'Japanese Technology',
      },
      {
        id: 'am-400-bch-4s-ms-crop-harvester',
        name: 'AM-400-BCH-4S-MS+ Multi-Crop Harvester',
        code: 'RIPL036440',
        brand: 'AGRIMATE',
        category: 'BRUSH CUTTER - WEED CUTTER',
        keyFeature: '35.8 CC 4-Stroke Engine • 6500 RPM • Multi-Crop Harvester Attachment',
        image: '/assets/products/ripl036440/img_1.jpg',
        badge: 'Precision Crop Harvester',
      },
    ],
  },
  awardsSection: {
    header: {
      badge: 'Honors & Distinctions',
      title: 'Awards & Industry Recognition',
      subtitle: 'Recognized nationally and internationally for rural retail innovation, farmer service, and agricultural entrepreneurship.',
    },
    awards: [
      {
        id: 1,
        title: 'Lifetime Achievement to our CMD by Franchise India',
        organization: 'Franchise India',
        image: '/assets/awards/award_lifetime_achievement_2x.png',
      },
      {
        id: 2,
        title: 'Agri Business of the Year 2011',
        organization: 'Annual Agri Excellence',
        image: '/assets/awards/award_agri_business_2011_2x.png',
      },
      {
        id: 3,
        title: 'Best Innovative Retail Concept for Agriculture Equipments & Sprayers - TOI',
        organization: 'Times of India',
        image: '/assets/awards/award_best_innovative_toi_2x.png',
      },
      {
        id: 4,
        title: 'ET Business Excellence 2019',
        organization: 'The Economic Times',
        image: '/assets/awards/award_et_business_2019_2x.png',
      },
      {
        id: 5,
        title: 'Innovative Retail Concept - CMO Asia',
        organization: 'CMO Asia',
        image: '/assets/awards/award_cmo_asia_2x.png',
      },
      {
        id: 6,
        title: 'Retail Excellence under Rural Impact & CSR Category Asia - ET Now',
        organization: 'ET Now',
        image: '/assets/awards/hd_trophies/trophy_6_rgba.png',
      },
      {
        id: 7,
        title: 'Top 100 Franchise Opportunities by Franchise World',
        organization: 'Franchise World',
        image: '/assets/awards/hd_trophies/trophy_7_rgba.png',
      },
    ],
  },
  institutesSection: {
    header: {
      badge: 'Certified & Government Tested',
      title: 'Academic & Testing Institutes Recognition',
      subtitle: 'All machines meet stringent Indian agricultural safety, fuel-efficiency, and durability standards tested across premier national institutes.',
    },
    institutes: [
      {
        id: 'ciae',
        code: 'ICAR - CIAE',
        name: 'ICAR - Central Institute of Agricultural Engineering',
        logo: '/assets/recognition/ciae_hd.png',
      },
      {
        id: 'srfmtti',
        code: 'SRFMTTI',
        name: 'Southern Region Farm Machinery Training & Testing Institute',
        logo: '/assets/recognition/srfmtti_hd.png',
      },
      {
        id: 'uas',
        code: 'UAS',
        name: 'University of Agricultural Sciences, Bangalore',
        logo: '/assets/recognition/uas_hd.png',
      },
      {
        id: 'nerfmtti',
        code: 'NERFMTTI',
        name: 'North Eastern Region Farm Machinery Training & Testing Institute',
        logo: '/assets/recognition/nerfmtti_hd.png',
      },
      {
        id: 'nrfmtti',
        code: 'NRFMTTI',
        name: 'Northern Region Farm Machinery Training & Testing Institute',
        logo: '/assets/recognition/nrfmtti_hd.png',
      },
      {
        id: 'tnau',
        code: 'TNAU',
        name: 'Tamil Nadu Agricultural University',
        logo: '/assets/recognition/tnau_hd.png',
      },
      {
        id: 'angrau',
        code: 'ANGRAU',
        name: 'Acharya N.G. Ranga Agricultural University',
        logo: '/assets/recognition/angrau_hd.png',
      },
    ],
  },
  appBanner: {
    title: 'Download Agrimart Mobile App — Get every farming solution in one place',
    subtitle: 'Available on Google Play & Apple App Store',
    bannerImage: '/assets/banners/app_download_banner_hd.png',
    googlePlayLink: 'https://play.google.com/store/apps/details?id=com.invenzo.ratnagiri&hl=en_IN&gl=US&pli=1',
    appStoreLink: 'https://apps.apple.com/in/app/agrimart/id1599062786',
  },
};

export const DEFAULT_ABOUTUS_CMS: AboutUsCmsData = {
  title: 'Welcome to RATNAGIRI IMPEX',
  subtitle: 'About Ratnagiri Impex Pvt. Ltd.',
  foundedYear: '2000',
  parentGroup: 'Annapurna Group',
  flagshipBrand: 'AGRIMATE',
  showroomImage: '/assets/about/agrimart_mega_showroom.jpg',
  warehouseImage: '/assets/about/ratnagiri_impex_warehouse.jpg',
  description:
    'We have an extensive presence all over India and are a reputable agricultural equipment enterprise that supplies high-quality products, ensuring durability, enhanced yield, and unmatched customer satisfaction. Additionally, we are an all-in-one destination for agricultural equipment that simplifies the procurement process and offers comprehensive after-sales service across the nation. Ratnagiri Impex was founded in 2000, bringing over two decades of technological excellence in agricultural machinery.',
  vision:
    'To be the premier agricultural machinery provider across India, revolutionizing farming efficiency through affordable, innovative mechanization that reduces manual labor, conserves water and resources, and maximizes economic returns for every farmer.',
  mission:
    'To deliver world-class machinery, robust after-sales support, easily accessible spare parts, and comprehensive hands-on training to agricultural communities via our widespread network of over 750+ dedicated dealers and service hubs.',
  headquarters:
    'Ratnagiri Impex Pvt. Ltd. (Annapurna House), #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.',
  helpline: '7393 938 938',
};

export const DEFAULT_CONTACTUS_CMS: ContactUsCmsData = {
  badge: 'Pan-India Sales & Service Support',
  title: 'Contact Agrimart',
  subtitle:
    'Expert consultation for agricultural machinery selection, institutional subsidies, genuine spare parts, and nationwide dealer network assistance.',
  formTitle: 'Send an Enquiry',
  companyName: 'Ratnagiri Impex Pvt. Ltd.',
  headOfficeAddress:
    'Annapurna House, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.',
  tollFreePhone: '7393 938 938',
  supportPhone: '+91 80 2674 1777',
  email: 'ask@agrimart.in',
  supportEmail: 'customercare@agrimart.in',
  workingHoursWeekday: 'Monday – Saturday: 9:30 AM – 6:00 PM',
  workingHoursWeekend: 'Sunday: Closed',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.309489574441!2d77.54580227598858!3d12.951980915307525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3e18a99252ef%3A0xe54d63503f90e54!2sRatnagiri%20Impex%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  googleMapsLink: 'https://maps.app.goo.gl/3wJj62n6235q35678',
};

export const DEFAULT_FOOTER_CMS: FooterCmsData = {
  aboutText:
    'AGRIMART is an initiative of Ratnagiri Impex Pvt. Ltd., part of the Annapurna Group. Founded in 2000, we specialize in high-efficiency agricultural machinery, mechanization solutions, pest control sprayers, garden care equipment, and reliable customer service across India.',
  logoImage: '/assets/branding/logo.png',
  backgroundImage: '/assets/banners/footer_bg_hd.png',
  corporateBrochureUrl: '/assets/brochures/corporate_brochure.pdf',
  corporateBrochureText: 'Download Corporate Brochure',
  brandBrochureUrl: '/assets/brochures/agrimart_brochure.pdf',
  brandBrochureText: 'Download Agrimate Brochure',
  address:
    'Annapurna House, #1/1G, 7th Cross, New Guddadahalli, Mysore Road, Bangalore – 560026, Karnataka, India.',
  helplinePhone: '7393 938 938',
  email: 'ask@agrimart.in',
  workingHours: 'Mon – Sat: 9:30 AM – 6:00 PM | Sunday: Closed',
  googlePlayLink:
    'https://play.google.com/store/apps/details?id=com.invenzo.ratnagiri&hl=en_IN&gl=US&pli=1',
  appStoreLink: 'https://apps.apple.com/in/app/agrimart/id1599062786',
  touchpointsCount: '750+',
  touchpointsLabel: 'Network Touchpoints',
  statesCoveredCount: '28',
  statesCoveredLabel: 'States Covered',
  networkMapImage: '/assets/branding/india_network_map_hd.png',
  facebookUrl: 'https://www.facebook.com/agrimart20',
  instagramUrl: 'https://www.instagram.com/agrimart20',
  twitterUrl: 'https://x.com/Agrimart3',
  linkedinUrl: 'https://www.linkedin.com/company/agrimart20',
  youtubeUrl:
    'https://www.youtube.com/channel/UCPChKPEwHssr4WmuOxrJY9g?reload=9&view_as=subscriber',
  copyrightText: 'Agrimart — Ratnagiri Impex Pvt. Ltd. All rights reserved.',
};
