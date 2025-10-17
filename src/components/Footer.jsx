import React from 'react'
import { MapPin, Mail } from 'lucide-react';
import { BrandHeading } from './BrandHeading';
import { StarburstBadge } from './StarburstBadge';

const Footer = () => {
  const FEATURES = [
    { title: "100% ORGANIC", icon: "/ProductNature.svg" },
    { title: "TRADITIONALLY HANDCRAFTED", icon: "/productJars.svg" },
    { title: "FARM TO TABLE FRESHNESS", icon: "/farm.svg" },
    { title: "NO PRESERVATIVES", icon: "/productLeaf.svg" },
    { title: "SUSTAINABLE FARMING", icon: "/susFarming.svg" },
  ];

  const SOCIAL_LINKS = [
    { icon: "/footer/footerFb.svg", alt: "Facebook" ,href:"https://www.facebook.com/people/Roseate-Farms/pfbid028djGjjwpFN2yAsWwzvQ1oHW8BUmTb8hJVB6iqenFnmVmjoGFVcELgTQQDwXdL5jul/"},
    { icon: "/footer/FooterX.svg", alt: "X" ,href:"https://x.com/roseatefarms"},
    { icon: "/footer/footerLinkeidn.svg", alt: "LinkedIn" ,href:"https://www.linkedin.com/company/roseatefarms/"},
    { icon: "/footer/foooterIntsa.svg", alt: "Instagram" ,href:"https://www.instagram.com/roseatefarms/"},
  ];

  const MORE_INFO_LINKS = [
    { href: "/privacy-policies", text: "Privacy Policy" },
    { href: "/refund-policy", text: "Refund Policy" },
    { href: "/shipping-policy", text: "Shipping Policy" },
    { href: "/terms-of-service", text: "Terms Of Service" },
  ];

  const QUICK_LINKS = [
    { href: "/", text: "Home" },
    { href: "/collection/allproducts", text: "Products" },
    { href: "/our-story", text: "Our Story" },
    { href: "/contact", text: "Contact Us" },
  ];

  const CONTACT_INFO = {
    address: "Plot No. 137, Ground Floor, Pkt N, Sec 2, Bawana DSIIDC, North West, Delhi-110039",
    email: "info@roseatefarms.com",
    phone: "+91 8178224814",
    whatsapp: "+91 8178224814",
  };

  const COMPANY_DESC = {
    title: "ORGANIC GOODNESS, NATURALLY GROWN",
    text: "We Believe That Good Food Should Make People Feel Good About Eating it. That's Why We Are Dedicated To Selecting Only The Finest Ingredients And Crafting Each Recipe With Expertise And Care."
  };

  const WhatsAppIcon = () => (
    <svg className="w-6 h-6 lg:w-7 lg:h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );

  // helpers
  const onlyDigits = (s = '') => s.replace(/[^\d]/g, '');
  const telHref = (s = '') => `tel:${s.replace(/\s+/g, '')}`;
  const mailHref = (s = '') => `mailto:${s}`;
  const mapsHref = (addr = '') => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
  const waHref = (s = '', text = 'Hi! I have a query regarding your products.') =>
    `https://wa.me/${onlyDigits(s) || s.replace(/\s+/g, '')}?text=${encodeURIComponent(text)}`;

  const ContactItem = ({ icon: Icon, text, kind = 'address', reverse = false }) => {
    let href = '#';
    if (kind === 'email') href = mailHref(text);
    if (kind === 'phone') href = telHref(text);
    if (kind === 'address') href = mapsHref(text);
    if (kind === 'whatsapp') href = waHref(text);

    const Content = () => (
      <>
        {reverse && kind === 'address' ? (
          <span className="text-body text-right">
            {text.split(',').slice(0, 2).join(',')}
            <br />
            {text.split(',').slice(2).join(',')}
          </span>
        ) : (
          <span className={kind === 'email' || kind === 'phone' || kind === 'whatsapp' ? 'text-body font-medium' : 'text-small leading-relaxed'}>
            {text}
          </span>
        )}
      </>
    );

    return (
      <a
        href={href}
        target={kind === 'address' || kind === 'whatsapp' ? '_blank' : undefined}
        rel={kind === 'address' || kind === 'whatsapp' ? 'noopener noreferrer' : undefined}
        className={`flex items-${reverse ? 'center' : 'start'} gap-3 ${reverse ? 'flex-row-reverse text-right' : ''} hover:opacity-90 transition-opacity`}
      >
        <div className={`${reverse ? 'w-12 h-12' : 'w-10 h-10'} bg-white rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className={`${reverse ? 'w-6 h-6' : 'w-5 h-5'} text-brand-500`} />
        </div>
        <Content />
      </a>
    );
  };

  const WhatsAppButton = ({ mobile = false }) => {
    const href = waHref(CONTACT_INFO.whatsapp);
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-${mobile ? 'start' : 'center'} gap-${mobile ? '3' : '4'} ${mobile ? '' : 'bg-black hover:bg-gray-900 rounded-full pl-8 transition-colors'}`}
      >
        {!mobile && (
          <div className="flex flex-col items-start">
            <span className="text-body font-bold">Whatsapp</span>
            <span className="text-small">Click To Chat</span>
          </div>
        )}
        <div className={`${mobile ? 'w-10 h-10' : 'w-12 h-12'} bg-white rounded-full flex items-center justify-center flex-shrink-0`}>
          <WhatsAppIcon />
        </div>
        {mobile && (
          <div className="flex flex-col">
            <span className="text-body font-bold">Whatsapp</span>
            <span className="text-small opacity-80">Click To Chat</span>
          </div>
        )}
      </a>
    );
  };

  const SocialIcons = ({ mobile = false }) => (
    <div className={`flex gap-${mobile ? '3 justify-center' : '2'}`}>
      {SOCIAL_LINKS.map((social) => (
        <a
          href={social.href}
          key={social.alt}
          target="_blank"
          rel="noopener noreferrer"
          className={`${mobile ? 'w-10 h-10' : 'w-8 h-8'} border border-white rounded-full flex items-center justify-center bg-white hover:bg-opacity-80 transition-colors cursor-pointer`}
        >
          <img src={social.icon} alt={social.alt} className={mobile ? 'w-5 h-5' : 'w-4 h-4'} />
        </a>
      ))}
    </div>
  );

  const LinkList = ({ links, title }) => (
    <div>
      <h4 className="text-small font-semibold uppercase tracking-wide mb-4">{title}</h4>
      <ul className="space-y-2 md:space-y-2.5 lg:space-y-2">
        {links.map((link) => (
          <li key={link.text}>
            <a href={link.href} className="text-small hover:opacity-80 transition-opacity">{link.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative bg-black bg-cover pb-10" style={{ backgroundImage: 'url(/footer.png)' }}>
      {/* Why Roseate Farms Section */}
      <div className="bg-center">
        <div className="content py-16">
          <div className="text-center">
            <BrandHeading className="text-subheading md:text-heading font-semibold text-white uppercase mb-12" accentWord="FARMS">
              WHY ROSEATE
            </BrandHeading>
            <div className="flex items-center no-scrollbar justify-between gap-10 overflow-hidden overflow-x-auto">
              {FEATURES.map((feature) => (
                <StarburstBadge
                  starburstImage='/footerBadge.svg'
                  key={feature.title}
                  title={feature.title}
                  icon={feature.icon}
                  titleClassName="text-white text-small md:text-body"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-brand-500 mx-6 rounded-2xl text-white">
        {/* Top Section - Contact Info */}
        <div className="content py-8 md:py-10">
          {/* Mobile: Contact Info First */}
          <div className="lg:hidden space-y-5">
            <img src="/roseateW.svg" alt="Roseate Farms" className="h-24 md:h-32" />
            <ContactItem icon={MapPin} text={CONTACT_INFO.address} kind="address" />
            <ContactItem icon={Mail} text={CONTACT_INFO.email} kind="email" />
            {CONTACT_INFO.whatsapp && <WhatsAppButton mobile />}
            <div>
              <h4 className="text-subheading md:text-subheading font-semibold uppercase tracking-wide">{COMPANY_DESC.title}</h4>
              <p className="text-body opacity-90">{COMPANY_DESC.text}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Newsletter (Desktop) */}
            <div className="hidden lg:block">
              <h3 className="text-body font-bold uppercase tracking-wide mb-6">
                SUBSCRIBE TO OUR NEWSLETTER FOR UPDATES AND SPECIAL OFFERS!
              </h3>
              <div className="relative mb-6">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full px-6 py-4 pr-40 rounded-full text-gray-700 text-body bg-white focus:outline-none"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-brand-500 hover:bg-brand-600 text-white px-10 rounded-full font-semibold text-body transition-colors">
                  Subscribe
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg px-4 py-2.5 flex items-center">
                  <img src="/footer/fassai.svg" alt="FSSAI" className="h-10" />
                </div>
                <span className="text-body font-medium">LIC NO: 13325008000620</span>
              </div>
            </div>

            {/* Right Side - Contact Info (Desktop) */}
            <div className="hidden lg:flex flex-col gap-4 items-end">
              <ContactItem icon={MapPin} text={CONTACT_INFO.address} kind="address" reverse />
              <ContactItem icon={Mail} text={CONTACT_INFO.email} kind="email" reverse />
              {CONTACT_INFO.whatsapp && <WhatsAppButton />}
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20"></div>

        {/* Middle Section - Main Footer Content */}
        <div className="content py-8">
          <div className="grid grid-cols-1 md:[grid-template-columns:1.35fr_1fr_1fr_auto] gap-8">
            {/* Left Column - Follow Us & Description (Desktop) */}
            <div className="hidden md:block">
              <h4 className="text-small font-semibold uppercase tracking-wide mb-4">FOLLOW US</h4>
              <div className="mb-8">
                <SocialIcons />
              </div>
              <div>
                <h4 className="text-small font-semibold uppercase tracking-wide mb-3">{COMPANY_DESC.title}</h4>
                <p className="text-body opacity-90">{COMPANY_DESC.text}</p>
              </div>
            </div>

            {/* More Info & Quick Links */}
            <LinkList links={MORE_INFO_LINKS} title="MORE INFO" />
            <LinkList links={QUICK_LINKS} title="QUICK LINKS" />

            {/* Logo Column (Desktop) */}
            <div className="hidden md:flex justify-end items-start">
              <img src="/roseateW.svg" alt="Roseate Farms" className="h-24 md:h-32" />
            </div>
          </div>

          {/* Mobile: Follow Us Section */}
          <div className="md:hidden mt-8 pt-8 border-t border-white border-opacity-20">
            <h4 className="text-small font-semibold uppercase tracking-wide mb-4">FOLLOW US</h4>
            <SocialIcons mobile />
          </div>
        </div>

        <div className="border-t border-white border-opacity-20"></div>

        {/* Bottom Section - Copyright */}
        <div className="content py-4">
          <div className="text-center">
            <p className="text-small opacity-80">© 2025 Roseate farms All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
