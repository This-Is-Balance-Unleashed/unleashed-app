import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/ui/event/hero-section';
import { AnnouncementBanner } from '@/components/ui/event/announcement-banner';
import { OfficialPartnerSection } from '@/components/ui/event/official-partner-section';
import { EventSchema } from '@/components/seo/event-schema';
import { FAQSchema } from '@/components/seo/faq-schema';
import { LocalBusinessSchema } from '@/components/seo/local-business-schema';
import { BreadcrumbSchema } from '@/components/seo/bread-crumb-schema';

// Dynamic imports for below-fold sections to reduce initial bundle size
const ValuePropositionSection = dynamic(
  () => import('@/components/ui/event/value-proposition-section').then(m => m.ValuePropositionSection),
  { ssr: true }
);
const ExperienceSection = dynamic(
  () => import('@/components/ui/event/experience-section').then(m => m.ExperienceSection),
  { ssr: true }
);
const TargetAudienceSection = dynamic(
  () => import('@/components/ui/event/target-audience-section').then(m => m.TargetAudienceSection),
  { ssr: true }
);
const PricingSection = dynamic(
  () => import('@/components/ui/event/pricing-section').then(m => m.PricingSection),
  { ssr: true }
);
const FinalCTASection = dynamic(
  () => import('@/components/ui/event/final-cta-section').then(m => m.FinalCTASection),
  { ssr: true }
);
const FAQSection = dynamic(
  () => import('@/components/ui/event/faq-section').then(m => m.FAQSection),
  { ssr: true }
);
const Footer = dynamic(
  () => import('@/components/ui/event/footer').then(m => m.Footer),
  { ssr: true }
);

