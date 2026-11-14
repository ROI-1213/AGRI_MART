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

export interface HomepageCmsData {
  heroBanners: HeroBannerItem[];
  promoBanners: PromoBannerItem[];
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
