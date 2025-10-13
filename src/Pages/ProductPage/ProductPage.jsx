import SaleCountdown from "./Components/SaleCountdown"
import ProductBenefits from "../../components/ProductBenefits"
import FAQ from "../../components/FAQ"
import YouMayAlsoLike from "./Components/YouMayAlsoLike"
import Breadcrumb from "../../components/Breadcrumb"
import ProductDetailPage from "./Components/ProductDetailPage"
import ProductReviews from "../../components/ProductReviews"
import { useStorefront } from "../../context/StorefrontContext"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

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

  const { products } = useStorefront()
  const { handle } = useParams()

  const safeDecode = (str = "") => {
    try {
      return decodeURIComponent(str);
    } catch {
      return str; // fallback: return raw if decode fails
    }
  };

  // find current product (by handle; fallback by title)
  const current = useMemo(() => {
    if (!products?.length) return null
    const byHandle = products.find((p) => p.handle === handle)
    if (byHandle) return byHandle
    // fallback: URL may have title instead of handle
    const decoded = safeDecode(handle || '')
    return products.find((p) => p.title === decoded) || null
  }, [products, handle])

  // console.log(current,"hahhahahahahh  ")

  return (
    <div className="my-10">
      <Breadcrumb />
      <ProductDetailPage />
      <ProductReviews shopifyProductGid={current?.id}
        onData={(data) => {
          console.log("JDGM parsed data:", data);
        }}
        debug={true} />
      <YouMayAlsoLike />
      <SaleCountdown />
      <FAQ />
      <ProductBenefits benefits={benefits} />
    </div>
  )
}

export default ProductPage