export default function Home() {
  return (
    <main className="relative">
      <EventSchema />
      <FAQSchema />
      <LocalBusinessSchema />
      <BreadcrumbSchema />

      {/* Announcement Banner */}
      <AnnouncementBanner
        message="Early Bird Special: Use code EASTER_EGG for 20% off all tickets!"
        ctaText="Get Tickets"
        ctaLink="/tickets"
        variant="urgent"
        dismissible={true}
        storageKey="announcement-banner-dismissed"
      />

      {/* Announcement Banner - Official Partner */}
      <AnnouncementBanner
        message="Hit Refresh is proudly supported by MyTherapist.ng — Nigeria's leading mental health platform"
        ctaText="Visit MyTherapist.ng"
        ctaLink="https://mytherapist.ng"
        variant="success"
        dismissible={true}
        storageKey="partner-banner-dismissed"
      />

      <HeroSection />
      <OfficialPartnerSection />
      <ValuePropositionSection />
      <ExperienceSection />

      {/* Green wave separator */}
      <div className="relative z-50 -mt-12">
        <svg
          className="w-full"
          width="1240"
          height="55"
          viewBox="0 0 1240 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1240 14.5226C1223.08 16.9092 1204.8 17.443 1185.85 17.0034C1177.86 16.815 1170.01 16.1556 1162.16 15.7787C1153.36 15.3705 1144.29 14.5854 1135.62 14.7424C1120.86 14.9937 1106.65 15.3705 1096.09 12.2931C1075.92 11.4138 1055.88 9.87509 1034.49 11.508C1033.95 12.5757 1033.54 13.5492 1032.87 14.8994C1017.84 14.6482 1006.6 16.658 994.825 18.5421C972.758 22.0277 951.368 25.953 922.802 27.1777C905.203 26.3298 891.665 23.9433 883.812 19.7668C881.376 18.4793 877.043 17.3174 872.576 16.3125C865.536 14.7424 857.007 14.2086 847.801 15.3077C835.617 16.7836 822.62 17.5372 809.082 17.8513C796.085 18.1653 785.526 19.9866 775.643 21.7451C756.825 25.1052 736.247 27.5545 714.18 29.4387C709.983 29.7841 705.516 30.0353 701.183 30.1923C675.867 31.103 667.473 30.0353 657.455 24.4771C653.935 22.5616 651.769 20.5204 648.655 18.5421C641.751 14.1772 626.995 13.0781 610.613 15.9357C600.595 17.6943 592.337 20.018 580.288 21.0229C551.993 23.4408 531.28 28.5594 505.558 31.888C490.124 33.8663 473.472 34.4944 457.091 35.4365C447.344 36.0017 433.806 34.777 430.692 31.3542C427.714 28.0884 424.871 24.8225 421.486 21.5567C418.643 18.6991 409.979 17.5058 399.69 19.076C370.177 23.5979 337.008 26.2984 305.058 29.5642C274.327 32.7045 241.971 34.5886 208.532 35.1225C192.421 35.3737 178.613 33.8664 168.188 30.8832C165.481 30.0981 162.773 29.2817 159.524 28.3396C142.466 29.3131 130.281 31.7938 118.097 34.2118C83.9812 41.0261 50.4065 47.9659 16.4259 54.843C15.8844 54.9686 14.6661 54.9372 13.8538 55C-1.44428 51.64 -3.88127 50.3525 5.5954 47.1809C16.2905 43.601 27.3918 39.8014 42.0129 37.1636C78.972 30.5377 113.765 23.4095 148.016 16.0927C149.235 15.8415 151.265 15.7473 154.379 15.4333C157.087 15.9357 160.742 16.4381 163.721 17.129C169.271 18.4793 174.551 19.9238 179.831 21.3683C190.797 24.3515 203.793 25.6076 220.716 24.4143C225.725 24.0689 231.276 23.8805 236.556 23.9119C247.386 23.9747 258.352 24.3829 265.663 21.8393C297.071 20.5518 321.169 15.025 352.712 13.8318C356.097 13.7062 359.752 13.3293 362.595 12.8269C380.872 9.7181 402.668 9.46686 424.058 8.4934C435.837 10.9114 442.335 13.7376 443.553 17.2546C444.095 18.6991 444.366 20.2064 445.719 21.6195C449.51 25.2308 466.162 26.7695 479.294 24.7597C485.792 23.7863 490.53 21.9021 500.413 22.8128C500.819 22.8442 502.986 22.3104 503.392 21.9649C507.589 19.0445 517.742 17.8827 529.114 16.9092C539.268 16.0613 549.015 14.9622 558.898 13.9888C560.523 13.8318 562.553 13.6747 563.501 13.3921C582.59 7.92815 610.614 5.98125 636.607 3.21786C638.908 2.96664 641.345 2.68401 643.24 2.4642C656.508 3.50047 661.652 5.79282 663.818 8.61901C665.037 10.2519 664.901 12.0733 668.15 13.4864C681.147 19.2015 693.196 19.9552 718.648 17.0976C747.755 13.8318 776.997 10.6602 805.427 7.01751C819.506 5.22759 835.481 4.25411 850.915 3.12364C856.736 2.684 863.37 2.71541 869.733 2.77822C882.188 2.87243 892.206 4.06572 898.704 6.6721C904.12 8.83884 909.535 11.0056 915.627 13.0781C918.47 14.083 922.938 14.8366 926.864 15.7473C945.14 13.4549 962.74 11.4138 979.662 9.12144C998.345 6.60927 1016.49 3.90869 1038.96 3.43766C1043.16 3.34345 1047.49 2.74682 1050.87 2.15018C1065.22 -0.3934 1081.2 -0.424802 1097.17 0.737078C1121.27 2.4642 1145.91 3.56328 1170.82 4.47394C1184.09 4.97638 1196.68 6.26386 1209.81 7.01751C1227 7.95958 1236.07 10.4404 1240 14.5226ZM586.651 13.8632C585.568 13.7376 584.485 13.612 583.402 13.5177C583.673 13.6748 583.808 13.926 584.485 14.0202C584.891 14.0516 585.974 13.926 586.651 13.8632ZM634.847 5.76142L633.493 5.54159L633.222 5.88704L634.847 5.76142Z"
            fill="#39B54A"
          />
          <path
            d="M587 13.7253C586 13.8462 584.833 14.0879 584.333 13.9671C583.667 13.8462 583.5 13.3627 583 13C584.333 13.3022 585.667 13.4835 587 13.7253Z"
            fill="#39B54A"
          />
        </svg>
      </div>

      <TargetAudienceSection />
      <PricingSection />
      <FinalCTASection />
      <FAQSection />
      <Footer />
    </main>
  );
}
