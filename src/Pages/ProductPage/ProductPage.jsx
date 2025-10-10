import SaleCountdown from "./Components/SaleCountdown"
import ProductBenefits from "../../components/ProductBenefits"
import FAQ from "../../components/FAQ"
import YouMayAlsoLike from "./Components/YouMayAlsoLike"
import Breadcrumb from "../../components/Breadcrumb"
import ProductDetailPage from "./Components/ProductDetailPage"
import ProductReviews from "../../components/ProductReviews"

const ProductPage = () => {
  const benefits = [
    {
      id: 1,
      icon: '/productPage/quality.svg',
      title: 'Premium Quality',
      subtitle: '100% Quality Guarantee'
    },
    {
      id: 2,
      icon: '/productPage/shipping.svg',
      title: 'Swift Shipping',
      subtitle: 'Delivering Across PAN'
    },
    {
      id: 3,
      icon: '/productPage/easy-return.svg',
      title: 'Easy Return',
      subtitle: 'Hassle Return Policy'
    },
    {
      id: 4,
      icon: '/productPage/24by7.svg',
      title: '24/7 Support',
      subtitle: 'Support every time'
    }
  ]

  return (
    <div className="my-10">
      <Breadcrumb />
      <ProductDetailPage />
      <YouMayAlsoLike />
      <SaleCountdown />
      <FAQ />
      <ProductBenefits benefits={benefits} />
      {/* <ProductReviews/> */}
    </div>
  )
}

export default ProductPage
